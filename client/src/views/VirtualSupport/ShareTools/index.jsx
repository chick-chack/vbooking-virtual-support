import { Col, Row, Spin, notification, Typography } from "antd";
import { useState } from "react";

import {
  FileSVG,
  ScreenSVG,
  ShareDimenstionSVG,
  WhiteBoardSVG,
  WorldMapSVG,
} from "assets/jsx-svg";
import "./styles.css";

export default function ShareTools({
  setActiveBtn,
  shareWhiteboard,
  isHost,
  permissions,
  sharingScreen,
  unPublishScreen,
  publishScreen,
  SystemMessage,
  sharingDim,
  sharingFile,
  sharingWhiteboard,
}) {
  const [activeTool, setActiveTool] = useState();
  const [activeToolLoading, setActiveToolLoading] = useState(false);

  const tools = [
    {
      id: 1,
      defaultLabel: sharingScreen ? "Stop Share Screen" : "Share Screen",
      icon: ScreenSVG,
    },
    {
      id: 2,
      defaultLabel: "Metaverse Experience",
      icon: ShareDimenstionSVG,
    },
    {
      id: 3,
      defaultLabel: "Whiteboard",
      icon: WhiteBoardSVG,
    },
    {
      id: 4,
      defaultLabel: "World Map",
      icon: WorldMapSVG,
    },
    {
      id: 5,
      defaultLabel: "Files",
      icon: FileSVG,
    },
  ];

  return (
    <section className="share-tools">
      <Typography.Text className="fz-18 fw-500">Sharing Tools</Typography.Text>
      <Row gutter={[8, 8]} style={{ marginTop: "24px" }}>
        {tools.map((tool) => (
          <Col xs={8} key={tool.id}>
            <Spin spinning={activeTool === tool.id && activeToolLoading}>
              <div
                className={`share-tools-card ${
                  activeTool === tool.id && "active"
                }`}
                onClick={() => {
                  if (tool.id === 1) {
                    if (!isHost && !permissions.screen) return;

                    if (sharingScreen) unPublishScreen();
                    else {
                      if (sharingDim) {
                        SystemMessage.stopDim();
                      } else if (sharingWhiteboard) {
                        SystemMessage.stopWhiteboard();
                      } else if (sharingFile) {
                        SystemMessage.stopFilePreview();
                      }

                      publishScreen();
                    }
                    setActiveTool(1);
                  } else if (tool.id === 3) {
                    setActiveTool(tool.id);

                    if (sharingDim) {
                      SystemMessage.stopDim();
                    } else if (sharingScreen) {
                      unPublishScreen();
                    } else if (sharingFile) {
                      SystemMessage.stopFilePreview();
                    }

                    notification.info({ message: "Initializing whiteboard" });
                    setActiveToolLoading(true);
                    shareWhiteboard().then(() => setActiveToolLoading(false));
                  } else if (tool.id === 2) {
                    setActiveBtn("metaExperience");
                    setActiveTool(tool.id);
                  } else if (tool.id === 5) {
                    setActiveBtn("files");
                    setActiveTool(tool.id);
                  } else {
                    setActiveTool(tool.id);
                  }
                }}
              >
                <Row gutter={[0, 12]} justify="center">
                  <Col xs={24}>
                    <Row justify="center">
                      <tool.icon
                        style={{ width: "24px", height: "24px" }}
                        color={activeTool === tool.id ? "#960bcd" : "#000"}
                      />
                    </Row>
                  </Col>
                  <Col xs={24}>
                    <Row justify="center" style={{ textAlign: "center" }}>
                      <Typography.Text>{tool.defaultLabel}</Typography.Text>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Spin>
          </Col>
        ))}
      </Row>
    </section>
  );
}
