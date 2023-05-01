import { useState, useEffect } from "react";
import { Col, Row, Tooltip, Typography } from "antd";

import { ArrowRightSVG } from "assets/jsx-svg";

import "./styles.css";
import SocialEventService from "services/social-event.service";
import { axiosCatch } from "utils/axiosUtils";

import videoImg from "assets/images/video.jpg";
import { LoadingOutlined } from "@ant-design/icons";

export default function ProductionTools({
  activeBtn,
  setActiveBtn,
  dimensionFrames,
  iframeRef,
}) {
  const [dragedMedia, setDragedMedia] = useState(null);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = (e, screenId) => {
    e.preventDefault();
    console.log("Draged Media", dragedMedia);
    console.log("Droped in Screen", screenId);

    const newFrame = {
      name: screenId,
      texture: dragedMedia,
    };
    iframeRef?.contentWindow?.unityInstance?.SendMessage(
      "BG_Scripts/JsBridge",
      "SetFrameTexture",
      JSON.stringify(newFrame),
    );
  };

  useEffect(() => {
    if (iframeRef) {
      iframeRef.contentWindow?.unityInstance?.SendMessage(
        "BG_Scripts/JsBridge",
        "GetFrames",
      );
    }
  }, [activeBtn, iframeRef]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await SocialEventService.getMedia();
        setMediaLibrary(res.data.data.rows);
        console.log("++++", res.data.data.rows);
      } catch (err) {
        axiosCatch(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [setMediaLibrary]);

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
        <Col xs={12} style={{ maxHeight: "78vh", overflowY: "auto" }}>
          <Row gutter={[0, 12]}>
            <Col xs={24}>
              <Typography.Text className="fz-18">Screens</Typography.Text>
            </Col>
            {dimensionFrames?.map((screen) => (
              <Col key={screen.name} xs={24}>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e, screen.name)}
                  className="production-tools-screen"
                  style={{
                    background: `url(${screen.texture || videoImg})`,
                  }}
                />
                <Tooltip title={screen.name}>
                  <Typography.Text ellipsis className={dragedMedia && "wc"}>
                    {dragedMedia && "Drop on "}
                    {screen.name}
                  </Typography.Text>
                </Tooltip>
              </Col>
            ))}
          </Row>
        </Col>

        <Col xs={12} style={{ maxHeight: "78vh", overflowY: "auto" }}>
          {loading ? (
            <Row justify="center">
              <LoadingOutlined />
            </Row>
          ) : (
            <Row gutter={[12, 12]}>
              <Col xs={24}>
                <Typography.Text className="fz-18">
                  Media Library
                </Typography.Text>
              </Col>
              {mediaLibrary?.map((media) => (
                <Col key={media.id} xs={12}>
                  <div
                    draggable
                    className="production-tools-media"
                    style={{
                      background: `url(${media.image || videoImg})`,
                      backgroundColor: "#333",
                    }}
                    onDragStart={() => setDragedMedia(media.file)}
                    onDragEnd={() => setDragedMedia(null)}
                  />
                  <Tooltip title={media.name}>
                    <Typography.Text ellipsis>{media.name}</Typography.Text>
                  </Tooltip>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </section>
  );
}
