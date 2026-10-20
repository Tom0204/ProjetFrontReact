import { useState } from 'react'
import { FavoritesContext } from './FavoritesContext.js'

export default function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([])

  function toggleFavorite(id) {
    setFavoriteIds((previous) =>
      previous.includes(id)
        ? previous.filter((favoriteId) => favoriteId !== id)
        : [...previous, id],
    )
  }

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}