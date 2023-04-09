import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Col, Image, Row, Typography } from "antd";

import EducationImg from "assets/images/Education.png";
import BusinessImg from "assets/images/Business.png";
import FunImg from "assets/images/Fun.png";
import meetImg from "assets/images/startMeetBg.png";
import { LeftArrowSVG } from "assets/jsx-svg";

import "./styles.css";

export default function Holomeet() {
  const [selectedCategory, setSelectedCategory] = useState();
  const { meetingId } = useParams();

  return (
    <div className="holo-meet">
      {!selectedCategory && (
        <Typography.Text className="fz-18 fw-500 ">Holomeet</Typography.Text>
      )}
      <div
        className={selectedCategory ? "" : "center-items"}
        style={{ height: "90%", marginTop: selectedCategory ? "2rem" : "1rem" }}
      >
        <Row gutter={[0, 32]}>
          {!selectedCategory && (
            <Col xs={24}>
              <Row justify="center">
                <Typography.Text className="fz-16 fw-500 ">
                  Select Category
                </Typography.Text>
              </Row>
            </Col>
          )}
          <Col xs={24}>
            <Row gutter={[16, 16]}>
              {categories.map((category) => (
                <Col
                  xs={selectedCategory ? 8 : 24}
                  xl={selectedCategory && 12}
                  xxl={selectedCategory ? 8 : 24}
                  key={category.id}
                >
                  <div
                    className="holo-meet-category"
                    style={{
                      outline:
                        selectedCategory === category.id && "1px solid #AEAEB2",
                      padding: selectedCategory && "1rem",
                    }}
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
                          <Typography.Text
                            className="fz-16"
                            ellipsis
                            title={category.title}
                          >
                            {category.title}
                          </Typography.Text>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Col>
              ))}
            </Row>

            {selectedCategory && <HolomeetRooms meetingId={meetingId} />}
          </Col>
        </Row>
      </div>

      {selectedCategory && (
        <div
          className="back-btn clickable"
          onClick={() => setSelectedCategory(null)}
        >
          <Row wrap={false} gutter={[6, 0]} align="middle">
            <Col>
              <Row align="middle">
                <LeftArrowSVG
                  color="#8E8E93"
                  style={{ width: "14px", height: "14px" }}
                />
              </Row>
            </Col>
            <Col>
              <Typography.Text style={{ color: "#8E8E93" }}>
                Back
              </Typography.Text>
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
            <Col xs={24} key={index}>
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
                          <Typography.Text className="fz-16 fw-500">
                            {room.title}
                          </Typography.Text>
                        </Col>
                        <Col xs={24}>
                          <Typography.Paragraph
                            className="fz-12"
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
