import { LoadingOutlined } from "@ant-design/icons";
import { Col, Image, Rate, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HotelsService from "services/hotels.service";
import { axiosCatch } from "utils/axiosUtils";

import exploreImage from "assets/images/exploreVbooking.png";
import logo from "assets/images/logo.png";

import "./styles.css";
import { CallSVG, ExploreLocationSVG } from "assets/jsx-svg";
import CustomSlider from "components/CustomSlider";

export default function HotelDetails() {
  const { hotelId } = useParams();
  const [hotelData, setHotelData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState();

  console.log(hotelId);
  console.log(hotelData);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await HotelsService.getHotelsDetails({
          Hotelcodes: hotelId,
        });

        setHotelData(res.data.data[0]);
        setSelectedImage(exploreImage);
      } catch (err) {
        axiosCatch(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [hotelId]);

  if (loading) {
    return (
      <div
        style={{ width: "100vw", height: "100vh", background: "#fff" }}
        className="center-items"
      >
        <Row gutter={[0, 30]}>
          <Col xs={24}>
            <Row justify={"center"}>
              <Image preview={false} src={logo} alt="vbooling Logo" />
            </Row>
          </Col>
          <Col xs={24}>
            <Row justify={"center"}>
              <LoadingOutlined />
            </Row>
          </Col>
        </Row>
      </div>
    );
  }

  if (hotelData.HotelCode)
    return (
      <main className="hotel-details">
        <div
          className="header-section"
          style={{ background: `url(${exploreImage})` }}
        >
          <div className="header-data center-items">
            <Typography.Title className="wc" level={3}>
              {hotelData.HotelName}
            </Typography.Title>
            <Typography.Text className="wc">
              <Rate
                style={{ fontSize: "14px" }}
                disabled
                allowHalf
                value={hotelData.HotelRating}
                className="hotel-rate"
              />
            </Typography.Text>

            <Row align="middle" wrap={false} gutter={[12, 0]}>
              <Col>
                <Row align="middle">
                  <ExploreLocationSVG color="#fff" />
                </Row>
              </Col>
              <Col>
                <Typography.Text className="wc fw-600">
                  {hotelData.CountryName} - {hotelData.CityName}
                </Typography.Text>
              </Col>
            </Row>

            <Row align="middle" wrap={false} gutter={[12, 0]}>
              <Col>
                <Row align="middle">
                  <CallSVG color="#fff" style={{ width: "16px" }} />
                </Row>
              </Col>
              <Col>
                <Typography.Text className="wc fw-600">
                  {hotelData.PhoneNumber}
                </Typography.Text>
              </Col>
            </Row>
          </div>
        </div>
        <Row className="container" style={{ margin: "2rem auto 2rem" }}>
          <Col xs={24} xl={16}>
            <section>
              <Row justify="space-between">
                <Col xs={24} lg={18}>
                  <Row gutter={[0, 16]}>
                    <Col xs={24}>
                      {selectedImage && (
                        <Image
                          width="100%"
                          height={450}
                          alt="selected hotel"
                          src={selectedImage}
                          preview={false}
                          style={{ borderRadius: "12px" }}
                        />
                      )}
                    </Col>
                    <Col xs={24}>
                      <CustomSlider
                        slidesToShow={2}
                        slidesToScroll={2}
                        dots={false}
                        arrows={true}
                        style={{ padding: "1rem 0" }}
                      >
                        {[
                          exploreImage,
                          logo,
                          logo,
                          exploreImage,
                          exploreImage,
                          logo,
                          exploreImage,
                        ].map((image) => (
                          <div className="image-carousel">
                            <Image
                              width="100%"
                              height="130px"
                              style={{
                                objectFit: "cover",
                              }}
                              alt="hotel"
                              src={image}
                              preview={false}
                              onClick={() => setSelectedImage(image)}
                            />
                          </div>
                        ))}
                      </CustomSlider>
                    </Col>
                  </Row>
                </Col>
                <Col></Col>
              </Row>
            </section>
          </Col>
          <Col xs={24} xl={8}>
            <Row>
              <Col xs={24}>
                <div className="hotel-details-card"></div>
              </Col>
            </Row>
          </Col>
        </Row>
      </main>
    );
}
