import { useRouter } from 'next/router'

import RelLink from '../components/rel-link'
import { relative } from '../src/path'

import styles from '../styles/Carousel.module.css'

export default function Carousel ({ videos }) {
  const router = useRouter()
  const defaultPosterUrl = relative(router.pathname, '/tv-100.png')

  return (<ol className={styles.videos}>
              {
                videos.map((video, ix) => {
                  return (<li key={ix} className={styles.videoItem}>
                          <RelLink href={
                            `/video?feedUrl=${video.channelDetail.feedUrl}&id=${video.id}`
                          }>
                            <picture>
                              { video.poster && <source srcSet={video.poster} /> }
                              <img src={defaultPosterUrl} alt="video artwork" />
                            </picture>
                            {video.title}
                          </RelLink>
                          </li>)
                })
              }
          </ol>)
}
