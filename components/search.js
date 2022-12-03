import useSWR from 'swr'

import VLink from './vlink'
import Channel from './channel'
import Error from './error'
import Loading from './loading'
import parseChannel from '../src/channel'
import styles from '../styles/Search.module.css'

import { OFFLINE } from '../env'

const SEARCH_URL = (() => {
  // use a mock API for offline testing based on environment variables
  const SEARCH_DOMAIN = OFFLINE ? '' : 'https://itunes.apple.com'

  return SEARCH_DOMAIN + '/search'
})()

/**
 * "Polyfill" for
 * [Promise.allSettled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)
 * which is not available until Chrome 76.
 */
function allSettled(promises) {
  if (promises.length < 1) {
    return Promise.resolve([])
  }

  const results = []
  let done = Promise.resolve()
  for (const promise of promises) {
    const caughtPromise = promise.catch((error) => {
      return { status: 'error', error }
    })
    caughtPromise.then((result) => {
      results.push(result)
    })
    done = done.then(() => caughtPromise).catch(() => caughtPromise)
  }

  done = done.then(() => {
    return results
  })
  return done
}

export default function Search({ query }) {
  const { data, error } = useSWR(`${SEARCH_URL}?term=${query}&entity=podcast&explicit=No`, (url) => {
    // fetch results from iTunes' search APi
    return fetch(url + `&n=${Math.round(Math.random() * 9e8)}`)
      .then((response) => { return response.json() })
      .then((json) => {
        return allSettled(json.results.map((result) => {
          // fetch the feedUrl
          const fetchAndParseChannel = fetch(result.feedUrl)
                .then((response) => response.text())
                .then((feedXml) => {
                  return {
                    status: 'resolved',
                    result: result,
                    channel: parseChannel(result.feedUrl, feedXml)
                  }
                })
          // abandon the request after 2 seconds
          return Promise.race([
            fetchAndParseChannel,
            new Promise((resolve, reject) => {
              setTimeout(reject.bind(null, { status: 'timeout' }), 2000)
            })
          ])
        }))
      }).then((channelRequests) => {
        return {
          results: channelRequests.reduce((results, channelRequest) => {
            // make sure the feed was accessible and contained at least one video
            if (channelRequest.status === 'resolved'
                && channelRequest.channel.videos
                && channelRequest.channel.videos.length > 0) {
              return results.concat(channelRequest.result)
            }

            return results
          }, [])
        }
      })
  })

  if (error) {
    console.error(error)
    return (<Error message={error.message} />)
  }
  if (!data) {
    return (<Loading />)
  }

  if (!data.results || data.results.length === 0) {
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
              <h2>
                <VLink path="channel" feedUrl={result.feedUrl}>
                  {result.collectionCensoredName}
                </VLink>
              </h2>
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
