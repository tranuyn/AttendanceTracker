// EditEmployeeModal.jsx
import { Modal, Form, Input, Select, DatePicker } from "antd";
import { genderOptions } from "common/enums/Gender";
import { roleOptions } from "common/enums/Role";
import { useEffect } from "react";
import dayjs from "dayjs";

export default function EditEmployeeModal({ open, onCancel, onSave, employee }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        ...employee,
        dateOfBirth: employee.dateOfBirth ? dayjs(employee.dateOfBirth) : null,
      });
    } else {
      form.resetFields();
    }
  }, [employee, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.toISOString()
          : null, // chuẩn hóa về định dạng ISO
      };
      onSave(payload);
      form.resetFields();
    });
  };

  return (
    <Modal
      open={open}
      title={employee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input disabled={!!employee} />
        </Form.Item>

        <Form.Item label="Chức vụ" name="position">
          <Input />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phoneNumber">
          <Input />
        </Form.Item>

        <Form.Item
          label="Ngày sinh"
          name="dateOfBirth"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            placeholder="Chọn ngày sinh"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>

        <Form.Item label="Giới tính" name="gender">
          <Select options={genderOptions} placeholder="Chọn giới tính" />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select options={roleOptions} />
        </Form.Item>

        <Form.Item label="Avatar URL" name="avatarUrl">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
