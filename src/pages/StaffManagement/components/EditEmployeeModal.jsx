import { Modal, Form, Input } from "antd";
import React, { useEffect } from "react";

export default function EditEmployeeModal({ open, onCancel, onSave, employee }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (employee) {
      form.setFieldsValue(employee);
    }
  }, [employee]);

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
          <Input />
        </Form.Item>
        <Form.Item label="Chức vụ" name="role" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
