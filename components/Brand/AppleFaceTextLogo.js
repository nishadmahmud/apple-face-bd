/**
 * Horizontal text wordmark — Apple Face (header, footer, loading).
 */
export default function AppleFaceTextLogo({
  className = "",
  height = 24,
  variant = "onLight",
}) {
  const primary = variant === "onDark" ? "#ffffff" : "#111827";
  const face = "#E31E24";
  const width = Math.round((115 / 28) * height);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 115 28"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="Apple Face"
    >
      <text
        x="0"
        y="21"
        fill={primary}
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="-0.02em"
      >
        Apple
      </text>
      <text
        x="58"
        y="21"
        fill={face}
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="-0.02em"
      >
        Face
      </text>
    </svg>
  );
}
