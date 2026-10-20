import { Link } from 'react-router'
import fallbackCover from '../../assets/moby-dick.png'
import { getYear } from '../../utils/format.js'
import styles from './BookCard.module.css'

export default function BookCard({ book }) {
  const authors =
    book.authors.length > 0 ? book.authors.join(', ') : 'Auteur inconnu'
  const year = getYear(book.publishedDate)

  return (
    <Link className={styles.bookCard} to={`/books/${encodeURIComponent(book.id)}`}>
      <img className={styles.bookCover} src={book.cover ?? fallbackCover} alt="" />
      <div className={styles.bookContent}>
        <h3 className={styles.bookTitle}>{book.title}</h3>
        <p className={styles.bookMeta}>
          <span className={styles.bookAuthor}>{authors}</span>
          {year && <time dateTime={book.publishedDate}>{year}</time>}
        </p>
      </div>
    </Link>
  )
}
