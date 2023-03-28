import { useEffect, useRef } from "react";
import { Button, Col, Form, Image, Input, Row, Spin, Typography } from "antd";
import { useForm } from "antd/es/form/Form";

import { PaperclipSVG, SendSVG } from "assets/jsx-svg";
import profileImg from "assets/images/avatar.png";

import "./styles.css";

export default function MeetChat({
  loading,
  messages,
  sendMessage,
  noMarign = false,
}) {
  const [form] = useForm();

  const messageListEndRef = useRef();

  const onFinish = async (values) => {
    const msg = values?.message?.trim();

    if (msg) {
      form.setFieldValue("message", "");
      await sendMessage(msg);
      messageListEndRef.current?.scrollIntoView();
    }
  };

  useEffect(() => {
    if (messages.length) {
      messageListEndRef.current?.scrollIntoView();
    }
  }, [messages]);

  return (
    <Spin spinning={loading}>
      <Row className="support-chat" style={{ margin: noMarign && "1rem 0rem" }}>
        <div className="meet-chat-panel">
          <div className="chat-list">
            {messages?.map((message, index) => (
              <Row
                key={index}
                align="middle"
                wrap={false}
                style={{ flexDirection: message.owner && "row-reverse" }}
              >
                <Image
                  preview={false}
                  width={45}
                  height={45}
                  src={message.profileImage || profileImg}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <Row
                  className="chat-message"
                  style={{
                    marginInlineEnd: message.owner && "0.5rem",
                    borderRadius: message.owner && "15px 3px 15px 15px",
                  }}
                >
                  <Col xs={24}>
                    <Row justify={message.owner ? "end" : "start"}>
                      <Typography.Text className="fz-12 fw-600">
                        {message.name}
                      </Typography.Text>
                    </Row>
                  </Col>
                  <Col xs={24}>
                    <Row justify={message.owner ? "end" : "start"}>
                      <Typography.Text className="fw-400">
                        {message.msg}
                      </Typography.Text>
                    </Row>
                  </Col>
                </Row>
              </Row>
            ))}
            <span
              ref={messageListEndRef}
              style={{
                minHeight: "1px",
                overflowAnchor: "auto",
                scrollMarginBottom: "50px",
              }}
            />
          </div>

          <Form form={form} onFinish={onFinish}>
            <Row align="middle" justify="space-between" wrap={false}>
              <Col flex={1} className="mr-1">
                <Form.Item name="message">
                  <Input
                    className="message-input"
                    prefix={<PaperclipSVG />}
                    placeholder="Message.."
                  />
                </Form.Item>
              </Col>

              <Col>
                <Form.Item>
                  <Button
                    type="primary"
                    shape="circle"
                    className="center-items"
                    htmlType="submit"
                  >
                    <SendSVG style={{ width: "16px" }} />
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Row>
    </Spin>
  );
}
