/**
 * Square apple mark (icon only) — favicon-style, not for header height.
 */
export default function AppleFaceMark({ className = "", size = 32 }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/apple-face-logo-square.png"
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden
    />
  );
}
