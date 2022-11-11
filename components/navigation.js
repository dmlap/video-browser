import { useEffect, useState } from 'react'

import VLink from './vlink'
import { useRouter } from './vlink'

import uniqueId from '../src/uniqueId'

import styles from '../styles/Navigation.module.css'

// feature-detection for Enter handling in forms
// this is a one-time toggle so it's intentionally outside the react
// lifecycle
let emitsKeyPressOnEnter = false

export default function Navigation (attributes) {
  const [id, setId] = useState()
  const [query, setQuery] = useState(attributes.query || '')
  const router = useRouter()

  useEffect(() => {
    setId(uniqueId('search-form-input-'))
  }, [])

  function handleBack () {
    router.back()
  }

  function handleChange (event) {
    setQuery(event.target.value)
  }

  function handleKeyPress (event) {
    if (!emitsKeyPressOnEnter && event.code === 'Enter') {
      // keypress event for the Enter key is firing normally so
      // disable emulation
      emitsKeyPressOnEnter = true
      // this event was already emulated on keydown so short-circuit
      // normal handling this time
      // subsequent events will not be emulated
      event.preventDefault()
    }
  }
  function handleKeyDown (event) {
    if (emitsKeyPressOnEnter || event.code !== 'Enter') {
      return
    }

    // WebOS circa 2022 does not generate a keypress event for Enter
    // on the virtual keyboard, or trigger form submission for single
    // input forms. Trigger form submission on keydown for Enter until
    // we see the correct behavior
    return search({ preventDefault: () => {} })
  }

  function search (event) {
    event.preventDefault()

    if (query) {
      router.push({ path: 'search', pageProps: { query } })
    }
  }

  return (<nav className={(attributes.className ? attributes.className + ' ' : '') + styles.nav}>
          <button className={styles.back} onClick={handleBack}>&lt;</button>
            <form className={styles.form} onSubmit={search}>
              <label htmlFor={id} className={styles.label}>
                Search:
              </label>
              <input id={id}
                     className={styles.input}
                     type="text"
                     onChange={handleChange}
                     onKeyDown={handleKeyDown}
                     onKeyPress={handleKeyPress}
                     value={query} />
            </form>
            <VLink path="home" className={styles.home}>Home</VLink>
          </nav>)
}
