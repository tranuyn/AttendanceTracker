import React, { useEffect } from "react";
import { Modal, Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ReportTimesheetModal = ({ open, onCancel, onSubmit, record }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        date: record.date,
        note: record.complain?.content || "",
        attachment: record.complain?.complainImageUrl
          ? [
              {
                uid: "-1",
                name: "complain.jpg",
                status: "done",
                url: record.complain.complainImageUrl,
              },
            ]
          : [],
      });
    }
  }, [record, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const fileList = values.attachment;
      const file = fileList?.[0]?.originFileObj || null;

      const body = {
        attendanceId: record.id,
        content: values.note,
        complainImage: file,
        complainid: record.complain?.id || null,
      };

      onSubmit(body, !!record.complain);
      form.resetFields();
    });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okText={record?.complain ? "Cập nhật" : "Gửi"}
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
          getValueFromEvent={normFile}
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
