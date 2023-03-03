import { useState } from 'react'

import Carousel from './carousel'
import { ChannelCarousel } from './carousel'
import VLink from './vlink'
import Channel from './channel'
import { useDNav } from './dnav'

import { useFavoritesStorage, useRecentsStorage } from '../src/storage'

import styles from '../styles/Home.module.css'

const FAVORITES_HELP =
      (<small>
       {"Subscribe to channels you like and they'll show up here"}
       </small>)

export default function Home() {
  const favorites = useFavoritesStorage()
  const recents = useRecentsStorage()
  const [hero, setHero] = useState({
    title: '',
    description: ''
  })

  useDNav()

  function handleVideoFocus (item) {
    const { title, description, poster } = item

    setHero({
      title,
      description,
      image: poster
    })
  }
  function handleChannelFocus (item) {
    const { title, description, image } = item
    const result = { title, description }

    if (image) {
      result.image = image
    } else {
      const video = item.videos.find((video) => {
        return video.poster
      })
      if (video) {
        result.image = video.poster
      }
    }

    setHero(result)
  }

  const heroStyle = {}
  if (hero.image) {
    heroStyle.backgroundImage = `url('${hero.image}')`
  } else {
    heroStyle.backgroundImage = 'linear-gradient(315deg, hotpink, blue)'
    heroStyle.backgroundSize = '100%'
  }

  return (<>
            <section className={styles.hero} style={heroStyle}>
              <div className={styles.halftone} />
              <h1>{hero.title}</h1>
              <p>{hero.description}</p>
            </section>
            <section className={styles.suggestions}>
              <h1>Favorites</h1>
              { favorites.get().length ?
                (<ChannelCarousel channels={favorites.get()} onFocus={handleChannelFocus} />) : FAVORITES_HELP
              }

              { recents.ready && !!recents.get().length &&
                (<>
                   <h1>Recents</h1>
                   <Carousel videos={Array.from(recents.get().slice(-8)).reverse()} onFocus={handleVideoFocus} />
                 </>)
              }
            </section>
          </>)
}
