import { useMemo, useCallback, useState, useContext } from "react";
import useDrivePicker from "react-google-drive-picker/dist";
import {
  Col,
  Image,
  Row,
  Spin,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";

import CommonService from "services/common.service";
import { ArrowRightSVG, DeleteSVG } from "assets/jsx-svg";
import googleDriveImg from "assets/images/GoogleDrive.png";
import png from "assets/images/png.png";
import pdf from "assets/images/pdf.png";
import doc from "assets/images/doc.png";
import xls from "assets/images/xls.png";
import zip from "assets/images/zip.png";
import jpg from "assets/images/jpg.png";
import fileImg from "assets/images/file.png";

import DragContext from "../DragContext";
import "./styles.css";

export default function FilesSharing({
  setActiveBtn,
  sharedFiles,
  setSharedFiles,
}) {
  const [uploading, setUploading] = useState(0);
  const [openPicker] = useDrivePicker();
  const { setDragData } = useContext(DragContext);

  const draggerProps = useMemo(
    () => ({
      name: "file",
      multiple: true,
      action: false,
      beforeUpload: () => false,
      onChange: async (info) => {
        setUploading((prev) => prev + 1);

        try {
          const {
            uploadedFiles: { file: fileUrl },
          } = await CommonService.uploadFile(info.file);

          const newFile = {
            id: info.file.uid,
            name: info.file.name,
            type: info.file.type,
            url: fileUrl,
            isGoogleDrive: false,
            embedUrl: null,
          };

          setSharedFiles((prev) => [...prev, newFile]);

          message.success({
            content: `Uploaded file: ${info.file.name}`,
          });
        } catch (error) {
          console.log("Error uploading file: ", error);
          message.error({
            content: `Failed to upload file: ${info.file.name}`,
          });
        } finally {
          setUploading((prev) => prev - 1);
        }
      },
      showUploadList: false,
    }),
    [setSharedFiles],
  );

  const onFileDelete = useCallback(
    (id) => {
      setSharedFiles((prev) => prev.filter((file) => file.id !== id));
    },
    [setSharedFiles],
  );

  const handleOpenPicker = useCallback(() => {
    openPicker({
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      developerKey: process.env.REACT_APP_GOOGLE_PICKER_API_KEY,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: false,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        // possible actions: loaded, picked, cancel
        if (data.action === "picked" && data.docs?.length) {
          const newFiles = data.docs.map((file) => ({
            id: file.id,
            name: file.name,
            type: file.mimeType,
            url: file.url,
            isGoogleDrive: true,
            embedUrl: file.embedUrl,
          }));

          setSharedFiles((prev) => [...prev, ...newFiles]);
        }
      },
    });
  }, [openPicker, setSharedFiles]);

  return (
    <section className="files-sharing">
      <Row
        wrap={false}
        align="middle"
        gutter={[8, 0]}
        style={{ width: "fit-content" }}
        className="clickable"
        onClick={() => setActiveBtn("tools")}
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
            Upload & Share Files with Participants
          </Typography.Text>
        </Col>
        <Col xs={24}>
          <Upload.Dragger
            {...draggerProps}
            customRequest={(e) => e.onSuccess("ok")}
            style={{
              background: "#fff",
              borderRadius: "14px",
              minHeight: "140px",
            }}
            fileList={[]}
            disabled={!!uploading}
          >
            <Spin spinning={!!uploading}>
              <Typography.Text className="fz-16 fw-500">
                Upload Files
              </Typography.Text>
              <br />
              <Typography.Text className="gc">or drag and drop</Typography.Text>
            </Spin>
          </Upload.Dragger>
        </Col>

        <Col style={{ cursor: "pointer" }} xs={24} onClick={handleOpenPicker}>
          <div className="center-items from-google-drive">
            <Row gutter={[0, 8]}>
              <Col xs={24}>
                <Row justify="center">
                  <Image
                    src={googleDriveImg}
                    alt="Google Drive"
                    height={30}
                    width={30}
                    preview={false}
                  />
                </Row>
              </Col>
              <Col xs={24}>
                <Row justify="center">
                  <Typography.Text className="fz-16 fw-500">
                    From Google Drive
                  </Typography.Text>
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {sharedFiles?.length ? (
        <div style={{ marginTop: "32px" }}>
          <Typography.Text className="fz-16 fw-500">
            Uploaded Files:
          </Typography.Text>

          <Row
            gutter={[0, 8]}
            className="mt-1"
            style={{ maxHeight: "390px", overflowY: "auto" }}
          >
            {sharedFiles.map((file) => (
              <Col
                key={file.id}
                xs={24}
                draggable
                onDragStart={() =>
                  setDragData({
                    dragging: true,
                    dropText: "Drop to share file",
                    dimId: null,
                    file: file,
                  })
                }
                onDragEnd={() =>
                  setDragData({
                    dragging: false,
                    dropText: "",
                    dimId: null,
                    file: null,
                  })
                }
              >
                <Row
                  justify="space-between"
                  align="middle"
                  wrap={false}
                  className="file-uploaded"
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
                    onClick={() => onFileDelete(file.id)}
                  >
                    <Row align="middle" wrap={false} gutter={[8, 0]}>
                      <Col>
                        <Typography.Text>Delete</Typography.Text>
                      </Col>
                      <Col>
                        <Row align="middle">
                          <DeleteSVG color="#000" />
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            ))}
          </Row>
        </div>
      ) : null}
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
