import { useContext, useState, useCallback } from "react";
import { Button, Col, Divider, Form, Input, Row, Typography } from "antd";
import { useForm } from "antd/es/form/Form";

import UserContext from "context/userContext";
import AuthService from "services/auth.service";

import { AppleSVG, FacebookSVG, GoogleSVG } from "assets/jsx-svg";
import { axiosCatch } from "utils/axiosUtils";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function Signup({ setActiveTab }) {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const signUp = async (values) => {
    setLoading(true);
    const { confirmPassword, ...data } = values;
    const queryParams = new URLSearchParams(location.search);
    const link = queryParams.get("redirectUrl") || "/";

    try {
      const {
        data: { data: user },
      } = await AuthService.signup(data);

      localStorage.setItem(
        "vverse-token",
        user.customerWebDashboardAccessToken,
      );
      axios.defaults.headers.authorization =
        user.customerWebDashboardAccessToken;
      setUser(user);
      navigate(link);
    } catch (error) {
      axiosCatch(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={signUp} requiredMark={false}>
      <Row gutter={[0, 24]}>
        <Col xs={24}>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please Enter E-mail",
              },
            ]}
            label="Email"
            className="w-100"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="login-inputs"
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please Enter First Name",
              },
            ]}
            label="First Name"
            className="w-100"
          >
            <Input placeholder="Enter fisrt name" className="login-inputs" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please Enter Last Name",
              },
            ]}
            label="Last Name"
            className="w-100"
          >
            <Input placeholder="Enter last name" className="login-inputs" />
          </Form.Item>
        </Col>
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

      <Row justify="end" align="middle">
        <Col xs={10}>
          <Form.Item className="w-100">
            <Button
              loading={loading}
              type="primary"
              className="sign-in-btn"
              htmlType="submit"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Col>
      </Row>

      <Divider>
        <Typography.Text style={{ color: "#8E8E93" }}>or</Typography.Text>
      </Divider>

      <Row gutter={[0, 24]} className="mt-1">
        <Col xs={24}>
          <Row justify="center" gutter={[16, 16]}>
            <Col>
              <div className="login-icons">
                <Row align="middle"></Row>
              </div>
            </Col>
            <Col>
              <div className="login-icons">
                <Row align="middle"></Row>
              </div>
            </Col>
            <Col>
              <div className="login-icons">
                <Row align="middle"></Row>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24}>
          <Row justify="center">
            <Typography.Text style={{ color: "#8E8E93" }}>
              Don't have an account?{" "}
              <span
                style={{ color: "#000" }}
                className="clickable"
                onClick={() => setActiveTab("1")}
              >
                Sign In
              </span>
            </Typography.Text>
          </Row>
        </Col>
      </Row>
    </Form>
  );
}
