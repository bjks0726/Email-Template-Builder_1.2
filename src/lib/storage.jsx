// Simple localStorage persistence. Returns fallback if storage is unavailable
// (SSR, Safari private mode, etc.) or if JSON parse fails.

const PREFIX = "emailstudio:";

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
    return true;
  } catch {
    return false;
  }
}

// Specialized helpers for each entity. All values are plain JSON.
export const persist = {
  loadLobs: () => load("lobs", null),
  saveLobs: (lobs) => save("lobs", lobs),
  loadTemplates: () => load("templates", []),
  saveTemplates: (templates) => save("templates", templates),
  loadCustomSnippets: () => load("customSnippets", []),
  saveCustomSnippets: (list) => save("customSnippets", list),
  loadLastSession: () => load("lastSession", null),
  saveLastSession: (state) => save("lastSession", state),
};
