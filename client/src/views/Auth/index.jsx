import { useEffect, useState } from "react";
import { Avatar, Col, Image, Row, Tabs, Typography } from "antd";

import mapOfWorld from "assets/images/mapOfWorld.png";
import vverseLogo from "assets/images/vverseLogo.png";

import Login from "./Login";
import Signup from "./Signup";
import "./style.css";
import ForgotPassword from "./ForgotPassword";
import VerificationCode from "./VerificationCode";
import NewPassword from "./NewPassword";
import { Link, useSearchParams } from "react-router-dom";

export default function LoginView() {
  const [activeTab, setActiveTab] = useState("1");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [searchParam] = useSearchParams();

  useEffect(() => {
    if (searchParam.get("tab") === "signup") {
      setActiveTab("2");
    }
  }, [searchParam]);

  return (
    <main
      className="login-main login-bg"
      style={{ background: `url(${mapOfWorld})`, backgroundColor: "#fff" }}
    >
      <div className="login-main-container">
        <Row justify="space-between" align="middle" gutter={[0, 24]}>
          <Col lg={12} md={12} xs={24}>
            <Row gutter={[0, 24]}>
              <Col xs={24}>
                <Link to="/">
                  <Image preview={false} src={vverseLogo} />
                </Link>
              </Col>
              <Col xs={24}>
                <Typography.Text className="login-text">
                  REAL WORLD USE METAVERSE
                  <span style={{ color: "#000" }}>.</span>
                </Typography.Text>
              </Col>
            </Row>

            <Row align="middle" gutter={[12, 12]} style={{ marginTop: "90px" }}>
              <Col>
                <Avatar.Group
                  maxPopoverTrigger="click"
                  size="large"
                  maxStyle={{
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                    cursor: "pointer",
                  }}
                >
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                </Avatar.Group>
              </Col>
              <Col>
                <Typography.Text className="fw-600">
                  3k+ people joined us, now it’s your turn
                </Typography.Text>
              </Col>
            </Row>
          </Col>
          <Col lg={8} md={12} xs={24}>
            <div className="login-card">
              {(activeTab === "1" || activeTab === "2") && (
                <Tabs activeKey={activeTab} onChange={(e) => setActiveTab(e)}>
                  <Tabs.TabPane
                    tab={
                      <Typography.Text ellipsis className="fz-18">
                        SIGN IN
                      </Typography.Text>
                    }
                    style={{ width: "fit-content" }}
                    key="1"
                  >
                    <Login setActiveTab={setActiveTab} />
                  </Tabs.TabPane>
                  <Tabs.TabPane
                    tab={
                      <Typography.Text ellipsis className="fz-18">
                        SIGN UP
                      </Typography.Text>
                    }
                    style={{ width: "fit-content" }}
                    key="2"
                  >
                    <Signup setActiveTab={setActiveTab} />
                  </Tabs.TabPane>
                </Tabs>
              )}

              {activeTab === "forgotPassword" && (
                <ForgotPassword
                  setActiveTab={setActiveTab}
                  setEmail={setEmail}
                />
              )}

              {activeTab === "verificationCode" && (
                <VerificationCode
                  setActiveTab={setActiveTab}
                  email={email}
                  setCode={setCode}
                />
              )}

              {activeTab === "newPassword" && (
                <NewPassword
                  setActiveTab={setActiveTab}
                  email={email}
                  code={code}
                />
              )}
            </div>
          </Col>
        </Row>
      </div>

      <Row justify="center" align="bottom">
        <Typography.Text style={{ color: "#A5A299" }}>
          All Rights Reserved © {new Date().getFullYear()}
        </Typography.Text>
      </Row>
    </main>
  );
}
