// Home screen web apps on iOS resume instead of reloading, so they keep
// running an old build. When the app comes back to the foreground, compare
// the deployed entry script with ours and reload if a new version is out.
const entryScript = (doc: Document) =>
  doc.querySelector<HTMLScriptElement>('script[type="module"][src*="/assets/index-"]')
    ?.getAttribute("src");

const checkForUpdate = async () => {
  try {
    // Query string bypasses the GitHub Pages CDN cache (up to 10 minutes).
    const response = await fetch(`${import.meta.env.BASE_URL}?v=${Date.now()}`, {
      cache: "no-store",
    });
    if (!response.ok) return;
    const html = await response.text();
    const latest = entryScript(new DOMParser().parseFromString(html, "text/html"));
    if (latest && latest !== entryScript(document)) location.reload();
  } catch {
    // Offline: keep running the current version.
  }
};

export const enableAutoUpdate = () => {
  if (!import.meta.env.PROD) return;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkForUpdate();
  });
};
