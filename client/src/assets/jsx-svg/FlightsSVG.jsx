import * as React from "react";

const FlightsSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 13.296 13.296"
    {...props}
  >
    <path
      data-name="Path 49484"
      d="m13.1.211-.014-.013c-.68-.647-2.04.5-2.04.5L8.577 2.641l-2.6-.461c.375-.543.488-1.083.238-1.333-.324-.324-1.133-.039-1.808.636a3.512 3.512 0 0 0-.317.363l-2-.354L.761 2.624 6.179 5.11l-3.474 4.2-2.163-.406-.548.547 3.845 3.844.547-.548-.406-2.163 4.2-3.473 2.486 5.418L11.8 11.2l-.353-2a3.477 3.477 0 0 0 .363-.317c.675-.675.959-1.484.635-1.808-.25-.25-.789-.137-1.333.238l-.46-2.6 1.943-2.468S13.746.892 13.1.211Z"
      fill={props.color || "#7c90a6"}
    />
  </svg>
);

export default FlightsSVG;
