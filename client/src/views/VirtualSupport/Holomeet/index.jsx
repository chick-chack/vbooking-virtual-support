import { useState } from "react";
import { Col, Image, Row, Typography } from "antd";

import EducationImg from "assets/images/Education.png";
import BusinessImg from "assets/images/Business.png";
import FunImg from "assets/images/Fun.png";
import meetImg from "assets/images/startMeetBg.png";
import { LeftArrowSVG } from "assets/jsx-svg";

import "./styles.css";
import { Link, useParams } from "react-router-dom";

export default function Holomeet() {
  const [selectedCategory, setSelectedCategory] = useState();
  const { meetingId } = useParams();

  return (
    <div className="holo-meet">
      <Row gutter={[0, 32]} style={{ maxWidth: "900px" }}>
        <Col xs={24}>
          <Row justify="center">
            <Typography.Text className="fz-16 fw-600 wc">
              {selectedCategory
                ? "Select Room To Start Holomeet"
                : "Select Category"}
            </Typography.Text>
          </Row>
        </Col>
        <Col xs={24}>
          {!selectedCategory ? (
            <Row gutter={[16, 16]}>
              {categories.map((category) => (
                <Col xs={24} lg={8} key={category.id}>
                  <div
                    className="holo-meet-category"
                    onClick={() => {
                      setSelectedCategory(category.id);
                    }}
                  >
                    <Row gutter={[0, 12]}>
                      <Col xs={24}>
                        <Row justify="center">
                          <Image
                            preview={false}
                            alt={category.title}
                            src={category.image}
                            height={40}
                          />
                        </Row>
                      </Col>
                      <Col xs={24}>
                        <Row justify="center">
                          <Typography.Text className="fz-16 wc">
                            {category.title}
                          </Typography.Text>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <HolomeetRooms meetingId={meetingId} />
          )}
        </Col>
      </Row>

      {selectedCategory && (
        <div
          className="back-btn clickable"
          onClick={() => setSelectedCategory(null)}
        >
          <Row wrap={false} gutter={[6, 0]} align="middle">
            <Col>
              <Row align="middle">
                <LeftArrowSVG style={{ width: "14px", height: "14px" }} />
              </Row>
            </Col>
            <Col>
              <Typography.Text className="wc">Back</Typography.Text>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

const HolomeetRooms = ({ type, meetingId }) => {
  return (
    <div className="holo-meet-room-main">
      <Row gutter={[16, 16]}>
        {Array(8)
          .fill({
            image: meetImg,
            title: "Education",
            description:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          })
          .map((room, index) => (
            <Col xs={24} lg={8} key={index}>
              <Link to={`/metaverse/${meetingId}?holomeet=true`}>
                <div className="holo-meet-room">
                  <Row gutter={[0, 8]}>
                    <Col xs={24}>
                      <div
                        className="holo-meet-img"
                        style={{
                          background: `url(${room.image})`,
                        }}
                      />
                    </Col>
                    <Col xs={24}>
                      <Row gutter={[0, 4]}>
                        <Col xs={24}>
                          <Typography.Text className="fz-16 fw-500 wc">
                            {room.title}
                          </Typography.Text>
                        </Col>
                        <Col xs={24}>
                          <Typography.Paragraph
                            className="fz-12 wc"
                            ellipsis={{ rows: 2 }}
                          >
                            {room.description}
                          </Typography.Paragraph>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Link>
            </Col>
          ))}
      </Row>
    </div>
  );
};

const categories = [
  { id: 1, image: EducationImg, title: "Education" },
  { id: 2, image: BusinessImg, title: "Business" },
  { id: 3, image: FunImg, title: "Fun" },
];
