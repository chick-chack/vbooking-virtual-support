const SMSSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 25 23.622"
    {...props}
  >
    <path
      d="M7.4.5a3.93 3.93 0 0 0-3.281 1.74H18.2a4.432 4.432 0 0 1 4.5 4.35v9.553a3.741 3.741 0 0 0 1.8-3.172V6.59A6.2 6.2 0 0 0 18.2.5Zm-3 2.9A3.841 3.841 0 0 0 .5 7.17v8.1a3.841 3.841 0 0 0 3.9 3.77h.3v2.63a1.44 1.44 0 0 0 .819 1.293 1.538 1.538 0 0 0 1.563-.12l5.411-3.8H17.6a3.841 3.841 0 0 0 3.9-3.773v-8.1a3.841 3.841 0 0 0-3.9-3.77Zm3 6.939a.871.871 0 1 1-.9.87.886.886 0 0 1 .9-.87Zm3.6 0a.871.871 0 1 1-.9.87.886.886 0 0 1 .9-.87Zm3.6 0a.871.871 0 1 1-.9.87.886.886 0 0 1 .9-.87Z"
      fill={props.color || "#c7c7cc"}
      stroke="rgba(0,0,0,0)"
      strokeMiterlimit={10}
    />
  </svg>
);

export default SMSSVG;
