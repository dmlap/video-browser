import VLink from './vlink'
import Video from './video'

import styles from '../styles/Carousel.module.css'

export default function Carousel ({ videos }) {
  return (<ol className={styles.videos}>
              {
                videos.map((video, ix) => {
                  return (<li key={ix} className={styles.videoItem}>
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
