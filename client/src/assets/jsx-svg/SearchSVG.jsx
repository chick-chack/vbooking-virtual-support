import * as React from "react";

const SearchSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21.931}
    height={21.931}
    {...props}
  >
    <g
      transform="translate(.8 .8)"
      fill="none"
      stroke={props.color || "#c7c7cc"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.6}
    >
      <circle cx={8.889} cy={8.889} r={8.889} />
      <path d="m20 20-4.833-4.833" />
    </g>
  </svg>
);

export default SearchSVG;
