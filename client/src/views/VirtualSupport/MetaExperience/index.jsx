import { LoadingOutlined } from "@ant-design/icons";
import { Col, Image, Row, Typography } from "antd";
import { ArrowRightSVG } from "assets/jsx-svg";
import { useEffect } from "react";
import { useState } from "react";
import MetaverseService from "services/metaverse.service";
import { axiosCatch } from "utils/axiosUtils";
import "./styles.css";

export default function MetaExperience({ setActiveBtn, SystemMessage }) {
  const [myDims, setMyDims] = useState([]);
  const [loading, setLoading] = useState(false);

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
        <Row gutter={[0, 10]}>
          <Col xs={24}>
            <Typography.Paragraph
              ellipsis={{ rows: 3 }}
              className="fz-18 fw-600"
            >
              Drag verse & drop it to your window to share with others
            </Typography.Paragraph>
          </Col>

          {myDims.map((dim) => (
            <Col xs={24} key={dim.id}>
              <div
                className="dim-card"
                onClick={() => SystemMessage.shareDim(dim.id)}
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
              </div>
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
}
