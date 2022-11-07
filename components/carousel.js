import VLink from './vlink'
import Video from './video'

import styles from '../styles/Carousel.module.css'

export function ChannelCarousel ({ channels }) {
  return (<ol className={styles.channels}>
          {
            channels.map((channel) => {
              return (<li key={channel.feedUrl} className={styles.item}>
                        <VLink path="channel" feedUrl={channel.feedUrl}>
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
  return (<ol className={styles.videos}>
              {
                videos.map((video, ix) => {
                  return (<li key={ix} className={styles.item}>
                          <VLink path="video" video={video}>
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
