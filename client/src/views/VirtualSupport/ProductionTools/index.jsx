import { useState } from "react";
import { Col, Row, Typography } from "antd";

import { ArrowRightSVG } from "assets/jsx-svg";

import "./styles.css";

export default function ProductionTools({ setActiveBtn }) {
  const [dragedMedia, setDragedMedia] = useState(null);

  const onDrop = (e, screenId) => {
    e.preventDefault();
    console.log("Draged Media", dragedMedia);
    console.log("Droped in Screen", screenId);
  };

  return (
    <section className="production-tools">
      <Row
        wrap={false}
        align="middle"
        gutter={[8, 0]}
        style={{ width: "fit-content" }}
        className="clickable"
        onClick={() => setActiveBtn("tools")}
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

      <Row style={{ marginTop: "24px" }}>
        <Typography.Text className="fz-22 fw-500">
          Production Tools
        </Typography.Text>
      </Row>

      <Row gutter={[16, 0]} style={{ marginTop: "2rem" }}>
        <Col xs={12} style={{ maxHeight: "78vh", overflowY: "scroll" }}>
          <Row gutter={[0, 12]}>
            <Col xs={24}>
              <Typography.Text className="fz-18">Screens</Typography.Text>
            </Col>
            {screens.map((screen) => (
              <Col key={screen.id} xs={24}>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e, screen.id)}
                  className="production-tools-screen"
                  style={{
                    borderColor: !dragedMedia && screen.color,
                    background: dragedMedia && "#333",
                  }}
                >
                  <Typography.Text className={dragedMedia && "wc"}>
                    {dragedMedia && "Drop on "}
                    {screen.label}
                  </Typography.Text>
                </div>
              </Col>
            ))}
          </Row>
        </Col>

        <Col xs={12} style={{ maxHeight: "78vh", overflowY: "scroll" }}>
          <Row gutter={[12, 12]}>
            <Col xs={24}>
              <Typography.Text className="fz-18">Media Library</Typography.Text>
            </Col>
            {mediaLibrary().map((media) => (
              <Col key={media.id} xs={12}>
                <div
                  draggable
                  className="production-tools-media"
                  onDragStart={() => setDragedMedia(media.id)}
                  onDragEnd={() => setDragedMedia(null)}
                >
                  <Typography.Text>{media.label}</Typography.Text>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </section>
  );
}

const screens = [
  { id: 1, label: "Screen 1", color: "#f00" },
  { id: 2, label: "Screen 2", color: "#0f0" },
  { id: 3, label: "Screen 3", color: "#00f" },
  { id: 4, label: "Screen 4", color: null },
  { id: 5, label: "Screen 5", color: null },
];

const mediaLibrary = () => {
  let media = [];

  for (let index = 1; index < 30; index++) {
    media.push({ id: index, label: `Media ${index}` });
  }

  return media;
};
