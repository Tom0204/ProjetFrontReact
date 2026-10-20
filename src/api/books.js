const API_URL = 'https://www.googleapis.com/books/v1/volumes'
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
const MAX_RESULTS = 12

// Tailles de couverture, de la plus grande à la plus petite
const COVER_SIZES = [
  'extraLarge',
  'large',
  'medium',
  'small',
  'thumbnail',
  'smallThumbnail',
]

function getCover(imageLinks) {
  const size = COVER_SIZES.find((name) => imageLinks?.[name])
  return size ? imageLinks[size].replace(/^http:/, 'https:') : null
}


function toBook(item) {
  const info = item.volumeInfo ?? {}

  return {
    id: item.id,
    title: info.title ?? 'Titre inconnu',
    authors: info.authors ?? [],
    publishedDate: info.publishedDate ?? null,
    cover: getCover(info.imageLinks),
    language: info.language ?? null,
    genre: info.categories?.[0] ?? null,
    description: info.description ?? null,
  }
}


async function fetchWithRetry(url) {

  try {
    let response = await fetch(url)
    while (!response.ok) {
        response = await fetch(url)
    }
    console.log("Réponse Google Books :")
    return response
  } catch (error) {
    console.error("Erreur lors de la requête Google Books :", error)
    throw error
  }
}


function buildParams(params = {}) {
  const searchParams = new URLSearchParams(params)
  if (API_KEY) {
    searchParams.set('key', API_KEY)
  }
  return searchParams
}


export async function searchBooks(query) {
  const params = buildParams({ q: query, maxResults: MAX_RESULTS })
  const response = await fetchWithRetry(`${API_URL}?${params}`)

  if (!response.ok) {
    const details = await response.text()

    console.error("Détails de l'erreur Google Books :", details)

    throw new Error(`Erreur Google Books : ${response.status}`)
  }

  const data = await response.json()

  return (data.items ?? []).map(toBook)
}



export async function getBook(id) {
  const response = await fetchWithRetry(
    `${API_URL}/${encodeURIComponent(id)}?${buildParams()}`,
  )

  if (response.status === 404) {
    return null
  }
  console.log("Réponse Google Books :")

  const data = await response.json()

  console.log("Données du livre :", data.volumeInfo)
  console.log("Résumé reçu :", data.volumeInfo?.description)

  return toBook(data)
}