import { useState } from 'react'
import { useRouter } from 'next/router'

export default function SearchForm (attributes) {
  const [query, setQuery] = useState(attributes.query)
  const router = useRouter()

  function handleChange (event) {
    setQuery(event.target.value)
  }

  function search () {
    event.preventDefault()
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (<form onSubmit={search}>
            <label>
              Search:
              <input type="text" onChange={handleChange} value={query} />
            </label>
          </form>)
}
