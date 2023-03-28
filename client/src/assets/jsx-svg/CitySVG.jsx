import * as React from 'react';

const CitySVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      d="M8.8 5.6a.8.8 0 0 0-.8-.8H.8a.8.8 0 0 0-.8.8V16h8.8Zm-5.6 8.8H1.6v-1.6h1.6Zm0-3.2H1.6V9.6h1.6Zm0-3.2H1.6V6.4h1.6Zm4 6.4H4.8v-1.6h2.4Zm0-3.2H4.8V9.6h2.4Zm0-3.2H4.8V6.4h2.4ZM10 3.2H3.2V.8A.8.8 0 0 1 4 0h8a.8.8 0 0 1 .8.8v5.6h-2.4V3.6a.4.4 0 0 0-.4-.4Zm6 5.6V16h-2v-3.2h-1.6V16h-2V8.8a.8.8 0 0 1 .8-.8h4a.8.8 0 0 1 .8.8Z"
      fill={props.color || '#fff'}
    />
  </svg>
);

export default CitySVG;
