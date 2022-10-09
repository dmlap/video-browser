import nameToPathPart from '../src/name-to-path-part'

import Link from 'next/link'

import styles from '../styles/Carousel.module.css'

export default function Carousel ({ videos }) {

  return (<ol className={styles.videos}>
              {
                videos.map((video, ix) => {
                  const name = nameToPathPart(video.channelDetail.title)

                  return (<li key={ix} className={styles.videoItem}>
                          <Link href={
                            `/channel/${name}/${nameToPathPart(video.title)}`
                              + `?feedUrl=${video.channelDetail.feedUrl}&id=${video.id}`
                          }>
                            <a>
                          <picture>
                            { video.poster && <source srcSet={video.poster} /> }
                            <img src="/tv-100.png" alt="video artwork" />
                          </picture>
                              {video.title}
                            </a>
                          </Link>
                          </li>)
                })
              }
          </ol>)
}
