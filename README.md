# Bibliothèque — React + Vite

Application qui recherche des livres avec l'API Google Books et affiche leurs
fiches. Les styles d'origine (modules CSS) sont conservés.

## Lancement

Avec Node.js 22.12+ ou 24+ et npm :

```sh
cd library-react
npm install
cp .env.example .env.local   # puis mettez la clé fournie en cours
npm run dev
```

La clé se lit avec `import.meta.env.VITE_GOOGLE_BOOKS_API_KEY`. Les variables
`VITE_` sont visibles dans le navigateur : elles ne cachent aucun secret.
`.env.local` est ignoré par Git : ne le commitez pas.

```sh
npm run lint
npm run build
npm run preview
```

## Architecture

```text
index.html                   Seule entrée HTML (application à page unique)
src/
  main.jsx                   BrowserRouter + FavoritesProvider + App
  App.jsx                    Header, routes (/ et /books/:id), Footer
  api/
    books.js                 searchBooks(query) et getBook(id)
  contexts/
    FavoritesContext.js      createContext
    FavoritesProvider.jsx    État des favoris (en mémoire)
  utils/
    format.js                Dates, langue, résumé, titre
  components/
    BookCard/                Carte d'un livre (lien vers /books/:id)
    Header/                  Navigation et compteur de favoris
    Footer/
  pages/
    Home/                    Recherche (useState, useRef) et liste (useEffect)
    Book/                    Fiche chargée depuis l'URL (useParams, useEffect)
  styles/
    global.css               Variables, reset et styles de base communs
```
