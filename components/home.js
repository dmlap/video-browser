import { useState } from 'react'
import sanitizeHtml from 'sanitize-html'

import Carousel, { ChannelCarousel } from './carousel'
import { useDNav } from './dnav'

import { useFavoritesStorage, useRecentsStorage } from '../src/storage'

import styles from '../styles/Home.module.css'

const FAVORITES_HELP =
      (
        <small>
          Subscribe to channels you like and they&apos;ll show up here
        </small>
      )

export default function Home () {
  const favorites = useFavoritesStorage()
  const recents = useRecentsStorage()
  const [hero, setHero] = useState({
    title: '',
    description: ''
  })

  useDNav()

  function handleVideoFocus (item) {
    const { title, description, poster } = item
    const safeDescription = sanitizeHtml(description, { allowedTags: [] })

    setHero({
      title,
      description: safeDescription,
      image: poster
    })
  }
  function handleChannelFocus (item) {
    const { title, description, image } = item
    const result = { title }

    const safeDescription = sanitizeHtml(description, { allowedTags: [] })
    result.description = safeDescription

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

  const heroStyle = {
    backgroundImage: 'radial-gradient(farthest-side, transparent, #0c0c0c)'
  }
  if (hero.image) {
    heroStyle.backgroundImage += `, url('${hero.image}')`
  }

  return (
    <>
      {hero?.title && (
        <section className={styles.hero} style={heroStyle}>
          <h1>{hero.title}</h1>
          <p>{hero.description}</p>
        </section>
      )}
      <section className={styles.suggestions} style={{ height: hero?.title ? '60%' : '100%' }}>
        <h1>Favorites</h1>
        {favorites.get().length
          ? (<ChannelCarousel channels={favorites.get()} onFocus={handleChannelFocus} />)
          : FAVORITES_HELP}

        {recents.ready && !!recents.get().length && (
          <>
            <h1>Recents</h1>
            <Carousel videos={Array.from(recents.get().slice(-8)).reverse()} onFocus={handleVideoFocus} />
          </>
        )}
      </section>
    </>
  )
}
