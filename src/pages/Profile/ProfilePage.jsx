// pages/ProfileForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { InputComponent } from "../../components/InputComponent";
import { Button, Row, Col, Card, Avatar } from "antd";

const Profile = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <Card style={{ maxWidth: 900, margin: "auto", marginTop: 40 }}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
        >
          <Avatar
            size={80}
            src="https://randomuser.me/api/portraits/women/68.jpg"
          />
          <div style={{ marginLeft: 16 }}>
            <h2 style={{ marginBottom: 4 }}>Alexa Rawles</h2>
            <p style={{ color: "#888" }}>alexarawles@gmail.com</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={16}>
            <Col span={12}>
              <InputComponent
                control={control}
                name="fullName"
                label="Full Name"
                placeholder="Your First Name"
              />
            </Col>
            <Col span={12}>
              <InputComponent
                control={control}
                name="nickName"
                label="Nick Name"
                placeholder="Your First Name"
              />
            </Col>

            <Col span={12}>
              <InputComponent
                control={control}
                name="gender"
                label="Gender"
                placeholder="Your First Name"
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
              />
            </Col>
            <Col span={12}>
              <InputComponent
                control={control}
                name="country"
                label="Country"
                placeholder="Your First Name"
                options={[
                  { label: "United States", value: "us" },
                  { label: "Vietnam", value: "vn" },
                ]}
              />
            </Col>

            <Col span={12}>
              <InputComponent
                control={control}
                name="language"
                label="Language"
                placeholder="Your First Name"
                options={[
                  { label: "English", value: "en" },
                  { label: "Vietnamese", value: "vi" },
                ]}
              />
            </Col>
            <Col span={12}>
              <InputComponent
                control={control}
                name="timeZone"
                label="Time Zone"
                placeholder="Your First Name"
                options={[
                  { label: "GMT+7", value: "gmt+7" },
                  { label: "GMT-8", value: "gmt-8" },
                ]}
              />
            </Col>
          </Row>

          <div style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
