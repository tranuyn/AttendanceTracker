import { EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Row, Typography, Upload } from "antd";
import useApp from "antd/es/app/useApp";
import { genderOptions } from "common/enums/Gender";
import { roleOptions } from "common/enums/Role";
import { normalizeEmpty } from "common/utilities/string";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "store/userSlice";
import { InputComponent } from "../../components/InputComponent";
import { useProfileService } from "../../services/profileService";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const Profile = () => {
  const { message } = useApp();
  const user = useSelector((state) => state.user.currentUser);
  const { getMyProfile, updateProfile } = useProfileService();
  const [avatarPreview, setAvatarPreview] = React.useState(
    user?.avatarUrl || ""
  );
  const [avatarFile, setAvatarFile] = React.useState(null);
  const dispatch = useDispatch();

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      gender: "",
      phoneNumber: "",
      address: "",
      position: "",
      role: "",
      avatarUrl: "",
      dateOfBirth: null,
    },
  });
  const watchedName = watch("fullName");
  const watchedEmail = watch("email");
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.name || "",
        email: user.email || "",
        gender: user.gender || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        position: user.position || "",
        role: user.role || "",
        avatarUrl: user.avatarUrl || "",
        dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
      });
    }
  }, [user, reset]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const onSubmit = async (formData) => {
    try {
      let avatarUrl = user?.avatarUrl;

      // Nếu user chọn ảnh mới
      if (avatarFile) {
        avatarUrl = await convertToBase64(avatarFile);
      }
      if (!avatarFile && !user?.avatarUrl) {
        message.error("Ảnh đại diện không được để trống");
        return;
      }

      const payload = {
        name: normalizeEmpty(formData.fullName),
        email: normalizeEmpty(formData.email),
        gender: normalizeEmpty(formData.gender),
        phoneNumber: normalizeEmpty(formData.phoneNumber),
        address: normalizeEmpty(formData.address),
        position: normalizeEmpty(formData.position),
        role: normalizeEmpty(formData.role),
        avatarUrl,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString() : null,
      };

      await updateProfile(payload);

      const updatedUser = await getMyProfile();
      dispatch(setUser(updatedUser));
      message.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Update profile error:", error);
      message.error("Cập nhật thông tin thất bại!");
    }
  };

  return (
    <div className="flex items-center justify-center px-10 py-5">
      <Card style={{ width: "100%", padding: 5 }}>
        <div className="flex items-center mb-6">
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              setAvatarFile(file);
              setAvatarPreview(URL.createObjectURL(file));
              return false; // Ngăn Ant Design tự upload
            }}
          >
            <div className="relative">
              <Avatar
                size={80}
                src={avatarPreview || user?.avatarUrl}
                className="cursor-pointer transition hover:opacity-80"
              />
              <EditOutlined
                style={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  background: "#fff",
                  borderRadius: "50%",
                  padding: 4,
                  fontSize: 14,
                  boxShadow: "0 0 2px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          </Upload>
          <div className="ml-4">
            <Title level={4} style={{ margin: 0 }}>
              {watchedName}
            </Title>
            <Text type="secondary">{watchedEmail}</Text>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={16}>
            <Col span={12}>
              <InputComponent
                control={control}
                name="fullName"
                label="Full Name"
                placeholder="Enter full name"
                rules={{
                  required: "Họ tên không được để trống",
                  validate: (value) =>
                    value.trim() !== "" ||
                    "Tên không được chỉ chứa khoảng trắng",
                }}
              />
            </Col>
            <Col span={12}>
              <InputComponent
                control={control}
                name="email"
                label="Email"
                placeholder="Enter email"
                rules={{
                  required: "Email không được để trống",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ",
                  },
                }}
              />
            </Col>

            <Col span={12}>
              <InputComponent
                control={control}
                name="gender"
                label="Gender"
                options={genderOptions}
                rules={{ required: "Vui lòng chọn giới tính" }}
              />
            </Col>
            <Col span={12}>
              <InputComponent
                control={control}
                name="dateOfBirth"
                label="Ngày sinh"
                type="date"
                placeholder="Chọn ngày sinh"
                rules={{
                  required: "Vui lòng chọn ngày sinh",
                }}
              />
            </Col>

            <Col span={12}>
              <InputComponent
                control={control}
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter phone number"
                rules={{
                  required: "Số điện thoại không được để trống",
                  pattern: {
                    value: /^[0-9+]{9,15}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                }}
              />
            </Col>

            <Col span={24}>
              <InputComponent
                control={control}
                name="address"
                label="Address"
                placeholder="Enter your address"
              />
            </Col>

            <Col span={12}>
              <InputComponent
                control={control}
                name="position"
                label="Position"
                placeholder="Enter your job title"
              />
            </Col>

            <Col span={12}>
              <InputComponent
                control={control}
                name="role"
                label="Role"
                options={ roleOptions }
                rules={{ required: "Vai trò không được để trống" }}
              />
            </Col>
          </Row>

          <div className="text-right mt-6">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
