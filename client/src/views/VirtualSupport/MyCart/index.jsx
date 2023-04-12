import { Button, Col, Image, Row, Typography } from "antd";

import defualtImage from "assets/images/download.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShopService from "services/shop.service";
import { axiosCatch } from "utils/axiosUtils";
import "./styles.css";

export default function MyCart({ setActiveBtn }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await ShopService.getCartData();
        setCart(res.data.data.rows);
      } catch (err) {
        axiosCatch(err);
      }
    })();
  }, []);

  return (
    <>
      <Typography.Text className="fz-18 fw-500">My Cart</Typography.Text>
      <section className="support-my-cart">
        {cart?.map((item) => (
          <Row
            key={item.id}
            align="middle"
            justify="space-between"
            gutter={[0, 25]}
            className="cart-item"
          >
            <Col>
              <Row
                align="middle"
                justify="space-between"
                gutter={[16, 0]}
                wrap={false}
              >
                <Col>
                  <Image
                    alt="product image"
                    src={
                      item.businessProductVariant?.images?.length
                        ? item.businessProductVariant?.images[0]
                        : defualtImage
                    }
                    width={70}
                    height={70}
                    style={{ borderRadius: "16px" }}
                    preview={false}
                  />
                </Col>
                <Col>
                  <Row style={{ maxWidth: "160px" }}>
                    <Col xs={24}>
                      <Typography.Text className="fz-14 fw-600" ellipsis>
                        {item.businessProductVariant?.title}
                      </Typography.Text>
                    </Col>
                    <Col xs={24}>
                      <Typography.Text
                        className="fz-12"
                        style={{ color: "#77838F" }}
                        ellipsis
                      >
                        Qty: {item.quantity}
                      </Typography.Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col>
              <Typography.Text className="fz-16 fw-600">
                $ {item.businessProductVariant?.price}
              </Typography.Text>
            </Col>
          </Row>
        ))}
        <Row style={{ marginTop: "24px" }}>
          <Col xs={24}>
            <Link to="/checkout">
              <Button type="primary" className="w-100">
                Checkout Now
              </Button>
            </Link>
          </Col>
        </Row>
      </section>
    </>
  );
}
