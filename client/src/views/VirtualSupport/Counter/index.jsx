import { Button, Col, Form, Input, Row, Typography, notification } from "antd";

import {
  CounterFileSVG,
  FullNameSVG,
  SignatureSVG,
  PluseSVG,
} from "assets/jsx-svg";

import "./styles.css";
import { useContext } from "react";
import userContext from "context/userContext";

export default function Counter({
  setActiveBtn,
  SystemMessage,
  counterForm,
  counterActiveBtn,
  setCounterActiveBtn,
  setAskedForCounter,
  iframeRef,
  participants,
}) {
  const { user } = useContext(userContext);
  const onFinish = (values) => {
    SystemMessage.askAllUserForCounter({
      formData: {
        type: counterActiveBtn,
        message: `${values.fileName} file`,
        fileName: values.fileName,
        customField: values.customField,
      },
    });
    if (iframeRef) {
      participants.forEach((participant) => {
        if (participant.uid === user.id) return;
        iframeRef.contentWindow?.unityInstance?.SendMessage(
          "BG_Scripts/JsBridge",
          "SendInputRequest",
          JSON.stringify({
            userId: participant.uid,
            type: counterActiveBtn,
            fileName: values.fileName ? values.fileName : null,
            customField: values.customField ? values.customField : null,
          }),
        );
      });
    }
    notification.info({
      message: "Notification has been send to participants to submit.",
    });
    setAskedForCounter(true);
    setActiveBtn("counterUserSharedData");
    counterForm.resetFields();
  };

  return (
    <Form
      name="counter-form"
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
      form={counterForm}
      className="w-100 h-100"
    >
      <Row
        gutter={[0, 24]}
        className="counter-section h-100"
        justify="space-between"
      >
        <Col flex={1}>
          <Row>
            <Typography.Text className="fz-18 fw-500">Counter</Typography.Text>
          </Row>

          <Row
            style={{ margin: "24px 0 24px" }}
            justify="space-between"
            align="middle"
            gutter={[12, 0]}
          >
            <Col>
              <Typography.Text className="fz-16 fw-500">
                Ask Participants For Data or Files
              </Typography.Text>
            </Col>

            <Col>
              <Button
                type="primary"
                onClick={() => {
                  setActiveBtn("counterUserSharedData");
                }}
              >
                Users Data
              </Button>
            </Col>
          </Row>
          <Row gutter={[14, 16]}>
            {counterButtons.map((btn) => (
              <Col key={btn.id} xs={24} md={12}>
                <button
                  className={`counter-btn ${
                    counterActiveBtn === btn.id && "counter-btn-active"
                  }`}
                  type="button"
                  onClick={() => setCounterActiveBtn(btn.id)}
                >
                  <Row gutter={[12, 0]} align="middle" wrap={false}>
                    <Col>
                      <Row align="middle">
                        <btn.icon />
                      </Row>
                    </Col>
                    <Col>
                      <Typography.Text ellipsis>{btn.label}</Typography.Text>
                    </Col>
                  </Row>
                </button>
              </Col>
            ))}

            {counterActiveBtn === 3 && (
              <Col xs={24}>
                <Form.Item
                  rules={[
                    {
                      required: counterActiveBtn === 3,
                      message: "Please Enter The File Name",
                    },
                  ]}
                  name="fileName"
                  label="File Name"
                >
                  <Input
                    placeholder="Enter Here"
                    style={{ background: "#fff" }}
                  />
                </Form.Item>
              </Col>
            )}

            {counterActiveBtn === 4 && (
              <Col xs={24}>
                <Form.Item
                  rules={[
                    {
                      required: counterActiveBtn === 4,
                      message: "Please Enter The Field Title",
                    },
                  ]}
                  name="customField"
                  label="Field Title"
                >
                  <Input
                    placeholder="Enter Here"
                    style={{ background: "#fff" }}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Col>

        <Col>
          <Row gutter={[14, 16]}>
            <Col xs={24} md={12}>
              <button
                onClick={() => setActiveBtn("counterParticipants")}
                className="gradiant-border-btn w-100 counter-gradiant-btn"
                data="Select participants"
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "12px",
                }}
              ></button>
            </Col>
            <Col xs={24} md={12}>
              <Button
                style={{
                  borderRadius: "12px",
                }}
                type="primary"
                className="w-100"
                htmlType="submit"
              >
                Send to All
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
}

const counterButtons = [
  { id: 1, label: "Full Name", icon: FullNameSVG },
  { id: 2, label: "Signature", icon: SignatureSVG },
  { id: 3, label: "File", icon: CounterFileSVG },
  { id: 4, label: "Custom Field", icon: PluseSVG },
];
