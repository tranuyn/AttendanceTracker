import React, { useEffect } from "react";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ReportTimesheetModal = ({ open, onCancel, onSubmit, record }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        date: record.date,
      });
    }
  }, [record]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      message.success("Báo lỗi đã được gửi!");
      onSubmit({
        ...record,
        ...values,
      });
      form.resetFields();
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Gửi"
      cancelText="Hủy"
      title="Báo lỗi chấm công"
    >
      <Form layout="vertical" form={form}>
        <Form.Item label="Ngày chấm công">
          <Input value={record?.date} disabled />
        </Form.Item>

        <Form.Item
          name="note"
          label="Lý do báo lỗi"
          rules={[{ required: true, message: "Vui lòng nhập lý do!" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập lý do báo lỗi..." />
        </Form.Item>

        <Form.Item
          name="attachment"
          label="Ảnh chứng minh"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload
            name="file"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // không upload lên ngay
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportTimesheetModal;
