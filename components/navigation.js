import { useEffect, useState, useId, useMemo } from 'react'
import debounce from 'lodash/debounce'

import VLink from './vlink'
import { useRouter } from './vlink'

import styles from '../styles/Navigation.module.css'

export default function Navigation (attributes) {
  const [query, setQuery] = useState(attributes.query || '')
  const router = useRouter()
  const id = useId()

  function search (query) {
    if (query) {
      router.push({ path: 'search', pageProps: { query } })
    }
  }
  const debouncedSearch = useMemo(() => debounce(search, 750), [])

  function handleBack () {
    router.back()
  }

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

  return (<nav className={(attributes.className ? attributes.className + ' ' : '') + styles.nav}>
          <button className={styles.back} onClick={handleBack}>&lt;</button>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label htmlFor={id} className={styles.label}>
                Search:
              </label>
              <input id={id}
                     className={styles.input}
                     type="text"
                     onChange={handleChange}
                     onKeyUp={handleKeyUp}
                     value={query} />
            </form>
            <VLink path="home" className={styles.home}>Home</VLink>
          </nav>)
}
