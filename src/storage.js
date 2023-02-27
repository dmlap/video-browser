import { useEffect, useState } from 'react'

const EMPTY = Object.freeze([])

/**
 * Accepts a key String and returns a storage object to persist and
 * retrieve data. Objects are stored in localStorage and will persist
 * beyond the page load or browsing session.
 */
function useStorage (key) {
  const [ready, setReady] = useState(false)
  const [values, setValues] = useState(EMPTY)

  useEffect(() => {
    const json = localStorage.getItem(key)

    setReady(true)
    if (json) {
      try {
        const values = Object.freeze(JSON.parse(json))
        setValues(values)
        return
      } catch (error) {
        // log an error and then fall through to the empty storage
        // case
        console.log('Error retrieving from localStorage', error, json)
      }
    }

    localStorage.setItem(key, '[]')
    setValues(EMPTY)
  }, [key])

  return {
    get: () => {
      return values
    },

    ready,

    set: (newValues) => {
      const frozen = Object.freeze(Array.from(newValues))
      localStorage.setItem(key, JSON.stringify(frozen))
      setValues(frozen)
    }
  }
}

function useFavoritesStorage () {
  return useStorage('favorites')
}

function useRecentsStorage () {
  return useStorage('recents')
}

export { useFavoritesStorage, useRecentsStorage }
