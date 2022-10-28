import useSWR from 'swr'

import { createRef, useState } from 'react'

import Error from '../components/error'
import itemToVideo from '../src/item-to-video'
import { useRecentsStorage } from '../src/storage'

import styles from '../styles/Video.module.css'

const textFetcher =
      (...args) => fetch(...args).then((response) => response.text())

function findItemEl (feedDom, id) {
  const guids = feedDom.querySelectorAll('item > guid')
  for (const guid of guids) {
    if (guid.textContent === id) {
      return guid.parentElement
    }
  }

  const enclosures = feedDom.querySelectorAll('item > enclosure')
  for (const enclosure of enclosures) {
    if (enclosure.src === id) {
      return enclosure.parentElement
    }
  }

  throw new Error(`Failed to find item element associated with id "${id}"`)
}

function parseVideo (channelDetail, feedXml, id) {
  const dom = new DOMParser().parseFromString(feedXml, 'application/xml')
  const item = findItemEl(dom, id)

  return itemToVideo(item, channelDetail)
}


export default function Video ({ video }) {
  const { name, title, channelDetail: { feedUrl }, id } = video
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const videoRef = createRef()
  const recents = useRecentsStorage()

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
    return (<div>Loading data...</div>)
  }

  if (!recents.ready) {
    return (<div>Loading recents...</div>)
  }

  function playVideo (event) {
    videoRef.current.play()
    setPlaying(true)
    setStarted(true)
  }
  function handlePlaybackChange (event) {
    setPlaying(!videoRef.current.paused && !videoRef.current.ended)
  }
  function handleBack () {
    window.history.back()
  }

  const videoData = parseVideo({ name, title, feedUrl }, data, id)

  const mostRecent = recents.get().slice(-1)
  if (mostRecent.length < 1 || mostRecent[0].id !== id) {
    recents.set(recents.get().concat(videoData))
  }

  return (<main className={styles.main + (playing ? ' ' + styles.playing : '') + (started ? ' ' + styles.started : '')}
                style={ started ? {} : {
                  backgroundImage: `radial-gradient(transparent, #0c0c0c 70%), url(${videoData.poster})`
                }}>
            <video controls
                   className={styles.video}
                   ref={videoRef}
                   onPlay={handlePlaybackChange}
                   onPause={handlePlaybackChange}
                   onEnded={handlePlaybackChange}>
            {
              videoData.sources.map((source) => {
                return (<source key={source.src} src={source.src} type={source.type} />)
              })
            }
            </video>
            <div className={styles.overview}>
              <a className={styles.back} onClick={handleBack}>&lt;</a>
              <h1 className={styles.title}>{videoData.title}</h1>
              { videoData.description && (<p>{videoData.description}</p>) }
              <button onClick={playVideo} className={styles.playButton}>Play</button>
            </div>
          </main>)
}

Video.getLayout = function (page) {
  return (<>{page}</>)
}
