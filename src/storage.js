import { useEffect, useState } from 'react'

const EMPTY = {
  WATCH_HISTORY: Object.freeze([]),
  PREFERENCE: Object.freeze({})
}

/**
 * Accepts a key String and returns a storage object to persist and
 * retrieve data. Objects are stored in localStorage and will persist
 * beyond the page load or browsing session.
 */

function useStorage (key, empty) {
  const [ready, setReady] = useState(false)
  const [values, setValues] = useState(empty)

  useEffect(() => {
    const json = window.localStorage.getItem(key)

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

    window.localStorage.setItem(key, Array.isArray(empty) ? '[]' : '{}')
    setValues(empty)
  }, [key, empty])

  return {
    get: () => {
      return values
    },

    ready,

    set: (newValues) => {
      const frozen = Object.freeze(newValues)
      window.localStorage.setItem(key, JSON.stringify(frozen))
      setValues(frozen)
    }
  }
}

function useFavoritesStorage () {
  return useStorage('favorites', EMPTY.WATCH_HISTORY)
}

function useRecentsStorage () {
  return useStorage('recents', EMPTY.WATCH_HISTORY)
}

function useWizardStorage () {
  return useStorage('preference', EMPTY.PREFERENCE)
}

export { useFavoritesStorage, useRecentsStorage, useWizardStorage }
