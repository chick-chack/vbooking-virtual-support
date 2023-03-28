import * as React from 'react';

const LeftArrowSVG = (props) => (
  <svg
    data-name="_Icons / Arrow Right"
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 20}
    height={props.height || 20}
    viewBox="0 0 37.643 33.46"
    {...props}
  >
    <path
      data-name="Arrow Right"
      d="M16.716 29.526a2.459 2.459 0 0 1 .014 3.259 1.958 1.958 0 0 1-2.966-.01L.621 18.36a2.452 2.452 0 0 1 0-3.263L13.764.681a1.965 1.965 0 0 1 2.966-.01 2.455 2.455 0 0 1-.014 3.259L7.14 14.43h28.406a2.2 2.2 0 0 1 2.1 2.294 2.207 2.207 0 0 1-2.1 2.294H7.14Z"
      fill={props.color || '#fff'}
    />
  </svg>
);

export default LeftArrowSVG;
