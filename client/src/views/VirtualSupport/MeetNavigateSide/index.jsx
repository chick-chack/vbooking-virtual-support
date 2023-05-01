import { useContext } from "react";
import { Avatar, Col, Image, Row, Tooltip } from "antd";
import {
  AlbumsSVG,
  CounterSVG,
  FileSVG,
  PackageSVG,
  ParticipantsSVG,
  SMSSVG,
  ShareDimenstionSVG,
  ShoppingCartSVG,
  ToolsSVG,
  VirtualMeetSVG,
} from "assets/jsx-svg";
import userContext from "context/userContext";

import logo from "assets/images/logo.png";
import hologram from "assets/images/3d-hologram.png";

import "./styles.css";
import { CustomerServiceFilled } from "@ant-design/icons";

export default function MeetNavigateSide({
  isHost,
  activeBtn,
  setActiveBtn,
  setHideSide,
  sharedDimId,
  askedForCounter,
  setMainFullScreen,
}) {
  const { user } = useContext(userContext);

  console.warn(activeBtn);
  return (
    <Row
      justify="start"
      align="middle"
      wrap={false}
      className="meet-navigate-side"
    >
      <Col>
        <Row justify="center">
          <Image
            preview={false}
            width={32}
            height={32}
            src={logo}
            className="clickable"
            onClick={() => setHideSide((prev) => !prev)}
          />
        </Row>
      </Col>

      <Col className="virtual-support-nav-sider-btns-wraper">
        <Row
          justify="space-between"
          align="middle"
          gutter={[
            { xs: 20, lg: 0 },
            { xs: 0, lg: 40 },
          ]}
          className="virtual-support-nav-sider-btns"
        >
          {/* For All users */}
          {[
            {
              id: "participant",
              title: "Participants",
              icon: ParticipantsSVG,
            },
            { id: "chat", title: "Chat", icon: SMSSVG },
          ].map((item) => (
            <Col key={item.id}>
              <Row
                justify="center"
                className={activeBtn === item.id && "sider-active-btn"}
              >
                <Tooltip title={item.title} mouseLeaveDelay={0}>
                  <item.icon
                    className="clickable"
                    onClick={() => {
                      setHideSide(false);
                      setMainFullScreen && setMainFullScreen(false);
                      setActiveBtn(item.id);
                    }}
                  />
                </Tooltip>
              </Row>
            </Col>
          ))}

          {/* Not Host User Only */}
          {!isHost && (
            <>
              <Col>
                <Row
                  justify="center"
                  className={activeBtn === "myCart" && "sider-active-btn"}
                >
                  <Tooltip title="My Cart" mouseLeaveDelay={0}>
                    <ShoppingCartSVG
                      className="clickable"
                      style={{ width: "22px", height: "22px" }}
                      color={"#c7c7cc"}
                      onClick={() => {
                        setHideSide(false);
                        setMainFullScreen && setMainFullScreen(false);
                        setActiveBtn("myCart");
                      }}
                    />
                  </Tooltip>
                </Row>
              </Col>

              <Col>
                <Row
                  justify="center"
                  className={activeBtn === "sharedFiles" && "sider-active-btn"}
                >
                  <Tooltip title="Shared Files" mouseLeaveDelay={0}>
                    <FileSVG
                      className="clickable"
                      style={{ width: "22px", height: "22px" }}
                      color={"#c7c7cc"}
                      onClick={() => {
                        setHideSide(false);
                        setMainFullScreen && setMainFullScreen(false);
                        setActiveBtn("sharedFiles");
                      }}
                    />
                  </Tooltip>
                </Row>
              </Col>

              {!!sharedDimId && (
                <Col>
                  <Row
                    justify="center"
                    className={activeBtn === "sharingDim" && "sider-active-btn"}
                  >
                    <Tooltip title="Join Dimension" mouseLeaveDelay={0}>
                      <ShareDimenstionSVG
                        className="clickable"
                        style={{ width: "22px", height: "22px" }}
                        color={"#c7c7cc"}
                        onClick={() => {
                          setHideSide(false);
                          setMainFullScreen && setMainFullScreen(false);
                          setActiveBtn("sharingDim");
                        }}
                      />
                    </Tooltip>
                  </Row>
                </Col>
              )}

              {askedForCounter && (
                <Col>
                  <Row
                    justify="center"
                    className={
                      activeBtn === "userCounter" && "sider-active-btn"
                    }
                  >
                    <Tooltip title="Counter" mouseLeaveDelay={0}>
                      <CounterSVG
                        className="clickable"
                        style={{ width: "22px", height: "22px" }}
                        color={"#c7c7cc"}
                        onClick={() => {
                          setHideSide(false);
                          setMainFullScreen && setMainFullScreen(false);
                          setActiveBtn("userCounter");
                        }}
                      />
                    </Tooltip>
                  </Row>
                </Col>
              )}
            </>
          )}

          {/* Host User Only */}
          {isHost && (
            <>
              {[
                {
                  id: "inventory",
                  title: "Inventory",
                  icon: PackageSVG,
                },
                {
                  id: "tools",
                  title: "Sharing Tools",
                  icon: ToolsSVG,
                },
                {
                  id: "counter",
                  title: "Counter",
                  icon: CounterSVG,
                },
                {
                  id: "counterUserSharedData",
                  title: "Users Shared Data",
                  icon: VirtualMeetSVG,
                },
                {
                  id: "productionTools",
                  title: "Production Tools",
                  icon: AlbumsSVG,
                },
                {
                  id: "desks",
                  title: "Desks",
                  icon: CustomerServiceFilled,
                },
                {
                  id: "holomeet",
                  title: "Holomeet",
                  image: hologram,
                },
              ].map((item) => (
                <Col key={item.id}>
                  <Row
                    justify="center"
                    className={activeBtn === item.id && "sider-active-btn"}
                  >
                    <Tooltip title={item.title} mouseLeaveDelay={0}>
                      {item.icon ? (
                        <item.icon
                          color="#c7c7cc"
                          className="clickable"
                          style={{
                            width: "24px",
                            height: "24px",
                            fontSize: "24px",
                            color: "#c7c7cc",
                          }}
                          onClick={() => {
                            setHideSide(false);
                            setMainFullScreen && setMainFullScreen(false);
                            setActiveBtn(item.id);
                          }}
                        />
                      ) : (
                        <Image
                          className="clickable"
                          preview={false}
                          width={24}
                          height={24}
                          src={item.image}
                          onClick={() => {
                            setHideSide(false);
                            setMainFullScreen && setMainFullScreen(false);
                            setActiveBtn(item.id);
                          }}
                        />
                      )}
                    </Tooltip>
                  </Row>
                </Col>
              ))}
            </>
          )}
        </Row>
      </Col>

      <Col className="virtual-support-avatar">
        <Avatar
          src={user.profileImage}
          size={40}
          style={{ objectFit: "cover" }}
        />
      </Col>
    </Row>
  );
}
