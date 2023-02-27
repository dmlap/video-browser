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

  useDNav()

  return (<main>
            <section className={styles.hero}>
              <h1>{"Clarkson's Farm 2"}</h1>
              <p>
                Follow Jeremy Clarkson as he attempts to run a farm in
                the countryside. With no previous farming experience,
                Jeremy contends with the worst farming weather in
                decades, disobedient animals, unresponsive crops, and
                an unexpected pandemic.
              </p>
            </section>
            <section>
              <h1>
                Favorites
              </h1>

              { favorites.get().length ?
                (<ChannelCarousel channels={favorites.get()} />) : FAVORITES_HELP
              }
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
