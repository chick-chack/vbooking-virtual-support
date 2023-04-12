import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Image,
  InputNumber,
  notification,
  Row,
  Skeleton,
  Spin,
  Tooltip,
  Typography,
} from "antd";

import ShopService from "services/shop.service";
import { ArrowRightSVG } from "assets/jsx-svg";
import { axiosCatch } from "utils/axiosUtils";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import profileImg from "assets/images/avatar.png";
import defualtImage from "assets/images/download.png";
import "./styles.css";

export default function ProductSection({
  setProductSelected,
  productSelected,
  participants,
  setActiveBtn,
}) {
  const [productData, setProductData] = useState({});
  const [currentProductVariant, setCurrentProductVariant] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState({ id: 0, loading: false });

  useEffect(() => {
    setLoading(true);
    ShopService.getProductById(productSelected)
      .then(({ data }) => {
        setProductData(data.data.productInfo);
        setCurrentProductVariant(
          data.data.productInfo.businessProductVariants[0],
        );
        setOptions(data.data.productInfo.options);
        setAttributes(data.data.productInfo.options.attributes);

        setSelectedVariant(
          data.data.productInfo.businessProductVariants[0].title.split("/"),
        );
      })
      .catch(axiosCatch)
      .finally(() => setLoading(false));
  }, [productSelected]);

  useEffect(() => {
    if (selectedVariant.length > 0) {
      const found = productData?.businessProductVariants.find(
        (variant) => variant.title === selectedVariant.join("/"),
      );
      if (found) {
        setCurrentProductVariant(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant]);

  const addToCart = ({ customerId }) => {
    setAddLoading({ id: customerId, loading: true });
    ShopService.addToCart({
      productId: productData.id,
      quantity: productQuantity,
      productVariantId: currentProductVariant.id,
      // ahmed
      customerId: customerId,
    })
      .then(() => {
        notification.success({ message: "Product added successfully ✔" });
      })
      .catch(axiosCatch)
      .finally(() => setAddLoading({ id: customerId, loading: false }));
  };

  return (
    <>
      <Row
        wrap={false}
        align="middle"
        gutter={[8, 0]}
        style={{ width: "fit-content" }}
        className="clickable"
        onClick={() => setActiveBtn("inventory")}
      >
        <Col>
          <Row align="middle">
            <ArrowRightSVG color="#8E8E93" style={{ rotate: "180deg" }} />
          </Row>
        </Col>
        <Col>
          <Typography.Text className="gc">Back</Typography.Text>
        </Col>
      </Row>
      <div className="support-product-section">
        {loading && (
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </>
        )}

        {productData.id && currentProductVariant && (
          <Row style={{ margin: "24px 0 45px" }} gutter={[10, 20]}>
            <Col>
              <Col xs={24}>
                <Image
                  width={140}
                  src={currentProductVariant?.images[0] || defualtImage}
                  style={{ borderRadius: "16px" }}
                />
              </Col>
              <Col xs={24}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "1rem 0 1rem",
                  }}
                >
                  <Col>
                    <Button
                      className="cart-add-btn"
                      shape="circle"
                      type="ghost"
                      onClick={() =>
                        setProductQuantity((prev) => {
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
                  <Col>
                    <InputNumber
                      className="cart-quantity-input"
                      controls={false}
                      min={0}
                      max={currentProductVariant.quantity || 0}
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(e)}
                    />
                  </Col>
                  <Col>
                    <Button
                      className="cart-add-btn"
                      shape="circle"
                      onClick={() => setProductQuantity((prev) => prev + 1)}
                    >
                      +
                    </Button>
                  </Col>
                </div>
              </Col>
            </Col>
            <Col flex={1}>
              <Row justify="space-between">
                <Col>
                  <Typography.Text className="fz-18 fw-600">
                    {
                      productData.businessProductTranslations.find(
                        (lang) => lang.languageCode === "en",
                      ).name
                    }
                  </Typography.Text>
                </Col>
                <Col>
                  <Typography.Text className="fz-18 fw-600">
                    $ {currentProductVariant.price}
                  </Typography.Text>
                </Col>
              </Row>

              {attributes?.map((att, index) => (
                <>
                  <Row>
                    <Typography.Text className="fz-18 fw-500">
                      Select{" "}
                      {
                        att.lang.find((lang) => lang.lang === "en")
                          ?.attributeName
                      }
                    </Typography.Text>
                  </Row>

                  {att.colorCheck ? (
                    <Row gutter={[22, 22]} style={{ marginTop: "12px" }}>
                      {options.attOptions
                        .find((option) => option.attId === att.id)
                        ?.options.map((option) => (
                          <Col key={option.id}>
                            <Tooltip title={option.enOptionName}>
                              <button
                                style={{
                                  backgroundColor: option.color || "#000",
                                  outline:
                                    attributes.find(
                                      (attr) => attr.id === att.id,
                                    ).defaulttOption === option.id
                                      ? "5px solid #9f9f9f"
                                      : "",
                                }}
                                className="color-btn"
                                onClick={() => {
                                  setSelectedVariant((prev) => {
                                    prev[index] = option.enOptionName;
                                    return [...prev];
                                  });
                                  let copy = [...attributes];
                                  let foundIndex = copy.findIndex(
                                    (attr) => attr.id === att.id,
                                  );
                                  if (foundIndex > -1) {
                                    copy[foundIndex].defaulttOption = option.id;
                                  }

                                  setAttributes([...copy]);
                                }}
                              >
                                <Typography.Text
                                  ellipsis
                                  className="color-text"
                                >
                                  {option.enOptionName}
                                </Typography.Text>
                              </button>
                            </Tooltip>
                          </Col>
                        ))}
                    </Row>
                  ) : (
                    <Row gutter={[22, 22]} style={{ marginTop: "12px" }}>
                      {options.attOptions
                        .find((option) => option.attId === att.id)
                        ?.options.map((option) => (
                          <Col key={option.id}>
                            <Tooltip title={option.enOptionName}>
                              <button
                                style={{
                                  backgroundColor:
                                    attributes.find(
                                      (attr) => attr.id === att.id,
                                    ).defaulttOption === option.id
                                      ? "#9f9f9f"
                                      : "",
                                  color:
                                    attributes.find(
                                      (attr) => attr.id === att.id,
                                    ).defaulttOption === option.id
                                      ? "white"
                                      : "",
                                }}
                                className="size-btn"
                                onClick={() => {
                                  setSelectedVariant((prev) => {
                                    prev[index] = option.enOptionName;
                                    return [...prev];
                                  });
                                  let copy = [...attributes];
                                  let foundIndex = copy.findIndex(
                                    (attr) => attr.id === att.id,
                                  );
                                  if (foundIndex > -1) {
                                    copy[foundIndex].defaulttOption = option.id;
                                  }
                                  setAttributes([...copy]);
                                }}
                              >
                                <Typography.Text ellipsis>
                                  {option.enOptionName[0]}
                                </Typography.Text>
                              </button>
                            </Tooltip>
                          </Col>
                        ))}
                    </Row>
                  )}
                </>
              ))}

              <Row className="mt-1" gutter={[10, 10]} align="middle">
                <Col>
                  <div
                    className="dot"
                    style={{
                      background:
                        currentProductVariant.quantity > 0 ? "#93c850" : "#888",
                    }}
                  />
                </Col>
                <Col>
                  <Typography.Text
                    style={{
                      color:
                        currentProductVariant.quantity > 0 ? "#888" : "eee",
                    }}
                  >
                    {currentProductVariant.quantity > 0
                      ? `${currentProductVariant.quantity} pieces left available!`
                      : "Product Will be Avaliable Soon"}
                  </Typography.Text>
                </Col>
              </Row>
            </Col>

            {/* <Col xs={24}>
            <Input
              prefix={<SearchSVG />}
              placeholder="Search"
              style={{
                borderRadius: "14px",
                border: "none",
                marginTop: "0px",
              }}
            />
          </Col> */}

            <Row
              style={{ width: "100%" }}
              className="meet-participants"
              gutter={[0, 12]}
            >
              {participants
                ?.filter((p) => !p.isHost)
                ?.map((participant) => (
                  <Col key={participant.uid} xs={24}>
                    <Row justify="space-between" align="middle" wrap={false}>
                      <Col flex={1}>
                        <Row align="middle" wrap={false}>
                          <Image
                            style={{ borderRadius: "50%" }}
                            preview={false}
                            alt="profile pic"
                            src={participant.profileImage || profileImg}
                            width={48}
                            height={48}
                          />

                          <Typography.Text
                            ellipsis
                            style={{
                              marginInlineStart: "0.5rem",
                              color: "#888888",
                              fontSize: "1rem",
                            }}
                          >
                            {participant.name}
                          </Typography.Text>
                        </Row>
                      </Col>
                      <Col>
                        <button
                          className="add-cart"
                          onClick={() =>
                            addToCart({ customerId: participant.uid })
                          }
                        >
                          <Row align="middle" gutter={[6, 0]}>
                            <Col>
                              {addLoading.id === participant.uid &&
                              addLoading.loading ? (
                                <Spin spinning>
                                  <LoadingOutlined />
                                </Spin>
                              ) : (
                                <PlusOutlined />
                              )}
                            </Col>
                            <Col>
                              <Typography.Text
                                className="fw-500"
                                style={{ color: "#000" }}
                              >
                                Cart
                              </Typography.Text>
                            </Col>
                          </Row>
                        </button>
                      </Col>
                    </Row>
                  </Col>
                ))}
            </Row>
          </Row>
        )}
      </div>
    </>
  );
}
