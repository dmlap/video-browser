import useSWR from 'swr'
import sanitizeHtml from 'sanitize-html'

import {
  useId, useEffect, useRef, forwardRef, useImperativeHandle, useState
} from 'react'
import Script from 'next/script'

import Error from '../components/error'
import parseChannel from '../src/channel'
import { useRecentsStorage } from '../src/storage'

import styles from '../styles/Video.module.css'

const textFetcher =
      (...args) => fetch(...args).then((response) => response.text())

function findVideo (channel, id) {
  for (const video of channel.videos) {
    if (video.id === id) {
      return video
    }
  }
}

/**
 * Generic video player component that determines whether to use HTML
 * video or a third-party implementation.
 */
function Player (props, ref) {
  if ((/^https?:\/\/www\.youtube.com/ig).test(props.video.channelDetail.feedUrl)) {
    return (<YTPlayer ref={ref} {...props} />)
  } else {
    return (<HTMLPlayer ref={ref} {...props} />)
  }
}
Player = forwardRef(Player)

/**
 * HTML Video Element video player component.
 */
function HTMLPlayer ({ onEnded, onPlay, onPause, onReady, video }, ref) {
  const videoRef = useRef()

  useImperativeHandle(ref, () => ({
    play() {
      return videoRef.current.play()
    },
    paused() {
      return videoRef.current.paused
    },
    ended() {
      return videoRef.current.ended
    }
  }), [videoRef])

  useEffect(() => {
    // the video element is ready for interaction immediately after
    // being rendered
    onReady()
  }, [])

  return (<video controls
                 className={styles.video}
                 ref={videoRef}
                 onPlay={onPlay}
                 onPause={onPause}
                 onEnded={onEnded}>
          {
            video.sources.map((source) => {
              return (<source key={source.src} src={source.src} type={source.type} />)
            })
          }
          </video>)
}
HTMLPlayer = forwardRef(HTMLPlayer)

/**
 * YouTube IFrame API-based video player component.
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
function YTPlayer (props, ref) {
  const playerRef = useRef()
  const id = useId()
  const [error, setError] = useState(0)
  const { video } = props

  useImperativeHandle(ref, () => {
    return {
      play() {
        return playerRef.current.playVideo()
      },
      paused() {
        const state = playerRef.current.getPlayerState()
        return state < 1 || state === 2 || state === 5
      },
      ended() {
        return playerRef.current.getPlayerState() === 0
      }
    }
  }, [id, playerRef])

  function setupAPI (id, playerRef) {
    const player = new YT.Player(id, {
      // see https://developers.google.com/youtube/iframe_api_reference#Events
      events: {
        onReady () {
          playerRef.current = player
          props.onReady()
        },
        onStateChange (event) {
          switch (event.data) {
          case 0: // ended
            props.onEnded(event)
            break
          case 1: // playing
            props.onPlay(event)
            break
          case 2: // paused
            props.onPause(event)
            break;
          }
        },
        onError (event) {
          setError(event.data)
        }
      }
    })
  }

  useEffect(() => {
    // track the API status ourselves because there doesn't seem to be
    // an officially documented way of checking whether the iframe API
    // is ready

    if (window.__youTubeIframeAPISetup) {
      // reusing YT API to setup a player
      setupAPI(id, playerRef)
    } else {
      // setup the player as soon as the YT iframe API is ready
      window.onYouTubeIframeAPIReady = function () {
        window.onYouTubeIframeAPIReady = null
        window.__youTubeIframeAPISetup = true
        setupAPI(id, playerRef)
      }
    }

    return () => {
      // cleanup the global callback if this component is being
      // unmounted
      window.onYouTubeIframeAPIReady = null
    }
  }, [id, playerRef])

  if (error > 0) {
    return (<div>Aw, shucks... it broke. YouTube error code: {error}</div>)
  }

  return (<>
          <Script src="https://www.youtube.com/iframe_api"></Script>
          <iframe id={id}
                  className={styles.video}
                  type="text/html"
                  src={`https://www.youtube-nocookie.com/embed/${video.id.slice(9)}?enablejsapi=1`}
                  frameBorder="0">
          </iframe>
          </>)
}
YTPlayer = forwardRef(YTPlayer)

export default function Video (props) {
  const { video } = props
  const { channelDetail: { feedUrl }, id } = video
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)

  const playerRef = useRef()
  const recents = useRecentsStorage()
  const componentId = useId()

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

  const channel = parseChannel(feedUrl, data)
  const videoData = findVideo(channel, id)

  const mostRecent = recents.get().slice(-1)
  if (mostRecent.length < 1 || mostRecent[0].id !== id) {
    recents.set(recents.get().concat(videoData))
  }

  function playVideo (event) {
    playerRef.current.play()
    setPlaying(true)
    setStarted(true)
  }
  function handlePlaybackChange (event) {
    const currentPlaying = !playerRef.current.paused() && !playerRef.current.ended()
    setPlaying(currentPlaying)
  }
  function handleReady () {
    setReady(true)
  }
  function handleBack () {
    window.history.back()
  }

  const safeDescription = sanitizeHtml(videoData.description, { allowedTags: []})

  return (<main className={
    [[true, styles.main], [playing, styles.playing], [started, styles.started]].reduce((acc, [include, style]) => {
      if (include) {
        return acc.concat(style)
      }
      return acc
    }, []).join(' ')
  }
                style={ started ? {} : {
                  backgroundImage: `radial-gradient(transparent, #0c0c0c 70%), url(${videoData.poster})`
                }}>
            <Player video={videoData}
                    ref={playerRef}
                    onPlay={handlePlaybackChange}
                    onPause={handlePlaybackChange}
                    onEnded={handlePlaybackChange}
                    onReady={handleReady} />
            <div className={styles.overview}>
              <a className={styles.back} href="" onClick={handleBack}>&lt;</a>
              <h1 className={styles.title}>{videoData.title}</h1>
              { videoData.description &&
                (<p className={styles.description}>{safeDescription}</p>)
              }
              <button onClick={playVideo}
                      className={styles.playButton}
                      disabled={!ready}>
                Play
              </button>
            </div>
          </main>)
}

Video.getLayout = function (page) {
  return (<>{page}</>)
}
