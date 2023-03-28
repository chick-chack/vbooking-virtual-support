import { useState } from "react";
import { Button, Col, Form, Input, notification, Row, Typography } from "antd";
import { useForm } from "antd/es/form/Form";

import AuthService from "services/auth.service";

import { axiosCatch } from "utils/axiosUtils";
import { LeftArrowSVG } from "assets/jsx-svg";

export default function ForgotPassword({ setActiveTab, setEmail }) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await AuthService.forgetPassword({ email: values.email });
      setEmail(values.email);
      notification.success({ message: res.data.message });
      setActiveTab("verificationCode");
    } catch (err) {
      axiosCatch(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Row
          gutter={[8, 0]}
          align="middle"
          className="clickable mb-1"
          style={{ width: "fit-content" }}
          onClick={() => setActiveTab("1")}
        >
          <Col>
            <Row align="middle">
              <LeftArrowSVG color="#000" />
            </Row>
          </Col>
          <Col>
            <Typography.Text className="fz-16">Back</Typography.Text>
          </Col>
        </Row>

        <Row className="mb-1">
          <Typography.Title level={4}>Forgot password</Typography.Title>
        </Row>

        <Row>
          <Typography.Text>
            Please enter your email address.
            <br /> You will receive a code to create a new password via email.
          </Typography.Text>
        </Row>

        <Row style={{ margin: "50px 0 40px" }}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please Enter E-mail",
              },
            ]}
            className="w-100"
          >
            <Input type="email" placeholder="Email" className="login-inputs" />
          </Form.Item>
        </Row>

        <Row justify="end">
          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              style={{
                width: "170px",
                fontSize: "1rem",
                borderRadius: "14px",
              }}
              loading={loading}
            >
              Send
            </Button>
          </Form.Item>
        </Row>

        <Row style={{ marginTop: "160px" }}>
          <Typography.Text className="fz-12">
            Protected by reCAPTCHA and subject to the{" "}
            <span style={{ color: "#6DAE1F" }}>Vverse Privacy Policy</span> and{" "}
            <span style={{ color: "#6DAE1F" }}>Terms of Service.</span>
          </Typography.Text>
        </Row>
      </Form>
    </div>
  );
}
