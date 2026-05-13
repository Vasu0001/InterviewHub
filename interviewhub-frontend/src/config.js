const trimTrailingSlash = (value) => value?.replace(/\/+$/, "");

const rawBackendUrl = trimTrailingSlash(import.meta.env.VITE_BACKEND_URL || "");
const isLocalBackend =
  rawBackendUrl.includes("localhost") || rawBackendUrl.includes("127.0.0.1");

export const BACKEND_URL =
  rawBackendUrl && !(import.meta.env.PROD && isLocalBackend)
    ? rawBackendUrl
    : import.meta.env.DEV
      ? "http://localhost:8000"
      : "";

export const PUBLIC_APP_URL =
  trimTrailingSlash(import.meta.env.VITE_PUBLIC_APP_URL || "") ||
  window.location.origin;

if (import.meta.env.PROD && !BACKEND_URL) {
  console.error(
    "VITE_BACKEND_URL must be set to the Render backend URL in production.",
  );
}
