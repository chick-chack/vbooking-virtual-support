import { useState } from "react";
import { Button, Col, Form, Input, notification, Row, Typography } from "antd";
import { useForm } from "antd/es/form/Form";

import AuthService from "services/auth.service";

import { axiosCatch } from "utils/axiosUtils";
import { LeftArrowSVG } from "assets/jsx-svg";

export default function NewPassword({ setActiveTab, email, code }) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setActiveTab("verificationCode");

    setLoading(true);
    AuthService.verifyForgetPassword({
      email,
      code: code,
      password: values.password,
    })
      .then(({ data }) => {
        notification.success({ message: data.message });
        setActiveTab("1");
      })
      .catch(axiosCatch)
      .finally(() => setLoading(false));
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
          <Typography.Title level={4}>Reset Password</Typography.Title>
        </Row>

        <Row>
          <Typography.Text>Please Enter a New Strong Password</Typography.Text>
        </Row>

        <Row style={{ margin: "50px 0 40px" }} gutter={[0, 24]}>
          <Col xs={24}>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please Enter Password",
                },
              ]}
              label="Password"
              className="w-100"
            >
              <Input.Password
                placeholder="Enter your password"
                className="login-inputs"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please Enter Confirm Password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!",
                      ),
                    );
                  },
                }),
              ]}
              className="w-100"
            >
              <Input.Password
                placeholder="Confirm your password"
                className="login-inputs"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="end" className="mt-1">
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
              Save
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
