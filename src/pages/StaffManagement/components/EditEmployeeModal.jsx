import { Modal, Form, Input, Select } from "antd";
import { genderOptions } from "common/enums/Gender";
import { roleOptions } from "common/enums/Role";
import { useEffect } from "react";


export default function EditEmployeeModal({ open, onCancel, onSave, employee }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (employee) {
      form.setFieldsValue(employee);
    }
  }, [employee, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave({ ...employee, ...values });
      form.resetFields();
    });
  };

  return (
    <Modal
      open={open}
      title="Chỉnh sửa nhân viên"
      onCancel={onCancel}
      onOk={handleOk}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
          <Input disabled /> {/* Email không cho sửa để đảm bảo tính unique */}
        </Form.Item>

        <Form.Item label="Chức vụ" name="position">
          <Input />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phoneNumber">
          <Input />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>

        <Form.Item label="Giới tính" name="gender">
          <Select options={genderOptions} placeholder="Chọn giới tính" />
        </Form.Item>

        <Form.Item label="Vai trò" name="role" rules={[{ required: true }]}>
          <Select options={roleOptions} />
        </Form.Item>

        <Form.Item label="Avatar URL" name="avatarUrl">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
