import { Button, Carousel, Col, Input, Row, Typography } from "antd";
import { StarFilled } from "@ant-design/icons";
import { ExploreLocationSVG, SearchSVG } from "assets/jsx-svg";

import destinationImg from "assets/images/Mask.png";
import exploreVbookingImg from "assets/images/exploreVbooking.png";

import "./styles.css";

export default function DestinationsPreview() {
  return (
    <main className="destinations-preview-layout">
      <section className="destinations-preview">
        <Row style={{ marginBottom: "14px" }}>
          <Typography.Text className="fz-24 fw-600">
            Destinations
          </Typography.Text>
        </Row>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={9}>
            <Row gutter={[0, 24]}>
              <Col xs={24}>
                <Input
                  prefix={<SearchSVG />}
                  placeholder="Search"
                  style={{ background: "#F2F2F7", borderRadius: "14px" }}
                />
              </Col>
              <Col xs={24}>
                <Row
                  gutter={[0, 14]}
                  style={{
                    padding: "0 6px",
                    minHeight: "200px",
                    maxHeight: "550px",
                    overflowY: "auto",
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <Col xs={24} key={item}>
                      <div className="destination-card">
                        <Row gutter={[14, 14]} align="middle">
                          <Col xs={8}>
                            <div
                              className="destination-card-img"
                              style={{ background: `url(${destinationImg})` }}
                            />
                          </Col>
                          <Col xs={16}>
                            <Row gutter={[0, 7]}>
                              <Col xs={24}>
                                <Row align={"middle"} justify="space-between">
                                  <Col>
                                    <Typography.Text ellipsis>
                                      Alona Beach
                                    </Typography.Text>
                                  </Col>
                                  <Col>
                                    <Row
                                      align="middle"
                                      gutter={[6, 0]}
                                      wrap={false}
                                    >
                                      <Col>
                                        <Row align="middle">
                                          <StarFilled
                                            style={{ color: "#FFB300" }}
                                          />
                                        </Row>
                                      </Col>
                                      <Col>
                                        <Typography.Text
                                          ellipsis
                                          className="gc"
                                        >
                                          (4,5)
                                        </Typography.Text>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                              <Col xs={24}>
                                <Row
                                  align="middle"
                                  gutter={[6, 0]}
                                  wrap={false}
                                >
                                  <Col>
                                    <Row align="middle">
                                      <ExploreLocationSVG color="#6C6DE6" />
                                    </Row>
                                  </Col>
                                  <Col>
                                    <Typography.Text ellipsis className="gc">
                                      Philippines
                                    </Typography.Text>
                                  </Col>
                                </Row>
                              </Col>
                              <Col xs={24}>
                                <Typography.Text ellipsis className="gc">
                                  bibendum a tour travel
                                </Typography.Text>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xs={24} lg={15}>
            <Row align="middle" gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Carousel
                  className="destinations-preview-carousel"
                  swipe={true}
                  swipeToSlide
                  draggable
                  autoplay
                  style={{ borderRadius: "14px", overflow: "hidden" }}
                >
                  <div>
                    <div
                      className="destinations-preview-carousel-img"
                      style={{ background: `url(${exploreVbookingImg})` }}
                    />
                  </div>
                  <div>
                    <div
                      className="destinations-preview-carousel-img"
                      style={{ background: `url(${destinationImg})` }}
                    />
                  </div>
                  <div>
                    <div
                      className="destinations-preview-carousel-img"
                      style={{ background: `url(${exploreVbookingImg})` }}
                    />
                  </div>
                </Carousel>
              </Col>
              <Col xs={24} lg={12}>
                <Row gutter={[4, 0]} align="middle">
                  <Col>
                    <div className="category-line" />
                  </Col>
                  <Col>
                    <Typography.Text className="fz-12 fw-500">
                      Category
                    </Typography.Text>
                  </Col>
                </Row>

                <Row>
                  <Typography.Text
                    style={{ color: "#6C6DE6", fontSize: "1.9rem" }}
                  >
                    Best Destination
                  </Typography.Text>
                </Row>

                <Row>
                  <Typography.Paragraph
                    className="fz-16"
                    ellipsis={{ rows: "10" }}
                  >
                    Find Out what the best destinations in the world are as
                    awarded by millions of real.Lorem Ipsum is simply dummy text
                    of the printing and typesetting industry. Lorem Ipsum has
                    been the industry's standard dummy text ever since the
                    1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book.
                  </Typography.Paragraph>
                </Row>

                <Row>
                  <Button type="primary" style={{ width: "170px" }}>
                    Create Plan
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>
    </main>
  );
}
