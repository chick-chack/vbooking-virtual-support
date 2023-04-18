import { Avatar, Col, Image, Row, Tooltip, Typography } from "antd";

import { ArrowRightSVG } from "assets/jsx-svg";
import png from "assets/images/png.png";
import pdf from "assets/images/pdf.png";
import doc from "assets/images/doc.png";
import xls from "assets/images/xls.png";
import zip from "assets/images/zip.png";
import jpg from "assets/images/jpg.png";
import fileImg from "assets/images/file.png";

import "./styles.css";

export default function CounterSharedData({ setActiveBtn, counterSharedData }) {
  console.warn(counterSharedData);
  let sharedData = [];
  if (Object.keys(counterSharedData).length) {
    for (const [key, data] of Object.entries(counterSharedData)) {
      sharedData.push(
        <Col
          key={key}
          xs={24}
          style={{
            borderBottom: "2px solid #ccc",
            paddingTop: "1rem",
            paddingBottom: "1rem",
          }}
        >
          <Row align="middle" gutter={[8, 8]} style={{ maxWidth: "100%" }}>
            {data.userData && (
              <Col>
                <Avatar
                  size={38}
                  style={{ objectFit: "cover" }}
                  src={data.userData.profileImage}
                />
              </Col>
            )}
            <Col>
              <Typography.Text
                className="fz-16 fw-500"
                style={{ color: "#960bcd" }}
              >
                {data.userData ? data.userData.fullName : data.name}
              </Typography.Text>
            </Col>
          </Row>

          {data.fullName && (
            <>
              <Row className="mt-1">
                <Typography.Text>
                  <span className="fw-600" style={{ fontStyle: "italic" }}>
                    User Full Name:
                  </span>{" "}
                  {data.fullName.user ? data.fullName.user : data.fullName}
                </Typography.Text>
              </Row>

              {data.fullName.hisGuests &&
                data.fullName.hisGuests.map((guest, index) => (
                  <Row className="mt-1" key={index}>
                    <Typography.Text>
                      <span className="fw-600" style={{ fontStyle: "italic" }}>
                        Guest {index + 1}:
                      </span>{" "}
                      {guest}
                    </Typography.Text>
                  </Row>
                ))}
            </>
          )}

          {data.files.length > 0 && (
            <>
              <Row className="mt-1">
                <Typography.Text
                  className="fw-600"
                  style={{ fontStyle: "italic" }}
                >
                  Fiels Uploaded:{" "}
                </Typography.Text>
              </Row>

              {data.files.map((file) => (
                <Row
                  key={file.id}
                  justify="space-between"
                  align="middle"
                  wrap={false}
                  className="file-uploaded"
                  style={{ userSelect: "none", marginTop: "8px" }}
                >
                  <Col>
                    <Row align="middle" wrap={false} gutter={[16, 0]}>
                      <Col>
                        <Image
                          width={32}
                          height={32}
                          alt={file.name}
                          src={filesExtentionsImg(file.type)}
                          preview={false}
                        />
                      </Col>
                      <Col style={{ maxWidth: "100px" }}>
                        <Tooltip title={file.name}>
                          <Typography.Text ellipsis>
                            {file.name}
                          </Typography.Text>
                        </Tooltip>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    className="clickable"
                    onClick={() => window.open(file.url)}
                  >
                    <Row align="middle" wrap={false} gutter={[8, 0]}>
                      <Col>
                        <Typography.Text>Download</Typography.Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ))}
            </>
          )}

          {data.signature && (
            <>
              <Row className="mt-1">
                <Typography.Text
                  className="fw-600"
                  style={{ fontStyle: "italic" }}
                >
                  Signature :
                </Typography.Text>
              </Row>

              <Row
                justify="space-between"
                align="middle"
                wrap={false}
                className="file-uploaded "
                style={{ userSelect: "none", marginTop: "8px" }}
              >
                <Col>
                  <Row align="middle" wrap={false} gutter={[16, 0]}>
                    <Col>
                      <Image
                        width={32}
                        height={32}
                        alt={data.signature.name}
                        src={filesExtentionsImg(data.signature.type)}
                        preview={false}
                      />
                    </Col>
                    <Col style={{ maxWidth: "100px" }}>
                      <Tooltip title={data.signature.name}>
                        <Typography.Text ellipsis>
                          {data.signature.name}
                        </Typography.Text>
                      </Tooltip>
                    </Col>
                  </Row>
                </Col>
                <Col
                  className="clickable"
                  onClick={() => window.open(data.signature.url)}
                >
                  <Row align="middle" wrap={false} gutter={[8, 0]}>
                    <Col>
                      <Typography.Text>Download</Typography.Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          )}

          {data.customField && data.customField.length > 0 && (
            <>
              <Row className="mt-1">
                <Typography.Text
                  className="fw-600"
                  style={{ fontStyle: "italic" }}
                >
                  Custom Field:{" "}
                </Typography.Text>
              </Row>

              {data.customField &&
                data.customField.map((field, index) => {
                  if (field.user) {
                    return (
                      <>
                        <Row key={index}>
                          <Typography.Text>
                            {field.user.name} : {field.user.value}
                          </Typography.Text>
                        </Row>

                        {field.hisGuests.length > 0 &&
                          field.hisGuests.map((guest, index) => (
                            <Row key={index}>
                              <Typography.Text>
                                {guest.name} : {guest.value} (Guest {index + 1})
                              </Typography.Text>
                            </Row>
                          ))}
                      </>
                    );
                  } else {
                    return null;
                  }
                })}

              {data.customField.hisGuests &&
                data.customField.hisGuests.map((field, index) => (
                  <Row key={index}>
                    <Typography.Text>
                      {field.name} : {field.value} (Guest {index + 1})
                    </Typography.Text>
                  </Row>
                ))}
            </>
          )}
        </Col>,
      );
    }
  }

  return (
    <section className="shared-files">
      <Row
        wrap={false}
        align="middle"
        gutter={[8, 0]}
        style={{ width: "fit-content" }}
        className="clickable"
        onClick={() => setActiveBtn("counter")}
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

      <Row style={{ marginTop: "24px" }} gutter={[0, 24]}>
        <Col xs={24}>
          <Typography.Text className="fz-16 fw-500">
            Files shared by users:
          </Typography.Text>
        </Col>
      </Row>

      <Row gutter={[0, 16]} style={{ maxHeight: "750px", overflowY: "auto" }}>
        {sharedData}
      </Row>
    </section>
  );
}

const filesExtentionsImg = (fileType) => {
  const extension = fileType.split("/")[1];

  let imageSrc;
  switch (extension) {
    case "png":
      imageSrc = png;
      break;
    case "pdf":
      imageSrc = pdf;
      break;
    case "doc":
    case "docx":
      imageSrc = doc;
      break;
    case "xls":
    case "xlsx":
      imageSrc = xls;
      break;
    case "zip":
      imageSrc = zip;
      break;
    case "jpg":
    case "jpeg":
      imageSrc = jpg;
      break;
    default:
      imageSrc = fileImg;
  }

  return imageSrc;
};
