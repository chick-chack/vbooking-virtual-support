import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Row,
  Select,
  Typography,
} from "antd";
import { CalculatorSVG, ExploreLocationSVG, PersonSVG } from "assets/jsx-svg";
import GuestSelectOption from "./GuestDropdown";

export default function HotelsSearch({
  countriesData,
  loading,
  adultsNo,
  setAdultsNo,
  childrenNo,
  setChildrenNo,
  roomNo,
  setRoomNo,
}) {
  return (
    <Row className="tab-content-animation" gutter={[14, 14]} align="middle">
      <Col xs={24} lg={5}>
        <Form.Item
          name="place"
          rules={[
            {
              required: true,
              message: "Please Select Place",
            },
          ]}
        >
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={countriesData.map((country) => ({
              value: country.Code,
              label: country.Name,
            }))}
            className="w-100 select-prefix-icon"
            suffixIcon={<ExploreLocationSVG />}
            placeholder="Where are you from?"
          />
        </Form.Item>
      </Col>
      <Col xs={24} lg={7}>
        <Form.Item
          name="date"
          rules={[
            {
              required: true,
              message: "Please input date",
            },
          ]}
        >
          <DatePicker.RangePicker
            disabledDate={(current) => {
              let customDate = new Date().getTime();
              return current && current < customDate;
            }}
            className="w-100"
            style={{ height: "50px" }}
            prefix={<CalculatorSVG />}
            placeholder={["Journey date", "Return date"]}
          />
        </Form.Item>
      </Col>
      <Col xs={24} lg={8}>
        <Dropdown
          placement="bottomRight"
          trigger={["click"]}
          dropdownRender={() => (
            <GuestSelectOption
              adultsNo={adultsNo}
              setAdultsNo={setAdultsNo}
              childrenNo={childrenNo}
              setChildrenNo={setChildrenNo}
              roomNo={roomNo}
              setRoomNo={setRoomNo}
              type="Hotels"
            />
          )}
        >
          <Select
            className="w-100"
            bordered={false}
            style={{
              background: "#fff",
              borderRadius: "8px",
            }}
            options={null}
            dropdownStyle={{ display: "none" }}
            placeholder={
              <Row align="middle" gutter={[12, 0]} wrap={false}>
                <Col>
                  <Row align="middle">
                    <PersonSVG />
                  </Row>
                </Col>

                <Col>
                  <Typography.Text
                    style={{
                      color: "#4a4a4a",
                    }}
                  >
                    {roomNo} Rooms . {adultsNo} Adults . {childrenNo} Children
                  </Typography.Text>
                </Col>
              </Row>
            }
          />
        </Dropdown>
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
  );
}
