import * as React from "react";

const TimeSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 17 17"
    {...props}
  >
    <defs>
      <linearGradient
        id="TimeSVG"
        x1={0.931}
        y1={0.118}
        x2={0.067}
        y2={0.867}
        gradientUnits="objectBoundingBox"
      >
        <stop offset={0} stopColor="#74b715" />
        <stop offset={1} stopColor="#0129b7" />
      </linearGradient>
    </defs>
    <g data-name="Ball 9">
      <g data-name="Group 2" fill={props.color || "url(#TimeSVG)"}>
        <path
          data-name="Ellipse 1"
          d="M8.501 0a8.5 8.5 0 1 1-8.5 8.5 8.51 8.51 0 0 1 8.5-8.5Zm0 15.543a7.043 7.043 0 1 0-7.043-7.042 7.051 7.051 0 0 0 7.043 7.042Z"
        />
        <path
          data-name="Vector 3"
          d="M10.94 12.218a.736.736 0 0 1-.567-.266l-2.46-2.951a.738.738 0 0 1-.171-.469V3.608a.738.738 0 1 1 1.476 0v4.653l2.286 2.747a.738.738 0 0 1-.567 1.211Z"
        />
      </g>
    </g>
  </svg>
);

export default TimeSVG;
