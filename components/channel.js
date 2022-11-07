import useSWR from 'swr'

import { useEffect, useState } from 'react'

import Carousel from './carousel'
import Error from './error'
import Loading from './loading'
import { OFFLINE } from '../env'
import itemToVideo from '../src/item-to-video'
import { useFavoritesStorage } from '../src/storage'

import styles from '../styles/Channel.module.css'

const textFetcher =
      (...args) => fetch(...args).then((response) => response.text())

const itunesNS = 'http://www.itunes.com/dtds/podcast-1.0.dtd'
function parseChannel (feedUrl, feedXml) {
  const dom = new DOMParser().parseFromString(feedXml, 'application/xml')
  const channel = dom.querySelector('channel')
  const result = {
    feedUrl,
    title: dom.querySelector('channel > title').textContent,
    description: dom.querySelector('channel > description').textContent,
    image: channel.getElementsByTagNameNS(itunesNS, 'image')[0].attributes.href.textContent,
    category: channel.getElementsByTagNameNS(itunesNS, 'category')[0].attributes.text.textContent,
  }
  // keep videos from having cycling references to each other by
  // splitting off channel details
  // might be overkill but makes it less likely for mutations to
  // propagate in weird ways
  const channelDetail = Object.assign({}, result)
  result.videos = []

  Array.from(channel.children).forEach((child) => {
    if (child.nodeName !== 'item') {
      return
    }

    if (!child.querySelector('enclosure[type^=video]')) {
      // filter out non-video episodes
      return
    }
    const video = itemToVideo(child, channelDetail)
    if (video) {
      result.videos.push(video)
    }
  })

  return result
}

export default function Channel ({ feedUrl }) {
  const favoritesStorage = useFavoritesStorage()

  const subscribed =!!favoritesStorage.get().find((channel) => {
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
    return (<Loading />)
  }

  if (error) {
    console.error(error)
    return (<Error message={error.message} />)
  }

  if (!data) {
    return (<Loading />)
  }

  const channel = parseChannel(feedUrl, data)

  function toggleSubscription (event) {
    if (event.target.checked) {
      // subscribe
      favoritesStorage.set(favoritesStorage.get().concat(channel))
    } else {
      // unsubscribe
      favoritesStorage.set(favoritesStorage.get().filter((channel) => {
        return channel.feedUrl !== feedUrl
      }))
    }
  }

  return (<main>
            <section className={styles.overview}>
            <div className={styles.detail}>
              <header className={styles.header}>
                <h1>{channel.title}</h1>
                <p>{channel.category}</p>
              </header>

              <p className={styles.description}>{channel.description}</p>

              <label className={styles.subscribe}>
                <input onChange={toggleSubscription}
                       checked={subscribed}
                       type="checkbox" />
                Subscribe
              </label>
            </div>

            <div className={styles.player}>
              <video className={styles.video} poster={channel.image} controls>
              {
                channel.videos[0] && channel.videos[0].sources.map((source, ix) => {
                  return (<source key={ix} src={source.src} type={source.type} />)
                })
              }
              </video>
            </div>
            </section>

            <section className={styles.list}>
              <h2>Episodes</h2>
              <Carousel videos={channel.videos} />
            </section>
          </main>)
}
