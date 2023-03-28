import { Link } from "react-router-dom";
import { Button, Col, Row, Typography } from "antd";

import "./styles.css";

export default function HotelCardForRooms({ roomData, loading }) {
  return (
    <Link to={`/hotel-details/${roomData.HotelCode}`}>
      <Row
        className="hotel-card-for-rooms"
        style={{ pointerEvents: loading ? "none" : "auto" }}
      >
        <Col xs={24}>
          <div className="hotel-card-for-rooms-info">
            <Row gutter={[0, 4]}>
              <Col xs={24}>
                <Typography.Text
                  title={roomData.Name[0]}
                  ellipsis
                  className="fz-16 fw-600"
                >
                  {roomData.Name[0]}
                </Typography.Text>
              </Col>
              <Col xs={24}>
                <Typography.Text
                  title={roomData.Inclusion}
                  ellipsis
                  className="fw-500"
                  style={{ fontStyle: "italic" }}
                >
                  {roomData.Inclusion}
                </Typography.Text>
              </Col>
              <Col xs={24}>
                <Typography.Text
                  ellipsis
                  className="fw-500"
                  style={{ fontStyle: "italic" }}
                >
                  Is Refundable : {roomData.Refundable ? "Yes" : "No"}
                </Typography.Text>
              </Col>
              <Col xs={24}>
                <Typography.Text
                  ellipsis
                  className="fw-500"
                  style={{ fontStyle: "italic" }}
                >
                  MealType : {roomData.MealType.split("_").join(" ")}
                </Typography.Text>
              </Col>
              <Col xs={24}>
                <Typography.Text
                  className="fw-600 fz-18"
                  style={{ color: "#0129B7" }}
                  ellipsis
                >
                  $ {roomData.TotalFare.toFixed(2)}
                </Typography.Text>
              </Col>

              <Col xs={24}>
                <Row justify="end">
                  <Button
                    type="default"
                    style={{ background: "#4DB5FA", color: "#fff" }}
                  >
                    Explore Hotel Room
                  </Button>
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Link>
  );
}
