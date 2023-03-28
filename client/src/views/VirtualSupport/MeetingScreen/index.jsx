import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Image, Row, Typography } from "antd";

import userContext from "context/userContext";
import profileImg from "assets/images/avatar.png";
import { MuteVoiceSVG, VoiceSVG } from "assets/jsx-svg";
import MeetingCallControls from "../MeetingCallControls";

import "./style.css";

const toAbsoluteUrl = (origin, pathname) =>
  origin + process.env.PUBLIC_URL + pathname;

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
  publishScreen,
  unPublishScreen,
  sharingScreen,
  SystemMessage,
  unPublishDim,
  sharingDim,
  isHost,
  joinedSharedDim,
  setJoinedSharedDim,
  sharedDimId,
}) {
  const [canvas, setCanvas] = useState();

  const [iframeRef, setIframeRef] = useState(null);
  const [controlSettingsShow, setControlSettingsShow] = useState(false);
  const { user } = useContext(userContext);

  const mountNode = iframeRef?.contentWindow?.document?.body;

  useEffect(() => {
    if (iframeRef && screen.dimensionId && user.cGAccessToken) {
      const configScript =
        iframeRef.contentWindow.document.createElement("script");

      const style = iframeRef.contentWindow.document.createElement("link");
      style.href = "/new-WebGL/style.css";
      style.rel = "stylesheet";

      const div = iframeRef.contentWindow.document.createElement("div");
      div.innerHTML =
        "<div class='loading-holder'><video autoPlay muted loop class='video-loading'><source src='/new-WebGL/dimension.mp4' type='video/mp4'/></video></div>";
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
      ];

      listScript.forEach((ele) => {
        const scriptName =
          iframeRef.contentWindow.document.createElement("script");
        scriptName.src = toAbsoluteUrl(
          iframeRef.contentWindow.top.location.origin,
          `/new-WebGL/${ele}`,
        );
        iframeRef.contentWindow.document.head.append(scriptName);
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

            iframeRef.contentWindow.loading.style.display = "none";
            iframeRef.contentWindow.unityInstance = unityInstance;
            iframeRef.contentWindow.web3 = window.web3;
            iframeRef.contentWindow.ethereum = window.ethereum;
          })
          .catch((message) => {
            alert(message);
          });
      };

      const loaderScript =
        iframeRef.contentWindow.document.createElement("script");
      loaderScript.src =
        toAbsoluteUrl(window.location.origin, "/new-WebGL/Build") +
        "/visit-dimension.loader.js";

      loaderScript.onload = () => {
        // if (window.navigator.geolocation) {
        //   window.navigator.geolocation.getCurrentPosition((pos) => {
        //     iframeRef.contentWindow.lat = pos.coords.latitude;
        //     iframeRef.contentWindow.lon = pos.coords.longitude;

        //     createUnityInstance();
        //   });
        // } else {
        iframeRef.contentWindow.lat = 25.0418278;
        iframeRef.contentWindow.lon = 55.2513757;

        createUnityInstance();
        // }
      };

      iframeRef.contentWindow.document.body.append(div);
      // iframeRef.contentWindow.document.body.append(hls);
      iframeRef.contentWindow.document.body.append(configScript);
      iframeRef.contentWindow.document.head.append(loaderScript);
      iframeRef.contentWindow.document.body.append(style);
    }
  }, [screen, iframeRef, user.cGAccessToken]);

  useEffect(() => {
    if (screen.hasVideo) screen.playTrack();
  }, [screen]);

  useEffect(() => {
    if (sharingDim && canvas && typeof publishDim === "function") {
      publishDim(canvas);
      setControlSettingsShow(true);
    }
  }, [canvas, publishDim, sharingDim]);

  if (!screen) {
    return null;
  }

  if (screen.type === "dim") {
    return (
      <section className="main-screen">
        <iframe
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title="Explore Metaverse"
          ref={setIframeRef}
        >
          {mountNode &&
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
                      <button id="rpm-hide-button" onclick="hideRpm()">
                        Hide
                      </button>
                    </div>
                    <canvas
                      ref={(r) => setCanvas(r)}
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
              mountNode,
            )}
        </iframe>

        <div
          className="main-screen-controls"
          style={{
            bottom: controlSettingsShow ? "-55px" : "0px",
            background: sharingDim || joinedSharedDim ? "inital" : "none",
            boxShadow: sharingDim || joinedSharedDim ? "inital" : "none",
            backdropFilter: sharingDim || joinedSharedDim ? "inital" : "none",
          }}
        >
          <MeetingCallControls
            audioMuted={audioMuted}
            soundMuted={soundMuted}
            cameraEnabled={cameraEnabled}
            toggleAudioMute={toggleAudioMute}
            toggleVideo={toggleVideo}
            toggleSoundMute={toggleSoundMute}
            publishScreen={publishScreen}
            unPublishScreen={unPublishScreen}
            sharingScreen={sharingScreen}
            SystemMessage={SystemMessage}
            unPublishDim={unPublishDim}
            sharingDim={sharingDim}
            isHost={isHost}
            joinedSharedDim={joinedSharedDim}
            setJoinedSharedDim={setJoinedSharedDim}
            sharedDimId={sharedDimId}
            userFullName={screen.userFullName}
            controlSettingsShow={controlSettingsShow}
            setControlSettingsShow={setControlSettingsShow}
          />
        </div>
      </section>
    );
  } else if (isMain) {
    return (
      <Row className="main-screen">
        {screen.hasVideo && (
          <div id={screen.screenId} className="video-player"></div>
        )}

        <div
          className="main-screen-controls"
          style={{
            bottom: controlSettingsShow ? "-55px" : "0px",
            background: sharingDim || joinedSharedDim ? "inital" : "none",
            boxShadow: sharingDim || joinedSharedDim ? "inital" : "none",
            backdropFilter: sharingDim || joinedSharedDim ? "inital" : "none",
          }}
        >
          <MeetingCallControls
            audioMuted={audioMuted}
            soundMuted={soundMuted}
            cameraEnabled={cameraEnabled}
            toggleAudioMute={toggleAudioMute}
            toggleVideo={toggleVideo}
            toggleSoundMute={toggleSoundMute}
            publishScreen={publishScreen}
            unPublishScreen={unPublishScreen}
            sharingScreen={sharingScreen}
            SystemMessage={SystemMessage}
            unPublishDim={unPublishDim}
            sharingDim={sharingDim}
            isHost={isHost}
            joinedSharedDim={joinedSharedDim}
            setJoinedSharedDim={setJoinedSharedDim}
            sharedDimId={sharedDimId}
            userFullName={screen.userFullName}
            controlSettingsShow={controlSettingsShow}
            setControlSettingsShow={setControlSettingsShow}
          />
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
            <Image
              style={{ borderRadius: "50%", objectFit: "cover" }}
              preview={false}
              alt="profile pic"
              src={screen.userProfileImage || profileImg}
              width={140}
              height={140}
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
            <Image
              style={{ borderRadius: "50%" }}
              preview={false}
              alt="profile pic"
              src={screen.userProfileImage || profileImg}
              width={50}
              height={50}
            />
          </div>
        )}
      </Row>
    );
  }
}
