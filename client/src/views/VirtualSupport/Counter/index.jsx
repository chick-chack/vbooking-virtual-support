import { useState } from "react";
import { Button, Col, Form, Input, Row, Typography } from "antd";

import {
  CounterFileSVG,
  FullNameSVG,
  SignatureSVG,
  PluseSVG,
} from "assets/jsx-svg";

import "./styles.css";

export default function Counter({ setActiveBtn }) {
  const [form] = Form.useForm();
  const [counterActiveBtn, setCounterActiveBtn] = useState(null);

  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Row className="counter-section h-100" justify="space-between">
      <Col flex={1}>
        <Row>
          <Typography.Text className="fz-18 fw-500">Counter</Typography.Text>
        </Row>

        <Row style={{ margin: "24px 0 24px" }}>
          <Typography.Text className="fz-16 fw-500">
            Ask Participants For Data or Files
          </Typography.Text>
        </Row>
        <Row gutter={[14, 16]}>
          {counterButtons.map((btn) => (
            <Col key={btn.id} xs={24} md={12}>
              <button
                className={`counter-btn ${
                  counterActiveBtn === btn.id && "counter-btn-active"
                }`}
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

          <Form
            layout="vertical"
            requiredMark={false}
            name="counter-form"
            form={form}
            onFinish={onFinish}
            className="w-100"
          >
            {counterActiveBtn === 3 && (
              <Col xs={24}>
                <Form.Item name="fileName" label="File Name">
                  <Input
                    placeholder="Enter Here"
                    style={{ background: "#fff" }}
                  />
                </Form.Item>
              </Col>
            )}

            {counterActiveBtn === 4 && (
              <Col xs={24}>
                <Form.Item name="fieldTitle" label="Field Title">
                  <Input
                    placeholder="Enter Here"
                    style={{ background: "#fff" }}
                  />
                </Form.Item>
              </Col>
            )}
          </Form>
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
            >
              Send to All
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

const counterButtons = [
  { id: 1, label: "Full Name", icon: FullNameSVG },
  { id: 2, label: "Signature", icon: SignatureSVG },
  { id: 3, label: "File", icon: CounterFileSVG },
  { id: 4, label: "Custom Field", icon: PluseSVG },
];
