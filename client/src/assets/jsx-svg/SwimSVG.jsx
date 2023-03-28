import * as React from "react";

const SwimSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={9}
    viewBox="0 0 20 9.841"
    {...props}
  >
    <defs>
      <linearGradient
        id="SwimSVG"
        x1="0.931"
        y1="0.118"
        x2="0.067"
        y2="0.867"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stop-color="#74b715" />
        <stop offset="1" stop-color="#0129b7" />
      </linearGradient>
    </defs>
    <path
      d="M7.573 0a1.159 1.159 0 0 0-.485.148L2.575 2.7.963 2.577a.754.754 0 0 0-.785.554L0 3.783l1.964.706a1.278 1.278 0 0 0 .972-.044l4.2-1.953 2.38 2.026L7.6 5.975l-1.948.877.255.164.331.211a3.044 3.044 0 0 0 1.378.392A3.049 3.049 0 0 0 9 7.227l.331-.211.513-.328.513.328.331.211a3.044 3.044 0 0 0 1.378.392 3.049 3.049 0 0 0 1.378-.392l.331-.211.513-.328.513.328.331.211a3.334 3.334 0 0 0 .8.314l-3.179-3.926L8.366.241A1.159 1.159 0 0 0 7.573 0Zm10.371 2.219a2.049 2.049 0 0 0-1.453.6l-.208.208a2.3 2.3 0 0 0-.208 3.114 2.3 2.3 0 0 0 3.115-.208l.208-.207a2.056 2.056 0 0 0-1.454-3.509ZM5.4 7.818l-.342.218a3.993 3.993 0 0 1-1.881.535 3.989 3.989 0 0 1-1.882-.536l-.681.754a4.336 4.336 0 0 0 2.564 1.052A5.174 5.174 0 0 0 5.4 9.294a5.174 5.174 0 0 0 2.222.547 5.174 5.174 0 0 0 2.222-.547 5.174 5.174 0 0 0 2.222.547 5.174 5.174 0 0 0 2.222-.547 5.174 5.174 0 0 0 2.222.547 4.334 4.334 0 0 0 2.564-1.052l-.683-.753a3.993 3.993 0 0 1-1.881.535 3.991 3.991 0 0 1-1.881-.535l-.342-.218-.342.218a3.993 3.993 0 0 1-1.881.535 3.991 3.991 0 0 1-1.881-.535l-.342-.218-.342.218a3.993 3.993 0 0 1-1.881.535 3.991 3.991 0 0 1-1.881-.535Z"
      fill={props.color || "url(#SwimSVG)"}
    />
  </svg>
);

export default SwimSVG;