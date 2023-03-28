import { useMemo, useState } from "react";
import { Col, Image, Input, Row, Typography } from "antd";
import {
  ArrowRightSVG,
  PackageSVG,
  ParticipantsSVG,
  SearchSVG,
  ShoppingCartSVG,
  SMSSVG,
} from "assets/jsx-svg";

import hologram from "assets/images/3d-hologram.png";
import MeetingCallParticipants from "../MeetingCallParticipants";
import InventorySection from "../InventorySection";
import ProductSection from "../ProductSection";
import MeetChat from "../MeetChat";
import MyCart from "../MyCart";
import MetaExperience from "../MetaExperience";
import "./styles.css";

export default function MeetAsaider({
  isHost,
  chatLoading,
  messages,
  sendMessage,
  participants,
  setHideSider,
  activeBtn,
  setActiveBtn,
  setHoloModalOpen,
  SystemMessage,
}) {
  const [productSelected, setProductSelected] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const filterdParticipants = useMemo(
    () =>
      participants?.filter((participant) =>
        participant.name.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    [participants, searchValue],
  );

  const onSearch = (e) => {
    let value = e.target.value;

    if (value) {
      setSearchValue(value.trim());
    }
  };

  return (
    <aside>
      {!productSelected ? (
        <>
          <Row justify="end" className="mb-1">
            <Col
              className="clickable"
              onClick={() => setHideSider((prev) => !prev)}
            >
              <Row align="middle" gutter={[6, 0]} wrap={false}>
                <Col>
                  <Typography.Text style={{ color: "#6C6DE6" }}>
                    Hide
                  </Typography.Text>
                </Col>
                <Col>
                  <Row align="middle">
                    <ArrowRightSVG color="#6C6DE6" />
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          {activeBtn === "metaExperience" ? (
            <MetaExperience
              SystemMessage={SystemMessage}
              setActiveBtn={setActiveBtn}
            />
          ) : (
            <Row
              gutter={[0, 0]}
              wrap={false}
              style={{ overflowX: "auto" }}
              align="middle"
              justify="space-between"
              className="side-bar-tabs"
            >
              <Col>
                <button
                  className={`meet-asider-btns${
                    activeBtn === "participant" ? "-active" : ""
                  }`}
                  onClick={() => setActiveBtn("participant")}
                >
                  <Row
                    justify="center"
                    align="middle"
                    wrap={false}
                    gutter={[14, 0]}
                  >
                    <Col>
                      <Row align="middle">
                        <ParticipantsSVG
                          style={{ width: "20px", height: "20px" }}
                          color={activeBtn === "participant" ? "#6C6DE6" : ""}
                        />
                      </Row>
                    </Col>
                    {activeBtn === "participant" && (
                      <Col>
                        <Typography.Text ellipsis className="fw-500">
                          Participant
                        </Typography.Text>
                      </Col>
                    )}
                  </Row>
                </button>
              </Col>

              {isHost ? (
                <Col>
                  <button
                    className={`meet-asider-btns${
                      activeBtn === "inventory" ? "-active" : ""
                    }`}
                    onClick={() => setActiveBtn("inventory")}
                  >
                    <Row
                      justify="center"
                      align="middle"
                      wrap={false}
                      gutter={[14, 0]}
                    >
                      <Col>
                        <Row align="middle">
                          <PackageSVG
                            style={{ width: "20px", height: "20px" }}
                            color={activeBtn === "inventory" ? "#6C6DE6" : ""}
                          />
                        </Row>
                      </Col>
                      {activeBtn === "inventory" && (
                        <Col>
                          <Typography.Text ellipsis className="fw-500">
                            Inventory
                          </Typography.Text>
                        </Col>
                      )}
                    </Row>
                  </button>
                </Col>
              ) : (
                <Col>
                  <button
                    className={`meet-asider-btns${
                      activeBtn === "myCart" ? "-active" : ""
                    }`}
                    onClick={() => setActiveBtn("myCart")}
                  >
                    <Row
                      justify="center"
                      align="middle"
                      wrap={false}
                      gutter={[14, 0]}
                    >
                      <Col>
                        <Row align="middle">
                          <ShoppingCartSVG
                            style={{ width: "20px", height: "20px" }}
                            color={
                              activeBtn === "myCart" ? "#6C6DE6" : "#8e8e93"
                            }
                          />
                        </Row>
                      </Col>
                      {activeBtn === "myCart" && (
                        <Col>
                          <Typography.Text ellipsis className="fw-500">
                            My Cart
                          </Typography.Text>
                        </Col>
                      )}
                    </Row>
                  </button>
                </Col>
              )}

              <Col>
                <button
                  className={`meet-asider-btns${
                    activeBtn === "chat" ? "-active" : ""
                  }`}
                  onClick={() => setActiveBtn("chat")}
                >
                  <Row
                    justify="center"
                    align="middle"
                    wrap={false}
                    gutter={[14, 0]}
                  >
                    <Col>
                      <Row align="middle">
                        <SMSSVG
                          style={{ width: "20px", height: "20px" }}
                          color={activeBtn === "chat" ? "#6C6DE6" : ""}
                        />
                      </Row>
                    </Col>
                    {activeBtn === "chat" && (
                      <Col>
                        <Typography.Text ellipsis className="fw-500">
                          Chat
                        </Typography.Text>
                      </Col>
                    )}
                  </Row>
                </button>
              </Col>

              <Col>
                <Image
                  className="clickable"
                  preview={false}
                  width={20}
                  height={20}
                  src={hologram}
                  onClick={() => {
                    setHoloModalOpen((prev) => !prev);
                    setHideSider(true);
                  }}
                />
              </Col>
            </Row>
          )}

          {activeBtn === "myCart" && <MyCart />}

          {activeBtn === "participant" && (
            <Row style={{ marginTop: "24px" }} gutter={[0, 14]}>
              <Col xs={24}>
                <Input
                  onChange={onSearch}
                  prefix={<SearchSVG />}
                  placeholder="Search"
                  style={{
                    borderRadius: "14px",
                    border: "none",
                    height: "40px",
                  }}
                />
              </Col>
              <Col xs={24}>
                <MeetingCallParticipants participants={filterdParticipants} />
              </Col>
            </Row>
          )}

          {activeBtn === "inventory" && (
            <InventorySection setProductSelected={setProductSelected} />
          )}

          {activeBtn === "chat" && (
            <Row style={{ marginTop: "24px" }} gutter={[0, 14]}>
              <Col xs={24}>
                <MeetChat
                  loading={chatLoading}
                  messages={messages}
                  sendMessage={sendMessage}
                  participants={participants}
                />
              </Col>
            </Row>
          )}
        </>
      ) : (
        <ProductSection
          setProductSelected={setProductSelected}
          productSelected={productSelected}
          participants={participants}
        />
      )}
    </aside>
  );
}
