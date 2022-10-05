import Head from 'next/head'
import RelLink from '../components/rel-link'

import Layout from '../components/layout'
import { useFavoritesStorage, useRecentsStorage } from '../src/storage'
import nameToPathPart from '../src/name-to-path-part'

import styles from '../styles/Home.module.css'

const FAVORITES_HELP =
      (<small>
       {"Subscribe to channels you like and they'll show up here"}
       </small>)

export default function Home() {
  const favorites = useFavoritesStorage()
  const recents = useRecentsStorage()

  const favoriteList = favorites.get().map((favorite) => {
    return (<li key={favorite.feedUrl}>
            <RelLink href={
              '/' + [
                'channel',
                nameToPathPart(favorite.title)
              ].join('/')
                + `?feedUrl=${favorite.feedUrl}`
            }>
                {favorite.title}
              </RelLink>
            </li>)
  })

  const recentsList = recents.get().slice(-8).map((recent) => {
    return (<li key={recent.id}>
              <RelLink href={'/'}>
              {recent.title}
              </RelLink>
            </li>)
  }).reverse()

  return (<main>
            <section>
              <h1>
                Favorites
              </h1>

              { favorites.get().length ? (<ul>{favoriteList}</ul>) : FAVORITES_HELP }
            </section>
            { recents.ready && !!recents.get().length &&
              <section>
                <h1>
                  Recents
                </h1>

                <ol>
                  { recentsList }
                </ol>
              </section>
            }
          </main>)
}
