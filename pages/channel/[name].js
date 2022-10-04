import useSWR from 'swr'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import RelLink from '../../components/rel-link.js'
import Error from '../../components/error'
import { OFFLINE } from '../../env'
import nameToPathPart from '../../src/name-to-path-part'
import itemToVideo from '../../src/item-to-video'

import styles from '../../styles/Channel.module.css'

const textFetcher =
      (...args) => fetch(...args).then((response) => response.text())

const itunesNS = 'http://www.itunes.com/dtds/podcast-1.0.dtd'
function parseChannel (feedXml) {
  const dom = new DOMParser().parseFromString(feedXml, 'application/xml')
  const channel = dom.querySelector('channel')
  const result = {
    title: dom.querySelector('channel > title').textContent,
    description: dom.querySelector('channel > description').textContent,
    image: channel.getElementsByTagNameNS(itunesNS, 'image')[0].attributes.href.textContent,
    category: channel.getElementsByTagNameNS(itunesNS, 'category')[0].attributes.text.textContent,
    videos: []
  }


  Array.from(channel.children).forEach((child) => {
    if (child.nodeName !== 'item') {
      return
    }
    const video = itemToVideo(child)
    if (video) {
      result.videos.push(video)
    }
  })

  return result
}

export default function Channel () {
  const router = useRouter()
  const { name, feedUrl } = router.query
  const [loaded, setLoaded] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  // load subscription state from localStorage
  useEffect(() => {
    setSubscribed(!!localStorage.getItem(feedUrl))
    setLoaded(true)
  }, [feedUrl])

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
    return (<div>Loading...</div>)
  }

  if (error) {
    console.error(error)
    return (<Error message={error.message} />)
  }

  if (!data) {
    return (<div>Loading...</div>)
  }

  const channel = parseChannel(data)

  function toggleSubscription (event) {
    event.preventDefault()

    if (subscribed) {
      localStorage.removeItem(feedUrl)
    } else {
      localStorage.setItem(feedUrl, JSON.stringify(channel))
    }
    setSubscribed(!subscribed)
  }

  return (<main>
            <section className={styles.overview}>
            <div className={styles.detail}>
              <header className={styles.header}>
                <h1>{channel.title}</h1>
                <p>{channel.category}</p>
              </header>

              <p className={styles.description}>{channel.description}</p>
              <form className={styles.subscribe} onSubmit={toggleSubscription}>
              { loaded &&
                (<button type="submit">{ subscribed ? 'Unsubscribe' : 'Subscribe'}</button>)
              }
              </form>
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
              <ol className={styles.videos}>
              {
                channel.videos.map((video, ix) => {
                  return (<li key={ix} className={styles.videoItem}>
                          <RelLink href={
                            `/channel/${name}/${nameToPathPart(video.title)}`
                              + `?feedUrl=${feedUrl}&id=${video.id}`
                          }>
                            <img src={video.poster}
                                 alt="video artwork" />
                            {video.title}
                          </RelLink>
                          </li>)
                })
              }
              </ol>
            </section>
          </main>)
}
