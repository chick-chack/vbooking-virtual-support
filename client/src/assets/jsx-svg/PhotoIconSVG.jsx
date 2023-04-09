export default function PhotoIcon(props) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M15 8h.01" />
      <path d="M7 4 H17 A3 3 0 0 1 20 7 V17 A3 3 0 0 1 17 20 H7 A3 3 0 0 1 4 17 V7 A3 3 0 0 1 7 4 z" />
      <path d="M4 15l4-4a3 5 0 013 0l5 5" />
      <path d="M14 14l1-1a3 5 0 013 0l2 2" />
    </svg>
  );
}
