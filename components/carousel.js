import VLink from './vlink'
import Video from './video'
import { useDNav } from './dnav'

import styles from '../styles/Carousel.module.css'

const noop = () => {}
function handleFocusFor(ref, items, onFocus = noop) {
  return function handleFocus (event) {
    if (!ref.current || items.length < 1) {
      return
    }

    // lookup the newly active item through the data-index attribute
    const ix = parseInt(event.target.closest('li').dataset.index, 10)
    const item = items[ix]

    // overriding the scroll position during a focus event is ignored
    // (by Safari, at least)
    // wait until the next frame to apply the change
    requestAnimationFrame(() => {
      // bring the left edge of the focused list item to the left edge
      // of the carousel
      const targetLeft = event.target.getBoundingClientRect().left
      const carouselLeft = ref.current.getBoundingClientRect().left
      ref.current.scrollLeft += targetLeft - carouselLeft

      onFocus(item)
    })
  }
}

export function ChannelCarousel ({ channels, onFocus }) {
  const ref = useDNav()

  return (<ol className={styles.channels}
              onFocus={handleFocusFor(ref, channels, onFocus)}
              ref={ref}>
          {
            channels.map((channel, ix) => {
              return (<li key={ix} className={styles.item} data-index={ix}>
                        <VLink className={styles.link} path="channel" feedUrl={channel.feedUrl}>
                          <picture>
                            { channel.image && <source srcSet={channel.image} /> }
                            <source srcSet="gray.gif" />
                            <img src="gray0.png" alt="channel artwork" />
                          </picture>
                          <span className={styles.title}>{channel.title}</span>
                        </VLink>
                      </li>)
            })
          }
          </ol>)
}

export default function Carousel ({ videos, onFocus }) {
  const ref = useDNav()

  return (<ol className={styles.videos}
              onFocus={handleFocusFor(ref, videos, onFocus)}
              ref={ref}>
              {
                videos.map((video, ix) => {
                  return (<li key={ix} className={styles.item} data-index={ix}>
                            <VLink className={styles.link} path="video" video={video}>
                              <picture>
                                { video.poster && <source srcSet={video.poster} /> }
                                <source srcSet="gray.gif" />
                                <img src="gray0.png" alt="video artwork" />
                              </picture>
                              <span className={styles.title}>{video.title}</span>
                            </VLink>
                          </li>)
                })
              }
          </ol>)
}

export function List ({ channels, onFocus }) {
  const ref = useDNav()

  return (<ol className={styles.list}
              onFocus={handleFocusFor(ref, channels, onFocus)}
              ref={ref}>
          {
            channels.map((channel, ix) => {
              return (<li key={ix} className={styles.item} data-index={ix}>
                        <VLink className={styles.link} path="channel" feedUrl={channel.feedUrl}>
                          <picture>
                            { channel.image && <source srcSet={channel.image} /> }
                            <source srcSet="gray.gif" />
                            <img src="gray0.png" alt="channel artwork" />
                          </picture>
                          <span className={styles.title}>{channel.title}</span>
                        </VLink>
                      </li>)
            })
          }
          </ol>)
}

