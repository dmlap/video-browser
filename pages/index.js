import { useEffect, useState } from 'react'
import Head from 'next/head'
import RelLink from '../components/rel-link'

import Layout from '../components/layout'
import nameToPathPart from '../src/name-to-path-part'

import styles from '../styles/Home.module.css'

export default function Home() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const results = []
    for (let i = 0; i < localStorage.length; i++) {
      const json = JSON.parse(localStorage.getItem(localStorage.key(i)))
      results.push({
        channelId: json.collectionId,
        artistName: json.artistName,
        channelCensoredName: json.collectionCensoredName,
        channelName: json.collectionName,
        explicit: json.explicit,
        artworkUrl600: json.artworkUrl600,
        genres: json.genres,
        feedUrl: json.feedUrl,
        kind: json.kind
      })
    }

    setFavorites(results)
  }, [])

  const favoriteList = favorites.map((favorite) => {
    return (<li key={favorite.channelId}>
            <RelLink href={
              '/' + [
                'channel',
                favorite.channelId,
                nameToPathPart(favorite.channelCensoredName)
              ].join('/')
            }>
                {favorite.channelCensoredName}
              </RelLink>
            </li>)
  })
  const favoriteHelp =
        (<small>
           {"Subscribe to channels you like and they'll show up here"}
         </small>)

  return (<main>
            <section>
              <h1>
                Favorites
              </h1>

              { favorites.length ? (<ul>{favoriteList}</ul>) : favoriteHelp }
            </section>
            <section>
              <h1>
                Recents
              </h1>

              <ol>
                <li><RelLink href="/channels/one">One</RelLink></li>
                <li><RelLink href="/channels/two">Two</RelLink></li>
                <li><RelLink href="/channels/three">Three</RelLink></li>
              </ol>
            </section>
          </main>)
}
