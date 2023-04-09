import * as React from "react";

const PackageSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 32 31.722"
    {...props}
  >
    <path
      d="M16.006 0a3.251 3.251 0 0 0-1.531.362L1.578 6.487A2.769 2.769 0 0 0 0 8.987v13.875a3.2 3.2 0 0 0 1.828 2.891L14.4 31.716V14.209L3.672 8.966 8.263 6.81l12.71 5.938L17.6 14.3l.006 17.422 12.566-5.972A3.2 3.2 0 0 0 32 22.859V8.987a2.767 2.767 0 0 0-1.578-2.5L17.585.394A3.437 3.437 0 0 0 16.006 0Zm-.1 3.225c.059-.032.132-.033.25.031l12.86 5.781-4.244 1.957L12.035 5.04Z"
      fill={props.color || "#c7c7cc"}
    />
  </svg>
);

export default PackageSVG;
