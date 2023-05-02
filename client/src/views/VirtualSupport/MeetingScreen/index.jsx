import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Avatar, Col, Row, Typography } from "antd";
import { createUI } from "@netless/fastboard";
import FileViewer from "react-file-viewer";

import userContext from "context/userContext";
import profileImg from "assets/images/avatar.png";
import {
  MuteVoiceSVG,
  VoiceSVG,
  CloseSVG,
  FullScreenImageSVG,
} from "assets/jsx-svg";
import MeetingCallControls from "../MeetingCallControls";

import DragContext from "../DragContext";
import MeetNavigateSide from "../MeetNavigateSide";

import "./style.css";
import MeetAsaider from "../MeetAsaider";

const toAbsoluteUrl = (origin, pathname) =>
  origin + process.env.PUBLIC_URL + pathname;

const getFileTypeFromMimeType = (mime) => {
  if (mime.includes("pdf")) {
    return "pdf";
  } else if (mime.includes("jpg") || mime.includes("jpeg")) {
    return "jpeg";
  } else if (mime.includes("png")) {
    return "png";
  } else if (mime.includes("gif")) {
    return "gif";
  } else if (mime.includes("officedocument.wordprocessingml.document")) {
    return "docx";
  } else if (mime.includes("officedocument.spreadsheetml.sheet")) {
    return "xlsx";
  } else if (mime.includes("csv")) {
    return "csv";
  } else if (mime.includes("mp4")) {
    return "mp4";
  } else if (mime.includes("webm")) {
    return "webm";
  } else if (mime.includes("audio") && mime.includes("mpeg")) {
    return "mp3";
  } else {
    return mime;
  }
};

export default function MeetingScreen({
  screen,
  setMainScreen,
  publishDim,
  isMain = false,
  audioMuted,
  soundMuted,
  cameraEnabled,
  toggleAudioMute,
  toggleVideo,
  toggleSoundMute,
  unPublishScreen,
  sharingScreen,
  SystemMessage,
  unPublishDim,
  sharingDim,
  isHost,
  joinedSharedDim,
  setJoinedSharedDim,
  sharedDimId,
  permissions,
  setPermissions,
  sharingFile,
  setActiveBtn,
  sharingWhiteboard,
  activeBtn,
  askedForCounter,
  setHideSide,
  messages,
  sendMessage,
  participants,
  shareWhiteboard,
  sharedFiles,
  setSharedFiles,
  sharingDimId,
  publishScreen,
  fastboard,
  setAskedForCounter,
  counterFormData,
  counterSharedData,
  localScreenTrack,
  chatRoomId,
  screenSize,
  hideSide,
  setDimensionFrames,
  deskId,
  iframeRef,
  setIframeRef,
  setCounterSharedData,
}) {
  const [unityCanvas, setUnityCanvas] = useState();
  const [whiteboardContainer, setWhiteboardContainer] = useState();
  const [controlSettingsShow, setControlSettingsShow] = useState(false);
  const [mainFullScreen, setMainFullScreen] = useState(false);

  const { user } = useContext(userContext);
  const { dragData, setDragData } = useContext(DragContext);

  const toggleFullScreen = () => {
    if (!mainFullScreen) {
      setHideSide(true);
    }
    setMainFullScreen((prev) => !prev);
  };

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const dimId = dragData.dimId;
      const file = dragData.file;

      if (dimId) {
        if (sharingScreen) {
          unPublishScreen();
        } else if (sharingWhiteboard) {
          SystemMessage.stopWhiteboard();
        } else if (sharingFile) {
          SystemMessage.stopFilePreview();
        }

        SystemMessage.shareDim(dimId);
      } else if (file) {
        if (sharingScreen) {
          unPublishScreen();
        } else if (sharingWhiteboard) {
          SystemMessage.stopWhiteboard();
        } else if (sharingDim) {
          SystemMessage.stopDim();
        }

        SystemMessage.shareFile(file);
      }

      setDragData({
        dragging: false,
        dropText: "",
        dimId: null,
        file: null,
      });
    },
    [
      SystemMessage,
      dragData,
      setDragData,
      sharingDim,
      sharingFile,
      sharingScreen,
      sharingWhiteboard,
      unPublishScreen,
    ],
  );

  const meetingControlsProps = useMemo(
    () => ({
      audioMuted: audioMuted,
      soundMuted: soundMuted,
      cameraEnabled: cameraEnabled,
      toggleAudioMute: toggleAudioMute,
      toggleVideo: toggleVideo,
      toggleSoundMute: toggleSoundMute,
      unPublishScreen: unPublishScreen,
      sharingScreen: sharingScreen,
      SystemMessage: SystemMessage,
      unPublishDim: unPublishDim,
      sharingDim: sharingDim,
      isHost: isHost,
      joinedSharedDim: joinedSharedDim,
      setJoinedSharedDim: setJoinedSharedDim,
      sharedDimId: sharedDimId,
      userFullName: screen.userFullName,
      controlSettingsShow: controlSettingsShow,
      setControlSettingsShow: setControlSettingsShow,
      permissions: permissions,
      setPermissions: setPermissions,
      setActiveBtn: setActiveBtn,
      sharingWhiteboard: sharingWhiteboard,
      sharingFile: sharingFile,
      showArrow:
        sharingDim ||
        joinedSharedDim ||
        sharingWhiteboard ||
        sharingFile ||
        sharingScreen ||
        screen.type === "desk",
    }),
    [
      SystemMessage,
      audioMuted,
      cameraEnabled,
      controlSettingsShow,
      isHost,
      joinedSharedDim,
      permissions,
      screen.type,
      screen.userFullName,
      setActiveBtn,
      setJoinedSharedDim,
      setPermissions,
      sharedDimId,
      sharingDim,
      sharingFile,
      sharingScreen,
      sharingWhiteboard,
      soundMuted,
      toggleAudioMute,
      toggleSoundMute,
      toggleVideo,
      unPublishDim,
      unPublishScreen,
    ],
  );

  const setFrames = (frames) => {
    setDimensionFrames(frames);
  };

  const setCounterFromUnity = (counter) => {
    console.log("/////////// setCounterFromUnity", counter);

    setCounterSharedData((prev) => {
      if (prev.hasOwnProperty(counter.user.id)) {
        prev[counter.user.id].userData = counter.user;

        if (counter.type === 1) {
          prev[counter.user.id].fullName = counter.data;
        }
        if (counter.type === 2) {
          prev[counter.user.id].signature = counter.data;
        }
        if (counter.type === 3) {
          prev[counter.user.id].files = [
            ...prev[counter.user.id].files,
            counter.data,
          ];
        }

        if (counter.type === 4) {
          prev[counter.user.id].customField = [
            ...prev[counter.user.id].customField,
            {
              user: {
                name: counter.customField,
                value: counter.data,
              },
              hisGuests: null,
            },
          ];
        }
      } else {
        prev[counter.user.id] = {
          userData: counter.user,
          fullName: counter.type === 1 ? counter.data : null,
          signature: counter.type === 2 ? counter.data : null,
          files: counter.type === 3 ? [counter.data] : [],
          customField:
            counter.type === 4
              ? [
                  {
                    user: {
                      name: counter.customField,
                      value: counter.data,
                    },
                    hisGuests: null,
                  },
                ]
              : [],
        };
      }

      SystemMessage.hostShareCounterData({ ...prev });

      return { ...prev };
    });
  };

  useEffect(() => {
    if (
      iframeRef &&
      iframeRef.contentWindow &&
      screen.dimensionId &&
      user.cGAccessToken
    ) {
      const configScript =
        iframeRef.contentWindow.document.createElement("script");

      const style = iframeRef.contentWindow.document.createElement("link");
      style.href = "/new-WebGL/style.css";
      style.rel = "stylesheet";

      const div = iframeRef.contentWindow.document.createElement("div");
      div.innerHTML =
        "<div style='width: 100%; height: 100%' class='loading-holder'><video autoPlay muted loop style='width: 100%; height: 100%; object-fit: contain;' class='video-loading'><source src='/new-WebGL/dimension.mp4' type='video/mp4'/></video></div>";
      div.id = "loading";
      div.className = "loading";

      const listScript = [
        "hls.min.js",
        "AgoraWebSDK/libs/agora-extension-virtual-background.js",
        "AgoraWebSDK/libs/virtualbackground.js",
        "AgoraWebSDK/libs/databuilder.js",
        "AgoraWebSDK/libs/clientmanager.js",
        "AgoraWebSDK/libs/wglwrapper.js",
        "AgoraWebSDK/libs/audioeffects.js",
        "AgoraWebSDK/libs/eventmanager.js",
        "AgoraWebSDK/libs/engineglobals.js",
        "AgoraWebSDK/libs/watermark.js",
        "AgoraWebSDK/libs/customvideo.js",
        "AgoraWebSDK/libs/agorachannel.js",
        "AgoraWebSDK/libs/multichannel.js",
        "AgoraWebSDK/libs/audiosystem.js",
        "AgoraWebSDK/libs/testing.js",
        "AgoraWebSDK/libs/agorautils.js",
        "AgoraWebSDK/libs/audiomixing.js",
        "AgoraWebSDK/agorartcenginev2.js",
        "AgoraWebSDK/vendor/materialize.min.js",
        "AgoraRTC_N.js",
        "AgoraWebSDK/libs/spatial-audio-main.js",
        "AgoraWebSDK/vendor/jquery.min.js",
        "ReadyPlayerMeFrame.js",
        "Build/visit-dimension.loader.js",
      ];
      iframeRef.contentWindow.loadCounter = 0;
      listScript.forEach((ele) => {
        const scriptName =
          iframeRef.contentWindow.document.createElement("script");
        scriptName.src = toAbsoluteUrl(
          iframeRef.contentWindow.top.location.origin,
          `/new-WebGL/${ele}`,
        );
        iframeRef.contentWindow.document.head.append(scriptName);
        scriptName.onload = (e) => {
          iframeRef.contentWindow.loadCounter++;
          if (iframeRef.contentWindow.loadCounter === listScript.length)
            setTimeout(iframeRef.contentWindow.loadUnity, 500);
        };
      });

      configScript.innerHTML = `
      var disableVoice = true;
      var mainCanvas = document.getElementById("myCanvas");
      var mainContext = mainCanvas.getContext('2d');
      var inMemCanvas = document.getElementById("inMem_Canvas");
      var inMemContext = inMemCanvas.getContext('2d');
      var canvasWidth = mainCanvas.width;
      var canvasHeight = mainCanvas.height;
      var angle = 0;
      var isRent = false;
      var dimensionLink = "https://vverse.co/metaverse?dimensionId={${
        screen.dimensionId
      }}&dimensionType={0}";
      var linkBase = "https://vverse.co/";
      var dimensionId = ${screen.dimensionId};
      var dimensionType = ${screen.dimensionId ? 0 : -1};
      var accessToken = "${user.cGAccessToken}";
      var apiBase = "https://portal.chickchack.net:7005/api/v6/mobile-game/";
      var production = true;
      var socketBase = "https://portal.chickchack.net:7005/";
      var storageBase = "https://chickchack.s3.eu-west-2.amazonaws.com"
      var isProduct = false;
      var isDeskHost = ${isHost ? true : false};
      var deskId = "${deskId}";

      var buildUrl = '${toAbsoluteUrl(
        iframeRef.contentWindow.top.location.origin,
        "/new-WebGL/Build",
      )}';
      var loaderUrl = buildUrl + '/visit-dimension.loader.js';
      var config = {
        dataUrl: buildUrl + '/visit-dimension.data.br',
        frameworkUrl: buildUrl + '/visit-dimension.framework.js.br',
        codeUrl: buildUrl + '/visit-dimension.wasm.br',
        streamingAssetsUrl: buildUrl + '/StreamingAssets',
        companyName: 'PiPhi Technology',
        productName: 'Visit Dimension',
        productVersion: '1.0',
      };

      var container = document.querySelector("#unity-container");
      var canvas = document.querySelector("#unity-canvas");
      var loading = document.querySelector("#loading");
      var platform = 2; //1 mobile, 2 windows, 4 mac, 8 linux
      loading.style.display = "";

      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        config.devicePixelRatio = 1;
        platform = 1;
      }

      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0) {
        platform = 4;
      }

      window.onmessage = function(e) {
        try {
          if (e.data === "SetFullscreen") {
            window.unityInstance.SetFullscreen(true);
          }
        } catch(ignored) {}
      };
      `;

      const createUnityInstance = () => {
        iframeRef.contentWindow
          .createUnityInstance(
            iframeRef.contentWindow.canvas,
            iframeRef.contentWindow.config,
            (progress) => {
              console.log("progress", progress);
            },
          )
          .then((unityInstance) => {
            unityInstance.SendMessage(
              "BG_Scripts/Constatnts",
              "SetPlatform",
              iframeRef.contentWindow.platform,
            );

            iframeRef.contentWindow.onResponseInputRecived = (counter) => {
              console.log(
                "/////////////////////////////// call from unity counter",
                counter,
              );
              setCounterFromUnity(counter);
            };

            iframeRef.contentWindow.updateDimensionFrames = (frames) => {
              setFrames(frames);
            };

            // iframeRef.contentWindow.loading.style.display = "none";
            iframeRef.contentWindow.unityInstance = unityInstance;
            iframeRef.contentWindow.web3 = window.web3;
            iframeRef.contentWindow.ethereum = window.ethereum;
          })
          .catch((message) => {
            console.log("message", message);
          });
      };

      iframeRef.contentWindow.loadUnity = () => {
        iframeRef.contentWindow.lat = 25.0418278;
        iframeRef.contentWindow.lon = 55.2513757;

        createUnityInstance();
      };

      iframeRef.contentWindow.document.body.append(div);
      iframeRef.contentWindow.document.body.append(configScript);
      iframeRef.contentWindow.document.body.append(style);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, iframeRef, user.cGAccessToken]);

  useEffect(() => {
    if (screen.hasVideo) {
      screen.playTrack();
    } else if (sharingWhiteboard && screen.room && whiteboardContainer) {
      createUI(screen.room, whiteboardContainer);
    }
  }, [sharingWhiteboard, screen, whiteboardContainer]);

  useEffect(() => {
    if (sharingDim && unityCanvas && typeof publishDim === "function") {
      publishDim(unityCanvas);
    }
  }, [unityCanvas, publishDim, sharingDim]);

  useEffect(() => {
    if (
      sharingDim ||
      joinedSharedDim ||
      sharingWhiteboard ||
      sharingFile ||
      sharingScreen ||
      screen.type === "desk"
    ) {
      setControlSettingsShow(true);
    }
  }, [
    joinedSharedDim,
    sharingDim,
    sharingWhiteboard,
    sharingFile,
    sharingScreen,
    screen.type,
  ]);

  if (!screen) {
    return null;
  }

  if (screen.type === "dim") {
    return (
      <section className={mainFullScreen ? "main-screen-full" : "main-screen"}>
        <Row wrap={false} className="h-100">
          {mainFullScreen && (
            <Col {...(hideSide ? null : { xs: 24, xl: hideSide ? 2 : 8 })}>
              <Row wrap={false} className="h-100">
                <Col>
                  <div className="full-screen-asider-navigate">
                    <MeetNavigateSide
                      isHost={isHost}
                      activeBtn={activeBtn}
                      setActiveBtn={setActiveBtn}
                      setHideSide={setHideSide}
                      sharedDimId={sharedDimId}
                      askedForCounter={askedForCounter}
                    />
                  </div>
                </Col>

                {!hideSide && (screenSize.xl || screenSize.xxl) && (
                  <Col flex={1} className="virtual-support-aside-hide h-100">
                    <div
                      style={{ padding: "24px 1rem", background: "#f2f2f7e6" }}
                      className="h-100"
                    >
                      <MeetAsaider
                        isHost={isHost}
                        chatLoading={!chatRoomId}
                        messages={messages}
                        sendMessage={sendMessage}
                        participants={participants}
                        activeBtn={activeBtn}
                        setActiveBtn={setActiveBtn}
                        SystemMessage={SystemMessage}
                        shareWhiteboard={shareWhiteboard}
                        permissions={permissions}
                        sharedFiles={sharedFiles}
                        setSharedFiles={setSharedFiles}
                        sharedDimId={sharedDimId}
                        sharingDimId={sharingDimId}
                        unPublishScreen={unPublishScreen}
                        publishScreen={publishScreen}
                        sharingScreen={localScreenTrack?.enabled}
                        sharingDim={!!sharingDimId}
                        sharingFile={!!sharingFile}
                        sharingWhiteboard={!!fastboard}
                        setHideSide={setHideSide}
                        fastboard={fastboard}
                        joinedSharedDim={joinedSharedDim}
                        setJoinedSharedDim={setJoinedSharedDim}
                        setAskedForCounter={setAskedForCounter}
                        counterFormData={counterFormData}
                        counterSharedData={counterSharedData}
                        iframeRef={iframeRef}
                      />
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
          )}
          <Col flex={1}>
            <iframe
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              title="Explore Metaverse"
              ref={setIframeRef}
            >
              {iframeRef?.contentWindow?.document?.body &&
                createPortal(
                  <>
                    <div id="unity-container">
                      <div id="canvas-wrap">
                        <div id="rpm-container">
                          <iframe
                            title="rpm-frame"
                            id="rpm-frame"
                            className="rpm-frame"
                            allow="camera *; microphone *"
                          ></iframe>
                          <button id="rpm-hide-button" onClick="hideRpm()">
                            Hide
                          </button>
                        </div>
                        <canvas
                          ref={setUnityCanvas}
                          id="unity-canvas"
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        ></canvas>
                      </div>
                    </div>
                    <canvas
                      id="inMem_Canvas"
                      height="450"
                      width="450"
                      style={{ display: "none" }}
                    ></canvas>
                    <canvas
                      id="myCanvas"
                      height="450"
                      width="450"
                      style={{ display: "none" }}
                    ></canvas>
                  </>,
                  iframeRef?.contentWindow?.document?.body,
                )}
            </iframe>
          </Col>
        </Row>

        {dragData.dragging && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="dragover-overlay"
          >
            {dragData.dropText}
          </div>
        )}

        <div
          className="whiteboard-fullscreen clickable"
          onClick={toggleFullScreen}
        >
          <FullScreenImageSVG
            color="#fff"
            style={{ width: "12px", height: "12px" }}
            className="close-whiteboard"
          />
        </div>

        <div
          className="whiteboard-close clickable"
          onClick={() =>
            isHost
              ? SystemMessage.stopDim()
              : setJoinedSharedDim(!joinedSharedDim)
          }
        >
          <CloseSVG
            color="#fff"
            style={{ width: "12px", height: "12px" }}
            className="close-whiteboard"
          />
        </div>

        <div
          className={`main-screen-controls ${
            controlSettingsShow && "main-screen-controls-hide"
          }`}
        >
          <MeetingCallControls {...meetingControlsProps} />
        </div>
      </section>
    );
  } else if (screen.type === "desk") {
    return (
      <section
        className={mainFullScreen ? "main-screen-full" : "main-screen"}
        style={{ minHeight: "100%" }}
      >
        <Row wrap={false} className="h-100">
          {mainFullScreen && (
            <Col {...(hideSide ? null : { xs: 24, xl: hideSide ? 2 : 8 })}>
              <Row wrap={false} className="h-100">
                <Col>
                  <div className="full-screen-asider-navigate">
                    <MeetNavigateSide
                      isHost={isHost}
                      activeBtn={activeBtn}
                      setActiveBtn={setActiveBtn}
                      setHideSide={setHideSide}
                      sharedDimId={sharedDimId}
                      askedForCounter={askedForCounter}
                    />
                  </div>
                </Col>

                {!hideSide && (screenSize.xl || screenSize.xxl) && (
                  <Col flex={1} className="virtual-support-aside-hide h-100">
                    <div
                      style={{ padding: "24px 1rem", background: "#f2f2f7e6" }}
                      className="h-100"
                    >
                      <MeetAsaider
                        isHost={isHost}
                        chatLoading={!chatRoomId}
                        messages={messages}
                        sendMessage={sendMessage}
                        participants={participants}
                        activeBtn={activeBtn}
                        setActiveBtn={setActiveBtn}
                        SystemMessage={SystemMessage}
                        shareWhiteboard={shareWhiteboard}
                        permissions={permissions}
                        sharedFiles={sharedFiles}
                        setSharedFiles={setSharedFiles}
                        sharedDimId={sharedDimId}
                        sharingDimId={sharingDimId}
                        unPublishScreen={unPublishScreen}
                        publishScreen={publishScreen}
                        sharingScreen={localScreenTrack?.enabled}
                        sharingDim={!!sharingDimId}
                        sharingFile={!!sharingFile}
                        sharingWhiteboard={!!fastboard}
                        setHideSide={setHideSide}
                        fastboard={fastboard}
                        joinedSharedDim={joinedSharedDim}
                        setJoinedSharedDim={setJoinedSharedDim}
                        setAskedForCounter={setAskedForCounter}
                        counterFormData={counterFormData}
                        counterSharedData={counterSharedData}
                        iframeRef={iframeRef}
                      />
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
          )}
          <Col flex={1}>
            <iframe
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              title="Explore Desk"
              ref={setIframeRef}
            >
              {iframeRef?.contentWindow?.document?.body &&
                createPortal(
                  <>
                    <div id="unity-container">
                      <div id="canvas-wrap">
                        <div id="rpm-container">
                          <iframe
                            title="desk"
                            id="rpm-frame"
                            class="rpm-frame"
                            allow="camera *; microphone *"
                          ></iframe>
                          <button id="rpm-hide-button" onclick="hideRpm()">
                            Hide
                          </button>
                        </div>
                        <canvas
                          id="unity-canvas"
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        ></canvas>
                      </div>
                    </div>
                    <canvas
                      id="inMem_Canvas"
                      height="450"
                      width="450"
                      style={{ display: "none" }}
                    ></canvas>
                    <canvas
                      id="myCanvas"
                      height="450"
                      width="450"
                      style={{ display: "none" }}
                    ></canvas>
                  </>,
                  iframeRef?.contentWindow?.document?.body,
                )}
            </iframe>
          </Col>
        </Row>

        {dragData.dragging && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="dragover-overlay"
          >
            {dragData.dropText}
          </div>
        )}

        <div
          className="whiteboard-fullscreen clickable"
          onClick={toggleFullScreen}
        >
          <FullScreenImageSVG
            color="#fff"
            style={{ width: "12px", height: "12px" }}
            className="close-whiteboard"
          />
        </div>

        {isHost && (
          <div
            className="whiteboard-close clickable"
            onClick={() => {
              SystemMessage.stopDesk();
            }}
          >
            <CloseSVG
              color="#fff"
              style={{ width: "12px", height: "12px" }}
              className="close-whiteboard"
            />
          </div>
        )}

        <div
          className={`main-screen-controls ${
            controlSettingsShow && "main-screen-controls-hide"
          }`}
        >
          <MeetingCallControls {...meetingControlsProps} />
        </div>
      </section>
    );
  } else if (screen.type === "file") {
    return (
      <Row
        className={
          mainFullScreen ? "main-screen-full" : "main-screen file-screen"
        }
      >
        {dragData.dragging && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="dragover-overlay"
          >
            {dragData.dropText}
          </div>
        )}

        <div
          className="whiteboard-fullscreen clickable"
          onClick={toggleFullScreen}
        >
          <FullScreenImageSVG
            color="#fff"
            style={{ width: "12px", height: "12px" }}
            className="close-whiteboard"
          />
        </div>

        {isHost && (
          <div
            className="whiteboard-close clickable"
            onClick={SystemMessage.stopFilePreview}
          >
            <CloseSVG
              color="#fff"
              style={{ width: "12px", height: "12px" }}
              className="close-whiteboard"
            />
          </div>
        )}

        {mainFullScreen ? (
          <Row wrap={false} className="w-100 h-100">
            <Col {...(hideSide ? null : { xs: 24, xl: hideSide ? 2 : 8 })}>
              <Row wrap={false} className="h-100">
                <Col>
                  <div className="full-screen-asider-navigate">
                    <MeetNavigateSide
                      isHost={isHost}
                      activeBtn={activeBtn}
                      setActiveBtn={setActiveBtn}
                      setHideSide={setHideSide}
                      sharedDimId={sharedDimId}
                      askedForCounter={askedForCounter}
                    />
                  </div>
                </Col>

                {!hideSide && (screenSize.xl || screenSize.xxl) && (
                  <Col flex={1} className="virtual-support-aside-hide h-100">
                    <div
                      style={{ padding: "24px 1rem", background: "#f2f2f7e6" }}
                      className="h-100"
                    >
                      <MeetAsaider
                        isHost={isHost}
                        chatLoading={!chatRoomId}
                        messages={messages}
                        sendMessage={sendMessage}
                        participants={participants}
                        activeBtn={activeBtn}
                        setActiveBtn={setActiveBtn}
                        SystemMessage={SystemMessage}
                        shareWhiteboard={shareWhiteboard}
                        permissions={permissions}
                        sharedFiles={sharedFiles}
                        setSharedFiles={setSharedFiles}
                        sharedDimId={sharedDimId}
                        sharingDimId={sharingDimId}
                        unPublishScreen={unPublishScreen}
                        publishScreen={publishScreen}
                        sharingScreen={localScreenTrack?.enabled}
                        sharingDim={!!sharingDimId}
                        sharingFile={!!sharingFile}
                        sharingWhiteboard={!!fastboard}
                        setHideSide={setHideSide}
                        fastboard={fastboard}
                        joinedSharedDim={joinedSharedDim}
                        setJoinedSharedDim={setJoinedSharedDim}
                        setAskedForCounter={setAskedForCounter}
                        counterFormData={counterFormData}
                        counterSharedData={counterSharedData}
                        iframeRef={iframeRef}
                      />
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
            <Col flex={1}>
              <div className="file-canvas" style={{ background: "#fff" }}>
                {screen.file.isGoogleDrive ? (
                  <iframe
                    title="Google Drive Embed"
                    style={{ width: "100%", height: "100%" }}
                    src={screen.file.embedUrl}
                  />
                ) : (
                  <FileViewer
                    fileType={getFileTypeFromMimeType(screen.file.type)}
                    filePath={screen.file.url}
                    errorComponent={<h1>Error previewing the file</h1>}
                    onError={(err) => console.log("FileViewer error:", err)}
                  />
                )}
              </div>
            </Col>
          </Row>
        ) : (
          <div className="file-canvas">
            {screen.file.isGoogleDrive ? (
              <iframe
                title="Google Drive Embed"
                style={{ width: "100%", height: "100%" }}
                src={screen.file.embedUrl}
              />
            ) : (
              <FileViewer
                fileType={getFileTypeFromMimeType(screen.file.type)}
                filePath={screen.file.url}
                errorComponent={<h1>Error previewing the file</h1>}
                onError={(err) => console.log("FileViewer error:", err)}
              />
            )}
          </div>
        )}

        <div
          className={`main-screen-controls ${
            controlSettingsShow && "main-screen-controls-hide"
          }`}
        >
          <MeetingCallControls {...meetingControlsProps} />
        </div>
      </Row>
    );
  } else if (screen.type === "whiteboard") {
    return (
      <Row
        className={
          mainFullScreen ? "main-screen-full" : "main-screen whiteboard-screen"
        }
      >
        {mainFullScreen ? (
          <Row wrap={false} className="w-100 h-100">
            <Col {...(hideSide ? null : { xs: 24, xl: hideSide ? 2 : 8 })}>
              <Row wrap={false} className="h-100">
                <Col>
                  <div className="full-screen-asider-navigate">
                    <MeetNavigateSide
                      isHost={isHost}
                      activeBtn={activeBtn}
                      setActiveBtn={setActiveBtn}
                      setHideSide={setHideSide}
                      sharedDimId={sharedDimId}
                      askedForCounter={askedForCounter}
                    />
                  </div>
                </Col>

                {!hideSide && (screenSize.xl || screenSize.xxl) && (
                  <Col flex={1} className="virtual-support-aside-hide h-100">
                    <div
                      style={{ padding: "24px 1rem", background: "#f2f2f7e6" }}
                      className="h-100"
                    >
                      <MeetAsaider
                        isHost={isHost}
                        chatLoading={!chatRoomId}
                        messages={messages}
                        sendMessage={sendMessage}
                        participants={participants}
                        activeBtn={activeBtn}
                        setActiveBtn={setActiveBtn}
                        SystemMessage={SystemMessage}
                        shareWhiteboard={shareWhiteboard}
                        permissions={permissions}
                        sharedFiles={sharedFiles}
                        setSharedFiles={setSharedFiles}
                        sharedDimId={sharedDimId}
                        sharingDimId={sharingDimId}
                        unPublishScreen={unPublishScreen}
                        publishScreen={publishScreen}
                        sharingScreen={localScreenTrack?.enabled}
                        sharingDim={!!sharingDimId}
                        sharingFile={!!sharingFile}
                        sharingWhiteboard={!!fastboard}
                        setHideSide={setHideSide}
                        fastboard={fastboard}
                        joinedSharedDim={joinedSharedDim}
                        setJoinedSharedDim={setJoinedSharedDim}
                        setAskedForCounter={setAskedForCounter}
                        counterFormData={counterFormData}
                        counterSharedData={counterSharedData}
                        iframeRef={iframeRef}
                      />
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
            <Col flex={1}>
              <div
                ref={setWhiteboardContainer}
                className="whiteboard-canvas"
              ></div>
            </Col>
          </Row>
        ) : (
          <div ref={setWhiteboardContainer} className="whiteboard-canvas"></div>
        )}

        {dragData.dragging && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="dragover-overlay"
          >
            {dragData.dropText}
          </div>
        )}

        <div
          className="whiteboard-fullscreen clickable"
          onClick={toggleFullScreen}
        >
          <FullScreenImageSVG
            color="#fff"
            style={{ width: "12px", height: "12px" }}
            className="close-whiteboard"
          />
        </div>

        {isHost && (
          <div
            className="whiteboard-close clickable"
            onClick={SystemMessage.stopWhiteboard}
          >
            <CloseSVG
              color="#fff"
              style={{ width: "12px", height: "12px" }}
              className="close-whiteboard"
            />
          </div>
        )}

        <div
          className={`main-screen-controls ${
            controlSettingsShow && "main-screen-controls-hide"
          }`}
        >
          <MeetingCallControls {...meetingControlsProps} />
        </div>
      </Row>
    );
  } else if (isMain) {
    return (
      <Row className={"main-screen"}>
        {screen.hasVideo && (
          <div id={screen.screenId} className="video-player"></div>
        )}

        {sharingScreen && isHost && (
          <div
            className="whiteboard-close clickable"
            onClick={() => unPublishScreen()}
          >
            <CloseSVG
              color="#fff"
              style={{ width: "12px", height: "12px" }}
              className="close-whiteboard"
            />
          </div>
        )}

        {dragData.dragging && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="dragover-overlay"
          >
            {dragData.dropText}
          </div>
        )}

        <div
          className={`main-screen-controls ${
            controlSettingsShow && "main-screen-controls-hide"
          }`}
          style={{
            bottom: sharingScreen && controlSettingsShow ? "-55px" : "0px",
            background: sharingScreen ? "inital" : "none",
            boxShadow: sharingScreen ? "inital" : "none",
            backdropFilter: sharingScreen ? "inital" : "none",
          }}
        >
          <MeetingCallControls {...meetingControlsProps} />
        </div>

        {screen.type === "rtc" && (
          <span className="friend-screen-sound">
            {!screen.hasAudio ? (
              <MuteVoiceSVG
                color="#fff"
                style={{ width: "12px", height: "12px" }}
              />
            ) : (
              <VoiceSVG
                color="#fff"
                style={{ width: "12px", height: "12px" }}
              />
            )}
          </span>
        )}

        {!screen.hasVideo && (
          <div className="main-screen-img">
            <Avatar
              size={140}
              src={screen.userProfileImage || profileImg}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </Row>
    );
  } else {
    return (
      <Row
        className="friend-screen"
        onClick={() => setMainScreen(screen.screenId)}
      >
        {screen.hasVideo && (
          <div id={screen.screenId} className="video-player"></div>
        )}

        <Row className="friend-screen-status" align="middle">
          <Typography.Text className="fz-12 wc" ellipsis>
            {screen.userFullName}
          </Typography.Text>
        </Row>

        {screen.type === "rtc" && (
          <span className="friend-screen-sound">
            {!screen.hasAudio ? (
              <MuteVoiceSVG
                color="#fff"
                style={{ width: "12px", height: "12px" }}
              />
            ) : (
              <VoiceSVG
                color="#fff"
                style={{ width: "12px", height: "12px" }}
              />
            )}
          </span>
        )}

        {!screen.hasVideo && (
          <div className="friend-screen-img">
            <Avatar
              size={50}
              src={screen.userProfileImage || profileImg}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </Row>
    );
  }
}
