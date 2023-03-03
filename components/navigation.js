import { useState, useId, useMemo } from 'react'
import debounce from 'lodash/debounce'

import VLink, { useRouter } from './vlink'

import styles from '../styles/Navigation.module.css'
import { useWizardStorage } from '../src/storage'

const SEARCH_PATHS = ['youtube', 'podcasts', 'home']

export default function Navigation (attributes) {
  const category = useWizardStorage().get()?.category
  const router = useRouter()

  const [query, setQuery] = useState(router.state.pageProps?.query || category || '')

  const id = useId()

  console.log(router.state)

  function search (query) {
    if (query) {
      const routerPath = router.state.path
      const path = SEARCH_PATHS.includes(router.state.path) ? routerPath : 'home'

      router.push({ path, pageProps: { query }, query })
    }
  }

  const debouncedSearch = useMemo(() => debounce(search, 750), [router.state.path])

  function handleChange (event) {
    setQuery(event.target.value)

    if (attributes.instantSearch) {
      debouncedSearch(event.target.value)
    }
  }
  function handleKeyUp (event) {
    if (event.code === 'Enter') {
      return search(query)
    }
  }
  function handleSubmit (event) {
    event.preventDefault()
    return search(query)
  }

  return (
    <nav className={(attributes.className ? attributes.className + ' ' : '') + styles.nav}>
      <ul className={styles.items}>
        <li className={styles.item}><VLink path='home' query={query} className={styles.home}>Home</VLink></li>
        <li className={styles.item}><VLink path='watchlist' query={query} className={styles.home}>Watchlist</VLink></li>
        <li className={styles.item}><VLink path='youtube' query={query} className={styles.home}>YouTube</VLink></li>
        <li className={styles.item}><VLink path='podcasts' query={query} className={styles.home}>Podcasts</VLink></li>
      </ul>
      <img className={styles.logo} width='80' height='80' src='logo-black.svg' alt='logo' />
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor={id} className={styles.label}>
          Search:
        </label>
        <input
          id={id}
          className={styles.input}
          type='text'
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          value={query}
        />
      </form>
    </nav>
  )
}
