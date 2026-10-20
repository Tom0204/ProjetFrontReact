import { useContext } from 'react'
import { Link, NavLink } from 'react-router'
import { FavoritesContext } from '../../contexts/FavoritesContext.js'
import styles from './Header.module.css'

export default function Header() {
  const { favoriteIds } = useContext(FavoritesContext)

  return (
    <header className={styles.header}>
      <nav>
        <ul>
          <li>
            {}
            <NavLink to="/" end>
              Bibliothèque
            </NavLink>
          </li>
          <li>
            <Link to="/">Contact</Link>
          </li>
          <li className={styles.favorites}>Favoris : {favoriteIds.length}</li>
        </ul>
      </nav>
    </header>
  )
}