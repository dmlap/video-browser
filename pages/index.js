import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

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
            <Link href={
              '/' + [
                'channel',
                favorite.channelId,
                nameToPathPart(favorite.channelCensoredName)
              ].join('/')
            }>
                <a>{favorite.channelCensoredName}</a>
              </Link>
            </li>)
  })
  const favoriteHelp =
        (<small>
           {"Subscribe to channels you like and they'll show up here"}
         </small>)

  return (<>
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
              <li><Link href="/channels/one"><a>One</a></Link></li>
              <li><Link href="/channels/two"><a>Two</a></Link></li>
              <li><Link href="/channels/three"><a>Three</a></Link></li>
            </ol>
          </section>
          </>)
}
