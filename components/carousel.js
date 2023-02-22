import VLink from './vlink'
import Video from './video'
import { useDNav } from './dnav'

import styles from '../styles/Carousel.module.css'

function handleFocusFor(ref, items) {
  return function handleFocus (event) {
    if (!ref.current || items.length < 1) {
      return
    }

    // overriding the scroll position during a focus event is ignored
    // (by Safari, at least)
    // wait until the next frame to apply the change
    requestAnimationFrame(() => {
      // bring the left edge of the focused list item to the left edge
      // of the carousel
      const targetLeft = event.target.getBoundingClientRect().left
      const carouselLeft = ref.current.getBoundingClientRect().left
      ref.current.scrollLeft += targetLeft - carouselLeft
    })
  }
}

export function ChannelCarousel ({ channels }) {
  const ref = useDNav()

  return (<ol className={styles.channels}
              onFocus={handleFocusFor(ref, channels)}
              ref={ref}>
          {
            channels.map((channel, ix) => {
              return (<li key={ix} className={styles.item}>
                        <VLink className={styles.link} path="channel" feedUrl={channel.feedUrl}>
                          <picture>
                            { channel.image && <source srcSet={channel.image} /> }
                            <source srcSet="gray.gif" />
                            <img src="gray0.png" alt="channel artwork" />
                          </picture>
                          {channel.title}
                        </VLink>
                      </li>)
            })
          }
          </ol>)
}

export default function Carousel ({ videos }) {
  const ref = useDNav()

  return (<ol className={styles.videos}
              onFocus={handleFocusFor(ref, videos)}
              ref={ref}>
              {
                videos.map((video, ix) => {
                  return (<li key={ix} className={styles.item}>
                          <VLink className={styles.link} path="video" video={video}>
                            <picture>
                              { video.poster && <source srcSet={video.poster} /> }
                              <source srcSet="gray.gif" />
                              <img src="gray0.png" alt="video artwork" />
                            </picture>
                            {video.title}
                          </VLink>
                          </li>)
                })
              }
          </ol>)
}
