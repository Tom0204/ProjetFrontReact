import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getBook } from '../../api/books.js'
import fallbackCover from '../../assets/moby-dick.png'
import { FavoritesContext } from '../../contexts/FavoritesContext.js'
import { descriptionToParagraphs, formatLanguage, formatPublishedDate, splitTitle} from '../../utils/format.js'
import styles from './Book.module.css'

export default function Book() {
  const { id } = useParams()
  const { favoriteIds, toggleFavorite } = useContext(FavoritesContext)

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
    let ignore = false

    async function loadBook() {
      setLoading(true)
      setError(null)
      setBook(null)

      try {
        const result = await getBook(id)
        if (!ignore) {
          setBook(result)
        }
      } catch {
        if (!ignore) {
          setError('Impossible de charger ce livre. Vérifiez votre connexion et réessayez.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadBook()

    return () => {
      ignore = true
    }
  }, [id])

  if (loading) {
    return (
      <main className={styles.page}>
        <p className={styles.message} role="status">Chargement du livre…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className={styles.page}>
        <p className={styles.message} role="alert">{error}</p>
      </main>
    )
  }

  if (!book) {
    return (
      <main className={styles.page}>
        <p className={styles.message}>
          Livre introuvable. <Link to="/">Retour à la bibliothèque</Link>
        </p>
      </main>
    )
  }

  const isFavorite = favoriteIds.includes(book.id)
  const title = splitTitle(book.title)
  const publishedDate = formatPublishedDate(book.publishedDate)
  const language = formatLanguage(book.language)
  const paragraphs = descriptionToParagraphs(book.description)

  return (
    <main className={styles.page}>
      <article className={styles.bookDetail}>
        <div className={styles.bookSidebar}>
          <img className={styles.detailCover} src={book.cover ?? fallbackCover} alt={`Couverture du livre ${book.title}`}/>
          <div className={styles.bookActions}>
            <button className={[styles.bookAction, styles.primary].join(' ')} type="button" onClick={() => toggleFavorite(book.id)}>
              <span className="material-symbols-outlined" aria-hidden="true"> {isFavorite ? 'heart_minus' : 'favorite'} </span>
              {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </button>
            <a className={styles.bookAction} href="#resume">
              <span className="material-symbols-outlined" aria-hidden="true"> menu_book </span>
              Lire le résumé
            </a>
          </div>
        </div>

        <div className={styles.bookInformation}>
          <nav className={styles.breadcrumb} aria-label="Fil d’Ariane">
            <ol>
              <li><Link to="/">Bibliothèque</Link></li>
              <li aria-current="page">{book.title}</li>
            </ol>
          </nav>

          <h1>{title.start}<span>{title.end}</span></h1>
          <p className={styles.detailAuthor}>
            {book.authors.length > 0 ? book.authors.join(', ') : 'Auteur inconnu'}
          </p>

          <dl className={styles.detailMetadata}>
            <div>
              <dt>
                <span className="material-symbols-outlined" aria-hidden="true"> calendar_today </span>
                <span className={styles.visuallyHidden}>Première publication</span>
              </dt>
              <dd>
                {publishedDate ? (
                  <time dateTime={book.publishedDate}>{publishedDate}</time>
                ) : (
                  'Date inconnue'
                )}
              </dd>
            </div>
            <div>
              <dt>
                <span className="material-symbols-outlined" aria-hidden="true"> translate </span>
                <span className={styles.visuallyHidden}>Langue originale</span>
              </dt>
              <dd>{language ?? 'Langue inconnue'}</dd>
            </div>
            {book.genre && (
              <div>
                <dt>
                  <span className="material-symbols-outlined" aria-hidden="true"> auto_stories </span>
                  <span className={styles.visuallyHidden}>Genre</span>
                </dt>
                <dd>{book.genre}</dd>
              </div>
            )}
          </dl>

          <section className={styles.bookSummary} id="resume">
            <h2 className={styles.visuallyHidden}>Présentation du livre</h2>
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
            ) : (
              <p>Aucun résumé disponible pour ce livre.</p>
            )}
          </section>
        </div>
      </article>
    </main>
  )
}