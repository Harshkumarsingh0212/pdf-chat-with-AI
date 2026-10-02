function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inlineFormat(str) {
  return str
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

/**
 * Converts a small subset of markdown (bold, inline code, bullet/numbered
 * lists, paragraphs) coming from the LLM response into safe HTML. All text
 * is HTML-escaped before any tags are introduced, so the output cannot
 * contain markup the model didn't intend as the supported subset above.
 */
export function renderAnswerHtml(text) {
  const escaped = escapeHtml(text || '')
  const lines = escaped.split(/\r?\n/)

  let html = ''
  let inList = false
  let listType = null

  const closeList = () => {
    if (inList) {
      html += `</${listType}>`
      inList = false
      listType = null
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    const bulletMatch = line.match(/^[-*]\s+(.*)/)
    const numberMatch = line.match(/^\d+[.)]\s+(.*)/)

    if (bulletMatch || numberMatch) {
      const type = bulletMatch ? 'ul' : 'ol'
      if (!inList || listType !== type) {
        closeList()
        html += `<${type}>`
        inList = true
        listType = type
      }
      const content = bulletMatch ? bulletMatch[1] : numberMatch[1]
      html += `<li>${inlineFormat(content)}</li>`
    } else {
      closeList()
      if (line) {
        html += `<p>${inlineFormat(line)}</p>`
      }
    }
  }
  closeList()

  return html
}
