import * as React from "react";

const CloseSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={11}
    viewBox="0 0 11.201 11.201"
    {...props}
  >
    <g data-name="Group 1622" fill={props.color || "#2d2d2d"}>
      <path d="m9.929 0 1.272 1.272-9.93 9.93L0 9.928z" />
      <path
        data-name="Rectangle Copy 19"
        d="m1.272 0 9.93 9.93L9.928 11.2 0 1.272z"
      />
    </g>
  </svg>
);

export default CloseSVG;
