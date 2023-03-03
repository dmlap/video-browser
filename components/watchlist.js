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

export default function Watchlist () {
  const favorites = useFavoritesStorage()
  const recents = useRecentsStorage()

  useDNav()

  return (
    <>
      <section>
        <h1>Favorites</h1>
        {favorites.get().length
          ? (<ChannelCarousel channels={favorites.get()} />)
          : FAVORITES_HELP}

        {recents.ready && !!recents.get().length && (
          <>
            <h1>Recents</h1>
            <Carousel videos={Array.from(recents.get().slice(-8)).reverse()}  />
          </>
        )}
      </section>
    </>
  )
}
