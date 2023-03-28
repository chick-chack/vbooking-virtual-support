import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Row,
  Select,
  Typography,
} from "antd";
import {
  DownCircleOutlined,
  RetweetOutlined,
  SwapOutlined,
  UpCircleOutlined,
} from "@ant-design/icons";
import RightLongArrow from "assets/jsx-svg/RightLongArrow";
import GuestSelectOption from "./GuestDropdown";

export default function FlightsSearch({
  loading,
  adultsNo,
  setAdultsNo,
  childrenNo,
  setChildrenNo,
  roomNo,
  setRoomNo,
}) {
  return (
    <div className="tab-content-animation">
      <Row className="mb-1" gutter={[14, 14]}>
        <Col>
          <Select
            bordered={false}
            style={{
              background: "#fff",
              borderRadius: "8px",
            }}
            defaultValue={1}
            options={[
              {
                label: (
                  <Row align="middle" gutter={[12, 0]}>
                    <Col>
                      <Row align="middle">
                        <SwapOutlined />
                      </Row>
                    </Col>
                    <Col>Round Trip</Col>
                  </Row>
                ),
                value: 1,
              },
              {
                label: (
                  <Row align="middle" gutter={[12, 0]}>
                    <Col>
                      <Row align="middle">
                        <RightLongArrow />
                      </Row>
                    </Col>
                    <Col>One-way</Col>
                  </Row>
                ),
                value: 2,
              },
              {
                label: (
                  <Row align="middle" gutter={[12, 0]}>
                    <Col>
                      <Row align="middle">
                        <RetweetOutlined />
                      </Row>
                    </Col>
                    <Col>Multi-city</Col>
                  </Row>
                ),
                value: 3,
              },
            ]}
            placeholder={
              <Row align="middle" gutter={[12, 0]}>
                <Col>
                  <Row align="middle">
                    <SwapOutlined />
                  </Row>
                </Col>
                <Col>Round Trip</Col>
              </Row>
            }
          />
        </Col>
        <Col>
          <Dropdown
            placement="bottomLeft"
            trigger={["click"]}
            dropdownRender={() => (
              <GuestSelectOption
                adultsNo={adultsNo}
                setAdultsNo={setAdultsNo}
                childrenNo={childrenNo}
                setChildrenNo={setChildrenNo}
                roomNo={roomNo}
                setRoomNo={setRoomNo}
                type="Flights"
              />
            )}
          >
            <Select
              bordered={false}
              style={{
                background: "#fff",
                borderRadius: "8px",
              }}
              options={null}
              dropdownStyle={{ display: "none" }}
              placeholder={
                <Typography.Text
                  style={{
                    color: "#4a4a4a",
                  }}
                >
                  {roomNo} Rooms . {adultsNo} Adults . {childrenNo} Children
                </Typography.Text>
              }
            />
          </Dropdown>
        </Col>
        <Col>
          <Select
            style={{
              minWidth: "180px",
              background: "#fff",
              borderRadius: "8px",
            }}
            bordered={false}
            defaultValue={1}
            options={[
              { label: "Economy", value: 1 },
              { label: "Premium economy", value: 2 },
              { label: "Business", value: 3 },
              { label: "First", value: 4 },
            ]}
          />
        </Col>
      </Row>

      <Row gutter={[14, 14]} align="middle">
        <Col xs={24} lg={5}>
          <Select
            className="w-100"
            placeholder={
              <Row align="middle" gutter={[12, 0]}>
                <Col>
                  <Row align="middle">
                    <UpCircleOutlined />
                  </Row>
                </Col>
                <Col>From</Col>
              </Row>
            }
          />
        </Col>
        <Col xs={24} lg={5}>
          <Select
            className="w-100"
            placeholder={
              <Row align="middle" gutter={[12, 0]}>
                <Col>
                  <Row align="middle">
                    <DownCircleOutlined />
                  </Row>
                </Col>
                <Col>To</Col>
              </Row>
            }
          />
        </Col>
        <Col xs={24} lg={10}>
          <DatePicker.RangePicker
            style={{ height: "50px" }}
            className="w-100"
          />
        </Col>
        <Col xs={24} lg={4}>
          <Button
            type="primary"
            style={{ fontWeight: "300", width: "100%" }}
            loading={loading}
          >
            search
          </Button>
        </Col>
      </Row>
    </div>
  );
}
