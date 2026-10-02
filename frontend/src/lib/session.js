const SESSION_KEY = 'pdf-chat-session-id'

function generateId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }
  // Fallback for browsers without crypto.randomUUID (very old / non-secure
  // contexts). Not cryptographically strong, but only needs to be unique
  // enough to key a directory name — collisions are not a security concern.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Returns a stable per-browser session ID, creating and persisting one on
 * first use. This is what lets multiple visitors use the app at the same
 * time without their uploaded PDFs / chat sessions colliding on the
 * backend — each browser gets its own isolated session.
 */
export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = generateId()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}
