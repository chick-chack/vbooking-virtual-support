import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Form,
  Input,
  notification,
  Row,
  Typography,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { axiosCatch } from "utils/axiosUtils";
import ParticipantsService from "services/participants.service";

import "./styles.css";

export default function InviteFriends() {
  const [form] = Form.useForm();
  const [nameSearch, setNameSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (name) => {
    try {
      setLoading(true);
      if (name.length) {
        const res = await ParticipantsService.SearchUser(
          new URLSearchParams({
            name,
            limit: 20,
            offset: 0,
          }),
        );
        setUsers(res.data.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      axiosCatch(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => handleSearch(nameSearch), 500);
    return () => clearTimeout(timeOutId);
  }, [nameSearch]);

  const onFinish = (values) => {
    if (values.users.length) {
      notification.success({ message: "Invitation send Succesfully ✔" });
      form.setFieldValue("users", undefined);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} className="invite-friends">
      <Form.Item name="users" noStyle>
        <Checkbox.Group>
          <ConfigProvider
            theme={{
              token: {
                colorPrimaryText: "#fff",
                borderRadius: "14px",
                colorBorder: "#fff",
                colorText: "#fff",
                colorTextPlaceholder: "#fff",
              },
              components: {
                Checkbox: {
                  borderRadiusSM: "4px",
                  colorBgContainer: "transparent",
                  colorPrimary: "#fff",
                  colorWhite: "#000",
                  colorPrimaryHover: "#fff",
                  colorPrimaryBorder: "#eee",
                },
                Input: {
                  colorPrimaryHover: "#fff",
                },
              },
            }}
          >
            <Row gutter={[0, 10]}>
              <Col xs={24}>
                <Row justify="center">
                  <Typography.Text className="fz-16 fw-600">
                    Invite Friends
                  </Typography.Text>
                </Row>
              </Col>
              <Col xs={24} style={{ padding: "0rem 1rem" }}>
                <Input
                  onChange={(e) => setNameSearch(e.target.value)}
                  placeholder="Search"
                  style={{ height: "40px" }}
                />
              </Col>
              {loading ? (
                <Col xs={24}>
                  <Row justify="center">
                    <LoadingOutlined />
                  </Row>
                </Col>
              ) : (
                <Col
                  xs={24}
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    padding: "0rem 1rem",
                  }}
                >
                  <Row gutter={[0, 12]}>
                    {users?.map((user) => (
                      <Col xs={24} key={user.id}>
                        <Row align="middle">
                          <Col flex={1}>
                            <Row align="middle" gutter={[12, 0]} wrap={false}>
                              <Col>
                                <Avatar
                                  src={user.profileImage}
                                  alt={user.firstName}
                                  size={40}
                                />
                              </Col>
                              <Col>
                                <Typography.Text className="fw-500">
                                  {user.firstName + " " + user.lastName}
                                </Typography.Text>
                              </Col>
                            </Row>
                          </Col>
                          <Col>
                            <Checkbox value={user.id} />
                          </Col>
                        </Row>
                      </Col>
                    ))}

                    <Col xs={24} style={{ height: "20px" }}></Col>
                  </Row>
                </Col>
              )}
            </Row>

            <sapn className="invite-friends-btn">
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  borderRadius: "32px",
                  height: "36px",
                  padding: "0px 16px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Send Invitation
              </Button>
            </sapn>
          </ConfigProvider>
        </Checkbox.Group>
      </Form.Item>
    </Form>
  );
}
