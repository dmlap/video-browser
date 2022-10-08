import useSWR from 'swr'

import { useRouter } from 'next/router'
import Link from 'next/link'

import Error from '../components/error'
import styles from '../styles/Search.module.css'

import nameToPathPart from '../src/name-to-path-part'
import { OFFLINE } from '../env'

const SEARCH_URL = (() => {
  // use a mock API for offline testing based on environment variables
  const SEARCH_DOMAIN = OFFLINE ? '' : 'https://itunes.apple.com'

  return SEARCH_DOMAIN + '/search'
})()

export default function Search() {
  const router = useRouter()
  const { q } = router.query

  const { data, error } = useSWR(`${SEARCH_URL}?term=${q}&entity=podcast&explicit=No`, (url) => {
    return fetch(url + `&n=${Math.round(Math.random() * 9e8)}`).then((response) => response.json())
  })

  if (error) {
    console.error(error)
    return (<Error message={error.message} />)
  }
  if (!data) {
    return (<div>Loading...</div>)
  }

  if (data.resultCount === 0) {
    return (<div>No results</div>)
  }

  const results = data.results.map((result) => {
    const uriCollectionName =
          encodeURIComponent(nameToPathPart(result.collectionCensoredName))
    const channelUrl = `/channel/${uriCollectionName}?feedUrl=${result.feedUrl}`

    return (<li key={result.collectionId} className={styles.channelItem}>
            <Link href={channelUrl}>
              <img className={styles.artwork}
                   src={result.artworkUrl600}
                   alt={result.collectionCensoredName} />
            </Link>
            <div className={styles.channelDetail}>
              <h2><Link href={channelUrl}>{result.collectionCensoredName}</Link></h2>
              <address className="author">{result.artistName}</address>
            </div>
            </li>)
  })
  return (<main>
            <ol className={styles.channelList}>
              {results}
            </ol>
          </main>)
}
