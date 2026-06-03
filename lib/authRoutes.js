/** Build login URL with optional mode and post-auth redirect (same-site paths only). */
export function getLoginUrl({ redirect, mode } = {}) {
  const params = new URLSearchParams();
  if (mode === "register") params.set("mode", "register");
  const safe = sanitizeRedirect(redirect);
  if (safe && safe !== "/profile") params.set("redirect", safe);
  const q = params.toString();
  return `/login${q ? `?${q}` : ""}`;
}

export function sanitizeRedirect(path) {
  if (!path || typeof path !== "string") return "/profile";
  if (path.startsWith("/") && !path.startsWith("//")) return path;
  return "/profile";
}
