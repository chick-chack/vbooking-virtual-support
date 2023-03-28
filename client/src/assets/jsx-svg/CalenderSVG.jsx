import * as React from "react";

const CalenderSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    viewBox="0 0 22.001 20"
    {...props}
    fill="red"
  >
    <path
      data-name="Path 50321"
      d="M3.055 19.998A3.02 3.02 0 0 1 0 17.023V7.132h22v9.891a3.02 3.02 0 0 1-3.057 2.975ZM0 5.947V4.158a3.02 3.02 0 0 1 3.055-2.973h3.057V.593a.6.6 0 0 1 .61-.6.6.6 0 0 1 .61.6v2.379a.6.6 0 0 0 .613.592.6.6 0 0 0 .61-.592V1.185h6.112V.593a.6.6 0 0 1 .61-.6.6.6 0 0 1 .611.6v2.379a.6.6 0 0 0 .61.592.6.6 0 0 0 .613-.592V1.185h1.831a3.02 3.02 0 0 1 3.057 2.973v1.789Z"
      fill={props.color || "#5c9937"}
    />
  </svg>
);

export default CalenderSVG;
