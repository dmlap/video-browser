import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import RelLink from './rel-link'

import { relative } from '../src/path'
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

  function handleChange (event) {
    setQuery(event.target.value)
  }

  function search () {
    event.preventDefault()
    if (query) {
      const path = relative(router.pathname, `/search?q=${encodeURIComponent(query)}`)
      // NextJS uses domain-relative URLs internally to look up
      // resources. If `window.history` is given a domain-relative URL
      // when running off the file:// protocol, that's interpreted as
      // being relative to the root of the filesystem - probably not
      // the intended behavior. Use the `as` argument to ensure
      // `window.history` gets set with the full path, even when
      // running off the filesystem, so that subsequent URLs are
      // resolved from the right base path.
      const a = document.createElement('a')
      a.href = path
      router.push(path, a.href)
    }
  }

  return (<nav className={(attributes.className ? attributes.className + ' ' : '') + styles.nav}>
          <a className={styles.back} onClick={handleBack}>&lt;</a>
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
            <RelLink href="/" className={styles.home}>Home</RelLink>
          </nav>)
}
