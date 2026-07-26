const KEY = "cs-advisor-visitor-id";

/**
 * Anonymous per-browser id used to scope AI advisor conversations.
 * Visitors never sign in, so this random id is what ties a browser to its
 * own threads; it is only ever read on the client.
 */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
