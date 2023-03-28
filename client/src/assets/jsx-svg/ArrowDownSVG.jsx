import * as React from 'react';

const ArrowDownSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 18.045 10.414"
    {...props}
  >
    <path
      data-name="Path 57"
      d="m1.414 1.414 7.609 8 7.609-8"
      fill="none"
      stroke={props.color || '#888'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </svg>
);

export default ArrowDownSVG;
