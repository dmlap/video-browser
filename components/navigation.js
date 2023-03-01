import { useState, useId, useMemo } from 'react'
import debounce from 'lodash/debounce'

import VLink, { useRouter } from './vlink'

import { useWizardStorage } from '../src/storage'
import styles from '../styles/Navigation.module.css'

export default function Navigation (attributes) {
  const [query, setQuery] = useState(attributes.query || '')
  const router = useRouter()
  const id = useId()
  const wizardData = useWizardStorage()

  function search (query) {
    if (query) {
      router.push({ path: 'home', pageProps: { query } })
    }
  }
  const debouncedSearch = useMemo(() => debounce(search, 750), [])

  function handleBack () {
    if (router.state.path === 'home') {
      wizardData.set({})
      router.reload()
    }
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

  return (
    <nav className={(attributes.className ? attributes.className + ' ' : '') + styles.nav}>
      <button className={styles.back} onClick={handleBack}>
        {router.state.path === 'home' ? 'Choose Category' : <>&lt;</>}
      </button>
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
      {router.state.path !== 'home' && (
        <VLink path='home' className={styles.home}>
          Home
        </VLink>)}
    </nav>
  )
}
