import { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Form,
  Input,
  Row,
  Typography,
  notification,
} from "antd";

import { ArrowRightSVG, SearchSVG } from "assets/jsx-svg";

export default function CounterParticipants({
  setActiveBtn,
  participants,
  counterForm,
  SystemMessage,
  counterActiveBtn,
  setAskedForCounter,
}) {
  const [participantsForm] = Form.useForm();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showParticipants, setShowParticipants] = useState(
    participants.filter((participant) => !participant.isHost),
  );

  useMemo(() => {
    if (searchValue) {
      setShowParticipants(
        participants?.filter(
          (participant) =>
            !participant.isHost &&
            participant.name.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      );
    } else {
      setShowParticipants(
        participants.filter((participant) => !participant.isHost),
      );
    }
  }, [participants, searchValue]);

  const onSearch = (e) => {
    let value = e.target.value;
    setSearchValue(value.trim());
  };

  const onFinish = (values) => {
    console.warn(counterForm.getFieldValue("fileName"));
    const fileName = counterForm.getFieldValue("fileName");
    const customField = counterForm.getFieldValue("customField");

    if (values.users.length) {
      if (counterActiveBtn === 1 || counterActiveBtn === 2) {
        SystemMessage.askSelectedUserForCounter({
          users: values.users,
          formData: {
            type: counterActiveBtn,
            message: `${counterActiveBtn === 1 ? "full name" : "signature"}`,
          },
        });
        notification.success({ message: "Invitation send Succesfully ✔" });
        participantsForm.setFieldValue("users", undefined);
      }

      if (counterActiveBtn === 3 && fileName) {
        SystemMessage.askSelectedUserForCounter({
          users: values.users,
          formData: {
            type: counterActiveBtn,
            message: `${fileName} file`,
            fileName: fileName,
          },
        });
        notification.success({ message: "Invitation send Succesfully ✔" });
        participantsForm.setFieldValue("users", undefined);
        setActiveBtn("counterUserSharedData");
      } else if (counterActiveBtn === 3 && !fileName) {
        notification.error({ message: "You should fill the file name" });
        setActiveBtn("counter");
      }

      if (counterActiveBtn === 4 && customField) {
        SystemMessage.askSelectedUserForCounter({
          users: values.users,
          formData: {
            type: counterActiveBtn,
            message: `${customField} file`,
            customField: customField,
          },
        });
        notification.success({ message: "Invitation send Succesfully ✔" });
        participantsForm.setFieldValue("users", undefined);
        setActiveBtn("counterUserSharedData");
      } else if (counterActiveBtn === 4 && !customField) {
        notification.error({ message: "You should fill the file name" });
        setActiveBtn("counter");
      }

      setAskedForCounter(true);
      setActiveBtn("counterUserSharedData");
    }
  };

  return (
    <section className="h-100">
      <Row
        wrap={false}
        align="middle"
        gutter={[8, 0]}
        style={{ width: "fit-content" }}
        className="clickable"
        onClick={() => setActiveBtn("counter")}
      >
        <Col>
          <Row align="middle">
            <ArrowRightSVG color="#8E8E93" style={{ rotate: "180deg" }} />
          </Row>
        </Col>
        <Col>
          <Typography.Text className="gc">Back</Typography.Text>
        </Col>
      </Row>

      <Form form={participantsForm} onFinish={onFinish} className="h-100">
        <ConfigProvider
          theme={{
            components: {
              Checkbox: {
                borderRadiusSM: "4px",
                colorBgContainer: "transparent",
                colorPrimary: "#5c9937",
                colorWhite: "#fff",
                colorPrimaryHover: "#5c9937",
                colorPrimaryBorder: "#eee",
              },
            },
          }}
        >
          <Row
            gutter={[0, 14]}
            style={{ flexDirection: "column" }}
            justify="space-between"
            className="w-100"
          >
            <Col flex={1}>
              <Row gutter={[0, 14]} className="mt-1">
                <Row>
                  <Typography.Text className="fz-16 fw-500">
                    Select Participants
                  </Typography.Text>
                </Row>
                <Col xs={24} style={{ paddingRight: "0.5rem" }}>
                  <Row className="counter-search-input">
                    <Input
                      onChange={onSearch}
                      placeholder="Search"
                      prefix={
                        <SearchSVG color="#dedede" style={{ scale: "0.8" }} />
                      }
                    />
                  </Row>
                </Col>

                <Col
                  xs={24}
                  style={{
                    maxHeight: "70vh",
                    overflowY: "auto",
                    paddingRight: "0.5rem",
                  }}
                >
                  <Row gutter={[0, 20]} className="custome-checkbox-reversed">
                    <Form.Item name="users" noStyle>
                      <Checkbox.Group
                        style={{
                          height: "calc(100% - 40px)",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          rowGap: "16px",
                        }}
                        className="w-100"
                        onChange={(e) => setSelectedUsers(e)}
                      >
                        {showParticipants.map((user) => (
                          <Checkbox value={user.uid} key={user.uid}>
                            <Row align="middle" gutter={[12, 0]} wrap={false}>
                              <Col>
                                <Avatar
                                  src={user.profileImage}
                                  alt={user.name}
                                  size={35}
                                />
                              </Col>
                              <Col>
                                <Typography.Text className="fw-500">
                                  {user.name}
                                </Typography.Text>
                              </Col>
                            </Row>
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    </Form.Item>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  borderRadius: "14px",
                  height: "36px",
                  padding: "0px 16px",
                  fontWeight: "500",
                  fontSize: "14px",
                  textOverflow: "ellipsis",
                }}
                className="w-100"
                disabled={!selectedUsers.length}
              >
                Send
              </Button>
            </Col>
          </Row>
        </ConfigProvider>
      </Form>
    </section>
  );
}
