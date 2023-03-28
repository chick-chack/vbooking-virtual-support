import {
  Button,
  Col,
  ConfigProvider,
  Form,
  InputNumber,
  Row,
  Slider,
} from "antd";

export default function GuestSelectOption({
  adultsNo,
  setAdultsNo,
  childrenNo,
  setChildrenNo,
  roomNo,
  setRoomNo,
  type,
}) {
  return (
    <section className="guest-dropdown">
      <Row justify={"space-between"} style={{ margin: "5px 0" }}>
        <Col span={12}>Adults</Col>
        <Col span={12}>
          <Row gutter={[6, 0]}>
            <Col span={8} className=" center-items ">
              <Button
                className="cart-add-btn"
                shape="circle"
                onClick={() =>
                  setAdultsNo((prev) => {
                    if (prev === 0) {
                      return prev;
                    } else {
                      return prev - 1;
                    }
                  })
                }
              >
                -
              </Button>
            </Col>
            <Col span={8} className=" center-items ">
              <InputNumber
                className="cart-quantity-input"
                controls={false}
                min={0}
                value={adultsNo}
                onChange={(e) => setAdultsNo(e)}
              />
            </Col>
            <Col span={8} className=" center-items ">
              <Button
                className="cart-add-btn"
                shape="circle"
                onClick={() => setAdultsNo((prev) => prev + 1)}
              >
                +
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row justify={"space-between"} style={{ margin: "5px 0" }}>
        <Col span={12}>Children</Col>
        <Col span={12}>
          <Row gutter={[6, 0]}>
            <Col span={8} className=" center-items ">
              <Button
                className="cart-add-btn"
                shape="circle"
                type="ghost"
                onClick={() =>
                  setChildrenNo((prev) => {
                    if (prev === 0) {
                      return prev;
                    } else {
                      return prev - 1;
                    }
                  })
                }
              >
                -
              </Button>
            </Col>
            <Col span={8} className=" center-items ">
              <InputNumber
                className="cart-quantity-input"
                controls={false}
                min={0}
                value={childrenNo}
                onChange={(e) => setChildrenNo(e)}
              />
            </Col>
            <Col span={8} className=" center-items ">
              <Button
                className="cart-add-btn"
                shape="circle"
                onClick={() => setChildrenNo((prev) => prev + 1)}
              >
                +
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row justify={"space-between"} style={{ margin: "5px 0" }}>
        <Col span={12}>Rooms</Col>
        <Col span={12}>
          <Row gutter={[6, 0]}>
            <Col span={8} className=" center-items ">
              <Button
                className="cart-add-btn"
                shape="circle"
                type="ghost"
                onClick={() =>
                  setRoomNo((prev) => {
                    if (prev === 0) {
                      return prev;
                    } else {
                      return prev - 1;
                    }
                  })
                }
              >
                -
              </Button>
            </Col>
            <Col span={8} className=" center-items ">
              <InputNumber
                className="cart-quantity-input"
                controls={false}
                min={0}
                value={roomNo}
                onChange={(e) => setRoomNo(e)}
              />
            </Col>
            <Col span={8} className=" center-items ">
              <Button
                className="cart-add-btn"
                shape="circle"
                onClick={() => setRoomNo((prev) => prev + 1)}
              >
                +
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row justify={"space-between"} style={{ margin: "5px 0" }}>
        <Form.List name={`${type}ChildAge`}>
          {(fields) => (
            <>
              {Array(childrenNo)
                .fill(0)
                .map((_, index) => (
                  <Col xs={24} key={index}>
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: "#960bcd",
                        },
                      }}
                    >
                      <Row align="middle" gutter={[6, 0]}>
                        <Col>{index + 1} Child</Col>
                        <Col flex={1}>
                          <Form.Item
                            initialValue={1}
                            name={[index, `${type}ChildAge`]}
                          >
                            <Slider tooltip={"Person"} min={1} max={18} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </ConfigProvider>
                  </Col>
                ))}
            </>
          )}
        </Form.List>
      </Row>
    </section>
  );
}
