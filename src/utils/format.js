export function getYear(publishedDate) {
  return publishedDate ? publishedDate.slice(0, 4) : null
}


export function formatPublishedDate(publishedDate) {
  if (!publishedDate) return null

  const parts = publishedDate.split('-')
  if (parts.length === 1) return publishedDate

  const date = new Date(
    parts.length === 2 ? `${publishedDate}-01` : publishedDate,
  )
  if (Number.isNaN(date.getTime())) return publishedDate

  const options =
    parts.length === 2
      ? { month: 'long', year: 'numeric', timeZone: 'UTC' }
      : { dateStyle: 'long', timeZone: 'UTC' }

  return date.toLocaleDateString('fr-FR', options)
}


export function formatLanguage(code) {
  if (!code) return null

  try {
    const name = new Intl.DisplayNames(['fr'], { type: 'language' }).of(code)
    return name.charAt(0).toUpperCase() + name.slice(1)
  } catch {
    return code
  }
}


export function descriptionToParagraphs(html) {
  if (!html) return []


  const withBreaks = html
    .replace(/(<br\s*\/?>\s*){2,}/gi, '\n')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, '\n')


  const doc = new DOMParser().parseFromString(withBreaks, 'text/html')
  doc.querySelectorAll('script, style').forEach((element) => element.remove())

  return (doc.body.textContent ?? '')
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}


export function splitTitle(title) {
  const match = title.match(/^(.*?)([^\s-]+)$/s)
  return match ? { start: match[1], end: match[2] } : { start: '', end: title }
}