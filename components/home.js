import Carousel from './carousel'
import VLink from './vlink'
import Channel from './channel'

import { useFavoritesStorage, useRecentsStorage } from '../src/storage'

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
              <VLink path="channel" feedUrl={favorite.feedUrl}>
                {favorite.title}
              </VLink>
            </li>)
  })

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

              <Carousel videos={Array.from(recents.get().slice(-8)).reverse()} />
              </section>
            }
          </main>)
}
