import useSWR from 'swr'

import VLink from './vlink'
import Channel from './channel'
import Error from './error'
import Loading from './loading'
import styles from '../styles/Search.module.css'

import { OFFLINE } from '../env'

const SEARCH_URL = (() => {
  // use a mock API for offline testing based on environment variables
  const SEARCH_DOMAIN = OFFLINE ? '' : 'https://itunes.apple.com'

  return SEARCH_DOMAIN + '/search'
})()

export default function Search({ query }) {
  const { data, error } = useSWR(`${SEARCH_URL}?term=${query}&entity=podcast&explicit=No`, (url) => {
    return fetch(url + `&n=${Math.round(Math.random() * 9e8)}`).then((response) => response.json())
  })

  if (error) {
    console.error(error)
    return (<Error message={error.message} />)
  }
  if (!data) {
    return (<Loading />)
  }

  if (data.resultCount === 0) {
    return (<div>No results</div>)
  }

  const results = data.results.map((result) => {
    return (<li key={result.collectionId} className={styles.channelItem}>
            <VLink path="channel" feedUrl={result.feedUrl}>
              <img className={styles.artwork}
                   src={result.artworkUrl600}
                   alt={result.collectionCensoredName} />
            </VLink>
            <div className={styles.channelDetail}>
              <h2><VLink path="channel" feedUrl={result.feedUrl}>{result.collectionCensoredName}</VLink></h2>
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
