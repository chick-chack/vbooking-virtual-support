import { Link } from "react-router-dom";
import { Col, Image, Rate, Row, Typography } from "antd";

import "./styles.css";

export default function HotelsCard({ id, itemName, itemPic, loading }) {
  return (
    <Row
      className="hotels-card"
      style={{ pointerEvents: loading ? "none" : "auto" }}
    >
      {itemPic && (
        <Col xs={24}>
          {loading ? (
            <div
              className="hotels-card-img"
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Link to={`/hotel-details/${id}`}>
              <Image
                preview={false}
                alt="dimension"
                src={itemPic}
                width="100%"
                height="100%"
                className="hotels-card-img"
              />
            </Link>
          )}
        </Col>
      )}

      <Col xs={24}>
        <div className="hotels-card-info">
          <Row gutter={[0, 4]}>
            <Col xs={24}>
              <Rate style={{ fontSize: "14px" }} disabled allowHalf value={4} />
            </Col>
            <Col xs={24}>
              <Link to={`/product/${id}`}>
                <Typography.Text
                  title={itemName}
                  ellipsis
                  className="fz-16 fw-600"
                >
                  {itemName}
                </Typography.Text>
              </Link>
            </Col>
            <Col xs={24}>
              <Row align="middle">
                <Col flex={1}>
                  <Typography.Text
                    className="fw-600 fz-18"
                    style={{ color: "#0129B7" }}
                    ellipsis
                  >
                    $
                  </Typography.Text>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}
