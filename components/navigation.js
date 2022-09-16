import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import uniqueId from '../src/uniqueId'

import styles from '../styles/Navigation.module.css'

export default function Navigation (attributes) {
  const [id, setId] = useState()
  const [query, setQuery] = useState(attributes.query || '')
  const router = useRouter()

  useEffect(() => {
    setId(uniqueId('search-form-input-'))
  }, [])

  function handleBack () {
    window.history.back()
  }
  function handleForward () {
    window.history.forward()
  }

  function handleChange (event) {
    setQuery(event.target.value)
  }

  function search () {
    event.preventDefault()
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (<nav className={(attributes.className ? attributes.className + ' ' : '') + styles.nav}>
            <a className={styles.back} onClick={handleBack}>Back</a>
            <form className={styles.form} onSubmit={search}>
              <label htmlFor={id} className={styles.label}>
                Search:
              </label>
              <input id={id}
                     className={styles.input}
                     type="text"
                     onChange={handleChange}
                     value={query} />
            </form>
          </nav>)
}
