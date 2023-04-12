import { Button, Col, Image, Row, Typography } from "antd";
import { WifiOutlined } from "@ant-design/icons";

import cam1Img from "assets/images/cam1.png";
import cam2Img from "assets/images/cam2.png";
import cam3Img from "assets/images/cam3.png";
import cam4Img from "assets/images/cam4.png";

import { ArrowRightSVG } from "assets/jsx-svg";

import "./styles.css";

export default function LiveStream({
  setActiveBtn,
  selectedCam,
  setSelectedCam,
}) {
  const onAirStart = () => {
    console.log("Air Start");
  };

  const onAirFade = () => {
    console.log("Air Fade");
  };

  const onAirStop = () => {
    console.log("Air Stop");
  };

  return (
    <section className="live-stream-section">
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

      <Row gutter={[0, 10]} style={{ marginTop: "24px" }}>
        <Col xs={24}>
          <Typography.Text className="fz-22 fw-500">Livestream</Typography.Text>
        </Col>
        <Col xs={24}>
          <Typography.Text className="fz-20">
            set Livestream Keys
          </Typography.Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-1">
        <Col xs={24}>
          <Typography.Text className="fz-20">Screens</Typography.Text>
        </Col>

        <Col xs={24} style={{ maxHeight: "330px", overflowY: "auto" }}>
          <Row gutter={[16, 16]}>
            {cams.map((cam) => (
              <Col key={cam.id} xs={24} md={12}>
                <div
                  className="live-stream-cam clickable"
                  style={{ borderColor: cam.color }}
                  onClick={() => setSelectedCam(cam)}
                >
                  <Image
                    src={cam.camImage}
                    alt={cam.label}
                    preview={false}
                    width="100%"
                    height="100%"
                  />
                </div>

                <Typography.Text>{cam.label}</Typography.Text>
              </Col>
            ))}
          </Row>
        </Col>

        {selectedCam && (
          <>
            <Col xs={24}>
              <Typography.Text className="fz-22 fw-500">On Air</Typography.Text>
            </Col>
            <Col xs={24}>
              <div
                className="live-stream-cam"
                style={{ borderColor: selectedCam.color }}
              >
                <Image
                  src={selectedCam.camImage}
                  alt={selectedCam.label}
                  preview={false}
                  width="100%"
                  height="100%"
                />
              </div>
            </Col>

            <Col xs={24}>
              <Row justify="space-between">
                <Col>
                  <Button
                    onClick={onAirStart}
                    className="live-stream-btn"
                    style={{
                      background: "transparent",
                      border: "2px solid #000",
                      padding: "0px 14px",
                    }}
                  >
                    <Row align={"middle"} gutter={[12, 0]}>
                      <Col>
                        <div
                          className="live-stream-btn-dot"
                          style={{
                            background: "#f00",
                          }}
                        />
                      </Col>
                      <Col>
                        <Typography.Text className="fz-16">
                          Start
                        </Typography.Text>
                      </Col>
                    </Row>
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={onAirFade}
                    style={{
                      background: "transparent",
                      border: "2px solid #000",
                      padding: "0px 14px",
                    }}
                  >
                    <Row align={"middle"} gutter={[12, 0]}>
                      <Col>
                        <WifiOutlined />
                      </Col>
                      <Col>
                        <Typography.Text className="fz-16">
                          Fade
                        </Typography.Text>
                      </Col>
                    </Row>
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={onAirStop}
                    style={{
                      background: "transparent",
                      border: "2px solid #000",
                      padding: "0px 14px",
                    }}
                  >
                    <Row align={"middle"} gutter={[12, 0]}>
                      <Col>
                        <div className="live-stream-btn-dot" />
                      </Col>
                      <Col>
                        <Typography.Text className="fz-16">
                          Stop
                        </Typography.Text>
                      </Col>
                    </Row>
                  </Button>
                </Col>
              </Row>
            </Col>
          </>
        )}
      </Row>
    </section>
  );
}

const cams = [
  { id: 1, camImage: cam1Img, label: "Cam 1", color: null },
  { id: 2, camImage: cam2Img, label: "Cam 2", color: "#f00" },
  { id: 3, camImage: cam3Img, label: "Cam 3", color: "#0f0" },
  { id: 4, camImage: cam4Img, label: "Cam 4", color: "#00f" },
];
