const ToolsSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 25 20.636"
    {...props}
  >
    <path
      d="M2.682.5A2.181 2.181 0 0 0 .5 2.682v13.091a2.181 2.181 0 0 0 2.182 2.182h5.454v2.182h8.727v-2.182h5.455a2.181 2.181 0 0 0 2.182-2.182V2.682A2.181 2.181 0 0 0 22.318.5Zm0 2.182h19.636v13.091H2.682Zm2.182 2.182v3.273h6.545V4.864Zm8.727 0v3.273h6.545V4.864Zm-8.727 5.454v3.273h6.545v-3.273Zm8.727 0v3.273h6.545v-3.273Z"
      fill={props.color || "#8e8e93"}
      stroke="rgba(0,0,0,0)"
      strokeMiterlimit={10}
      data-name="Share custom content (tools)"
    />
  </svg>
);

export default ToolsSVG;
