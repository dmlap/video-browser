import { useState, useId, useMemo } from 'react'
import debounce from 'lodash/debounce'

import VLink, { useRouter } from './vlink'

import styles from '../styles/Navigation.module.css'

export default function Navigation (attributes) {
  const [query, setQuery] = useState(attributes.query || '')
  const router = useRouter()
  const id = useId()
  // const wizardData = useWizardStorage()

  function search (query) {
    if (query) {
      router.push({ path: 'home', pageProps: { query } })
    }
  }
  const debouncedSearch = useMemo(() => debounce(search, 750), [])

  // function handleBack () {
  //   if (router.state.path === 'home') {
  //     wizardData.set({})
  //     router.reload()
  //   }
  //   router.back()
  // }

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
        <li className={styles.item}><VLink path='home' className={styles.home}>Home</VLink></li>
        <li className={styles.item}><VLink path='watchlist' className={styles.home}>Watchlist</VLink></li>
        <li className={styles.item}><VLink path='youtube' className={styles.home}>YouTube</VLink></li>
        <li className={styles.item}><VLink path='podcasts' className={styles.home}>Podcasts</VLink></li>
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
