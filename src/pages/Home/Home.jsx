import { useEffect, useRef, useState } from 'react'
import { searchBooks } from '../../api/books.js'
import BookCard from '../../components/BookCard/BookCard.jsx'
import styles from './Home.module.css'

const DEFAULT_QUERY = 'prince'

export default function Home() {
  const [search, setSearch] = useState('')

  const [query, setQuery] = useState(DEFAULT_QUERY)

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const searchInputRef = useRef(null)

  useEffect(() => {

    let ignore = false


    async function loadBooks() {
      setLoading(true)
      setError(null)

      try {
        const results = await searchBooks(query)
        if (!ignore) {
          setBooks(results)
        }
      } catch {
        if (!ignore) {
          setError('Impossible de charger les livres. Vérifiez votre connexion et réessayez.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadBooks()

    return () => {
      ignore = true
    }
  }, [query])

  function handleSubmit(event) {
    event.preventDefault()
    setQuery(search.trim() || DEFAULT_QUERY)
  }

  function handleClear() {
    setSearch('')
    searchInputRef.current?.focus()
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Bibliothèque</h1>
      <p className={styles.description}>
        Bienvenue dans notre bibliothèque. Découvrez notre{' '}
        <strong>sélection de romans d’aventure</strong> et consultez la fiche
        d’un livre pour en savoir plus. Cette sélection vous invite à explorer
        des récits d’aventure et des univers imaginaires.{' '}
        <em>Quel sera votre prochain voyage ?</em>
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.searchField}>
          <input ref={searchInputRef} type="search" name="q" id="book-name" aria-label="Rechercher un livre" 
            placeholder="Rechercher un titre, un auteur..." value={search} onChange={(event) => setSearch(event.target.value)}/>
          <button className={styles.clearButton} type="button" onClick={handleClear}>
            Effacer
          </button>
          <button type="submit" aria-label="Rechercher">
            <span className="material-symbols-outlined" aria-hidden="true"> search </span>
          </button>
        </div>
      </form>

      <p className={styles.currentSearch}>
        Recherche : <strong>{query}</strong>
      </p>

      <section className={styles.catalogue}>
        <h2>Les livres de la bibliothèque</h2>

        {loading && <p className={styles.message} role="status">Chargement des livres…</p>}
        {error && <p className={styles.message} role="alert">{error}</p>}
        {!loading && !error && books.length === 0 && (
          <p className={styles.message}>Aucun résultat</p>
        )}

        {!loading && !error && books.length > 0 && (
          <>
            <p className={styles.count}>
              {books.length} livre{books.length > 1 ? 's' : ''} affiché
              {books.length > 1 ? 's' : ''}
            </p>
            <ul className={styles.bookList}>
              {books.map((book) => (
                <li key={book.id}>
                  <BookCard book={book} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  )
}