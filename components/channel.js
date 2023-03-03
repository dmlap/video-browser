import useSWR from 'swr'
import sanitizeHtml from 'sanitize-html'

import Carousel from './carousel'
import Error from './error'
import Loading from './loading'
import parseChannel from '../src/channel'
import { useFavoritesStorage } from '../src/storage'

import styles from '../styles/Channel.module.css'

const textFetcher = (...args) => fetch(...args).then((response) => response.text())

export default function Channel ({ feedUrl }) {
  const favoritesStorage = useFavoritesStorage()

  const subscribed = !!favoritesStorage.get().find((channel) => {
    return channel.feedUrl === feedUrl
  })

  // load the channel info from the RSS feed
  const { data, error } = useSWR(() => {
    if (!feedUrl) {
      // feedUrl will not be available during static page
      // generation
      // signal that the request should be retried by returning
      // false
      return false
    }

    if (!window) {
      // DOMParser is not available in node.js so don't bother
      // fetching the data
      return false
    }

    return feedUrl
  }, textFetcher)

  if (!feedUrl) {
    return <Loading />
  }

  if (error) {
    console.error(error)
    return <Error message={error.message} />
  }

  if (!data) {
    return <Loading />
  }

  const channel = parseChannel(feedUrl, data)

  function toggleSubscription (event) {
    if (event.target.checked) {
      // subscribe
      favoritesStorage.set(favoritesStorage.get().concat(channel))
    } else {
      // unsubscribe
      favoritesStorage.set(
        favoritesStorage.get().filter((channel) => {
          return channel.feedUrl !== feedUrl
        })
      )
    }
  }

  const safeDescription = sanitizeHtml(channel.description, { allowedTags: [] })

  return (
    <>
      <section className={styles.overview}>
        <div className={styles.detail}>
          <header className={styles.header}>
            <h1>{channel.title}</h1>
            <p>{channel.category}</p>
          </header>

          <p className={styles.description}>{safeDescription}</p>

          <label className={styles.subscribe}>
            <input
              onChange={toggleSubscription}
              checked={subscribed}
              type='checkbox'
            />
            Subscribe
          </label>
        </div>
      </section>

      <section className={styles.list}>
        <h2>Episodes</h2>
        <Carousel videos={channel.videos} />
      </section>
    </>
  )
}
