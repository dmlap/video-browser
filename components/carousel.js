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
                              <img src={video.poster}
                                   alt="video artwork" />
                              {video.title}
                            </a>
                          </Link>
                          </li>)
                })
              }
          </ol>)
}
