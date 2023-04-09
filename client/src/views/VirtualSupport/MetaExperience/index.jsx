import { useEffect, useState, useContext } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";

import { ArrowRightSVG } from "assets/jsx-svg";
import MetaverseService from "services/metaverse.service";
import { axiosCatch } from "utils/axiosUtils";
import DragContext from "../DragContext";
import "./styles.css";

export default function MetaExperience({
  setActiveBtn,
  SystemMessage,
  sharingDimId,
  sharingScreen,
  unPublishScreen,
  sharingFile,
  sharingWhiteboard,
}) {
  const [myDims, setMyDims] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setDragData } = useContext(DragContext);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const {
          data: {
            data: { rows },
          },
        } = await MetaverseService.getMyDimensions();

        setMyDims(rows);
      } catch (error) {
        axiosCatch(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="meta-experience">
      <div className="back-word">
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
      </div>

      {loading ? (
        <Row justify="center">
          <LoadingOutlined />
        </Row>
      ) : (
        <Row gutter={[0, 10]} style={{ marginTop: "2rem" }}>
          <Col xs={24}>
            <Typography.Paragraph
              ellipsis={{ rows: 3 }}
              className="fz-18 fw-600"
            >
              Drag verse & drop it to your window to share with others
            </Typography.Paragraph>
          </Col>

          <Row
            style={{ maxHeight: "76vh", overflowY: "auto", width: "100%" }}
            gutter={[0, 12]}
          >
            {myDims.map((dim) => (
              <Col
                draggable
                xs={24}
                key={dim.id}
                onDragStart={() =>
                  setDragData({
                    dragging: true,
                    dropText: "Drop to share dimension",
                    dimId: dim.id,
                    file: null,
                  })
                }
                onDragEnd={() =>
                  setDragData({
                    dragging: false,
                    dropText: "",
                    dimId: null,
                    file: null,
                  })
                }
              >
                <div
                  className="dim-card"
                  onClick={() => {
                    if (sharingScreen) {
                      unPublishScreen();
                    } else if (sharingWhiteboard) {
                      SystemMessage.stopWhiteboard();
                    } else if (sharingFile) {
                      SystemMessage.stopFilePreview();
                    }

                    SystemMessage.shareDim(dim.id);
                  }}
                >
                  <div
                    style={{ background: `url(${dim.image})` }}
                    className="dim-card-img"
                  />

                  <div className="dim-card-text">
                    <Typography className="wc">
                      {dim.customerDimensionTranslations[0].name}
                    </Typography>
                  </div>

                  {+sharingDimId === +dim.id && (
                    <div className="dim-card-btn">
                      <Button
                        type="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          SystemMessage.stopDim();
                        }}
                      >
                        Exit
                      </Button>
                    </div>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Row>
      )}
    </section>
  );
}
