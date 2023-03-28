import * as React from "react";

const CallSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 25.238 25.238"
    {...props}
  >
    <g
      data-name="Handset"
      style={{
        mixBlendMode: "normal",
        isolation: "isolate",
      }}
      fill={props.color || "#69B0A5"}
    >
      <path
        data-name="16 Handset"
        d="m2.179.891.162-.162a2.4 2.4 0 0 1 3.712.324l3.3 4.715a2.432 2.432 0 0 1-.27 3.117l-.2.2a1.838 1.838 0 0 0-.294 2.246 15.219 15.219 0 0 0 5.311 5.32 1.838 1.838 0 0 0 2.246-.294l.2-.2a2.432 2.432 0 0 1 3.117-.27l4.715 3.3a2.4 2.4 0 0 1 .324 3.712l-.162.162a7.459 7.459 0 0 1-9.225 1.039A43.843 43.843 0 0 1 1.14 10.122 7.459 7.459 0 0 1 2.179.891Z"
      />
    </g>
  </svg>
);

export default CallSVG;
