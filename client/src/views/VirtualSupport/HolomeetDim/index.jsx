import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Col, Row } from "antd";

import userContext from "context/userContext";
import { CloseSVG } from "assets/jsx-svg";

import "./styles.css";
import { useParams } from "react-router-dom";

const toAbsoluteUrl = (origin, pathname) =>
  origin + process.env.PUBLIC_URL + pathname;

export default function HolomeetDim({
  SystemMessage,
  sharedHolomeetId,
  isHost,
}) {
  const { user } = useContext(userContext);
  const [iframeRef, setIframeRef] = useState(null);
  const { meetingId } = useParams();

  useEffect(() => {
    if (iframeRef && sharedHolomeetId && user.cGAccessToken) {
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
          var dimensionLink = "https://vverse.co/metaverse?dimensionId={${sharedHolomeetId}}&dimensionType={0}";
          var linkBase = "https://vverse.co/";
          var dimensionId = ${sharedHolomeetId};
          var dimensionType = ${sharedHolomeetId ? 0 : -1};
          var accessToken = "${user.cGAccessToken}";
          var apiBase = "https://portal.chickchack.net:7005/api/v6/mobile-game/";
          var production = true;
          var socketBase = "https://portal.chickchack.net:7005/";
          var storageBase = "https://chickchack.s3.eu-west-2.amazonaws.com"
          var isProduct = false;
          var isVirtualCall = true;
          var meetingId = ${Number(meetingId)}
    
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

            // iframeRef.contentWindow.loading.style.display = "none";
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
  }, [iframeRef, sharedHolomeetId, user.cGAccessToken]);

  return (
    <div className="holo-meet">
      <section className="main-screen-full">
        {isHost && (
          <div className="holomeet-top">
            <Row justify="space-between" align="middle">
              <Col></Col>
              <Col>
                <div
                  className="holomeet-close clickable"
                  onClick={() => SystemMessage.setHolomeet(null)}
                >
                  <CloseSVG
                    color="#fff"
                    style={{ width: "12px", height: "12px" }}
                    className="close-whiteboard"
                  />
                </div>
              </Col>
            </Row>
          </div>
        )}

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
                      // ref={setUnityCanvas}
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
      </section>
    </div>
  );
}
