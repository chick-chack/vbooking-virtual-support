const PersonSVG = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} {...props}>
    <path
      data-name="Path 49508"
      d="M8 8a4.012 4.012 0 1 1 2.825-1.175A3.853 3.853 0 0 1 8 8Zm6 8H2a2.006 2.006 0 0 1-2-2v-.8a2.983 2.983 0 0 1 1.6-2.65 14.853 14.853 0 0 1 3.15-1.163 13.84 13.84 0 0 1 6.5 0 14.853 14.853 0 0 1 3.15 1.163A2.983 2.983 0 0 1 16 13.2v.8a2 2 0 0 1-2 2ZM2 14h12v-.8a.947.947 0 0 0-.137-.5.974.974 0 0 0-.363-.35 13.031 13.031 0 0 0-2.725-1.013 11.594 11.594 0 0 0-5.55 0A13.031 13.031 0 0 0 2.5 12.35a.964.964 0 0 0-.362.35.939.939 0 0 0-.138.5Zm6-8a2.008 2.008 0 1 0-1.412-.588A1.927 1.927 0 0 0 8 6Z"
      fill={props.color || "#7c90a6"}
    />
  </svg>
);

export default PersonSVG;