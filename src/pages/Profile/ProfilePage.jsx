import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { InputComponent } from "../../components/InputComponent";
import { Button, Row, Col, Card, Avatar, Typography } from "antd";
import { useSelector } from "react-redux";

const { Title, Text } = Typography;

const Profile = () => {
  const user = useSelector((state) => state.user.currentUser);

  const {
    control,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      gender: "",
      phoneNumber: "",
      address: "",
      position: "",
      country: "",
      language: "",
      timeZone: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.name || "",
        email: user.email || "",
        gender: user.gender || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        position: user.position || "",
        country: "",
        language: "",
        timeZone: "",
      });
    }
  }, [user, reset]);


  const onSubmit = (data) => {
    console.log("Form data:", data);
    // TODO: Gửi dữ liệu lên backend
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-10 py-5">
      <Card style={{ width: "100%", padding: 24 }}>
        <div className="flex items-center mb-6">
          <Avatar size={80} src={user?.avatarUrl} />
          <div className="ml-4">
            <Title level={4} style={{ margin: 0 }}>
              {user?.name}
            </Title>
            <Text type="secondary">{user?.email}</Text>
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
              />
            </Col>
            <Col span={12}>
              <InputComponent
                control={control}
                name="email"
                label="Email"
                placeholder="Enter email"
              />
            </Col>

            <Col span={12}>
              <InputComponent
                control={control}
                name="gender"
                label="Gender"
                options={[
                  { label: "Male", value: "MALE" },
                  { label: "Female", value: "FEMALE" },
                  { label: "Other", value: "OTHER" },
                ]}
              />
            </Col>
            <Col span={12}>
              <InputComponent
                control={control}
                name="phoneNumber"
                label="Phone Number"
                placeholder="Enter phone number"
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
                name="timeZone"
                label="Time Zone"
                options={[
                  { label: "GMT+7", value: "gmt+7" },
                  { label: "GMT-8", value: "gmt-8" },
                ]}
              />
            </Col>

            <Col span={12}>
              <InputComponent
                control={control}
                name="language"
                label="Language"
                options={[
                  { label: "English", value: "en" },
                  { label: "Vietnamese", value: "vi" },
                ]}
              />
            </Col>

            <Col span={12}>
              <InputComponent
                control={control}
                name="country"
                label="Country"
                options={[
                  { label: "Vietnam", value: "vn" },
                  { label: "United States", value: "us" },
                ]}
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
