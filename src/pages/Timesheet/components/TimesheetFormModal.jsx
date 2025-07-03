import { Modal, Form, DatePicker, TimePicker, Button } from "antd";
import React from "react";

const TimesheetFormModal = ({
  visible,
  onCancel,
  onSubmit,
  form,
  editingRecord,
}) => {
  return (
    <Modal
      title={editingRecord ? "Chỉnh sửa chấm công" : "Thêm chấm công"}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Form.Item
          name="date"
          label="Ngày"
          rules={[{ required: true, message: "Chọn ngày!" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="checkIn"
          label="Giờ vào"
          rules={[{ required: true, message: "Chọn giờ vào!" }]}
        >
          <TimePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="checkOut"
          label="Giờ ra"
          rules={[{ required: true, message: "Chọn giờ ra!" }]}
        >
          <TimePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>
        <div className="flex justify-end space-x-2">
          <Button color="danger" variant="filled" onClick={onCancel}>Hủy</Button>
          <Button color="primary" variant="filled" htmlType="submit">
            {editingRecord ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TimesheetFormModal;
