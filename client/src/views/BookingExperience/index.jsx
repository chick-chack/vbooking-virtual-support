import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  List,
  notification,
  Row,
  Typography,
} from "antd";

import { FlightsSVG, HotelsSVG, SearchSVG } from "assets/jsx-svg";

import exploreImage from "assets/images/exploreVbooking.png";
import bottomBooking from "assets/images/bottomBooking.png";
import vbooking from "assets/images/vbooking.png";
import topBooking from "assets/images/topBooking.png";

import { axiosCatch } from "utils/axiosUtils";
import HotelsService from "services/hotels.service";
import HotelsSearch from "./HotelsSearch";
import FlightsSearch from "./FlightsSearch";
import HotelCardForRooms from "components/HotelCardForRooms";

import "./styles.css";

export default function BookingExperience({ header, description, search }) {
  const [form] = Form.useForm();
  const [hotelsData, setHotelsData] = useState([]);
  const [countriesData, setCountriesData] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [adultsNo, setAdultsNo] = useState(0);
  const [childrenNo, setChildrenNo] = useState(0);
  const [roomNo, setRoomNo] = useState(0);
  const [loading, setLoading] = useState(false);

  console.log(hotelsData);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await HotelsService.searchRoom({
        CheckIn: values.date && values.date[0].format("YYYY-MM-DD"),
        CheckOut: values.date && values.date[1].format("YYYY-MM-DD"),
        GuestNationality: values.place,
        PaxRooms: [
          {
            Adults: adultsNo,
            Children: childrenNo,
            ChildrenAges:
              values.HotelsChildAge &&
              values.HotelsChildAge.map((item) => item.HotelsChildAge).slice(
                0,
                childrenNo,
              ),
          },
        ],
        Filter: {
          NoOfRooms: roomNo,
        },
      });

      if (res.status === 201) {
        notification.info({ message: res.data.message });
      } else {
        setHotelsData(
          res.data.data
            .map((hotel) =>
              hotel.Rooms.map((room) => ({
                ...room,
                HotelCode: hotel.HotelCode,
              })),
            )
            .flat(),
        );
      }
      console.log(res);
    } catch (err) {
      axiosCatch(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAdultsNo(0);
    setChildrenNo(0);
    setRoomNo(0);
  }, [activeTab]);

  useEffect(() => {
    (async () => {
      const res = await HotelsService.getCountryList();
      setCountriesData(res.data.data);
    })();
  }, []);

  return (
    <main style={{ overflowX: "hidden", height: "100vh", background: "#fff" }}>
      <Form form={form} onFinish={onFinish} className="booking-experience">
        <img
          src={bottomBooking}
          className="top-lines-image"
          alt="top vbooking lines"
        />
        <img
          src={topBooking}
          className="bottom-lines-image"
          alt="bottomop vbooking lines"
        />
        <img src={vbooking} className="vbooking-image" alt="vbooking" />
        <div className="explore-image">
          <img src={exploreImage} alt="explore" />
        </div>

        <section className="booking-experience-container container">
          <Row>
            <Col xs={24}>
              <Typography.Text className="fz-16" style={{ color: "#6C6DE6" }}>
                DREAM HAPPEN
              </Typography.Text>
            </Col>
            <Col xs={24} style={{ marginBottom: "1rem" }}>
              <Typography.Text
                style={{
                  fontSize: "3rem",
                  lineHeight: "3rem",
                }}
                className="fw-400"
              >
                {header}
              </Typography.Text>
            </Col>
            <Col xs={24} md={18} xl={10}>
              <Typography.Paragraph
                className="fz-16"
                style={{ color: "#626262" }}
              >
                {description}
              </Typography.Paragraph>
            </Col>

            {search ? (
              <Col xs={24} style={{ marginTop: "2rem" }}>
                <Row>
                  <Col xs={24} lg={20}>
                    <div className="tab-content">
                      <Row gutter={[14, 14]} align="middle">
                        <Col flex={1}>
                          <Form.Item name="place" noStyle>
                            <Input
                              style={{ height: "50px" }}
                              prefix={<SearchSVG />}
                              placeholder="Where are you going?"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={4}>
                          <Button
                            htmlType="submit"
                            type="primary"
                            style={{ fontWeight: "300", width: "100%" }}
                            loading={loading}
                          >
                            search
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Col>
            ) : (
              <Col xs={24} style={{ marginTop: "2rem" }}>
                <Row align="middle" gutter={[12, 12]}>
                  {exploreTabs.map((tab) => (
                    <Col key={tab.id}>
                      <div
                        className="booking-experience-tab clickable"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Row gutter={[8, 0]} align="middle" wrap={false}>
                          <Col>
                            <div
                              className={`booking-experience-tab-icon ${
                                activeTab === tab.id && "active"
                              }`}
                            >
                              {<tab.icon />}
                            </div>
                          </Col>
                          <Col>
                            <Typography.Text>{tab.label}</Typography.Text>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  ))}
                </Row>

                <Row className="mt-1">
                  <Col xs={24} lg={20}>
                    <div className="tab-content">
                      <div
                        className="tab-content-arrow"
                        style={{ left: activeTab === 2 && "130px" }}
                      />
                      {activeTab === 1 && (
                        <HotelsSearch
                          countriesData={countriesData}
                          loading={loading}
                          adultsNo={adultsNo}
                          setAdultsNo={setAdultsNo}
                          childrenNo={childrenNo}
                          setChildrenNo={setChildrenNo}
                          roomNo={roomNo}
                          setRoomNo={setRoomNo}
                        />
                      )}

                      {activeTab === 2 && (
                        <FlightsSearch
                          loading={loading}
                          adultsNo={adultsNo}
                          setAdultsNo={setAdultsNo}
                          childrenNo={childrenNo}
                          setChildrenNo={setChildrenNo}
                          roomNo={roomNo}
                          setRoomNo={setRoomNo}
                        />
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
            )}
            {activeTab === 1 && hotelsData.length > 0 && (
              <Col xs={24} style={{ marginTop: "2rem" }}>
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 3,
                    xl: 4,
                    xxl: 4,
                  }}
                  pagination={{
                    position: "bottom",
                    pageSize: 12,
                  }}
                  className="hotels-cards-display"
                  dataSource={hotelsData}
                  renderItem={(data) => (
                    <List.Item style={{ padding: "0" }}>
                      <HotelCardForRooms roomData={data} />
                    </List.Item>
                  )}
                />
              </Col>
            )}
          </Row>
        </section>
      </Form>
    </main>
  );
}

const exploreTabs = [
  {
    id: 1,
    label: "Hotels",
    icon: HotelsSVG,
  },
  {
    id: 2,
    label: "Flights",
    icon: FlightsSVG,
  },
];
