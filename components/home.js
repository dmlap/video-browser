import Carousel, { ChannelCarousel } from './carousel'
import { useDNav } from './dnav'

import { useFavoritesStorage, useRecentsStorage, useWizardStorage } from '../src/storage'
import { useITunesData } from '../pages/api/itunes'
import { useYouTubeData } from '../pages/api/youtube'
import Layout from '../components/layout'
import { LoadingMessage } from '../components/loading'
import Error from '../components/error'
import { useRouter } from './vlink'

import styles from '../styles/Home.module.css'

const FAVORITES_HELP = (
  <small>Subscribe to channels you like and they&apos;ll show up here</small>
)

const CATEGORIES = ['News', 'Sport', 'Comedy', 'Cars', 'Music']

function SearchCarousel ({ response }) {
  const { data, error } = response || {}

  if (error) {
    console.error(error)
    return (<Error message={error.message} />)
  }
  if (!data) {
    return (<LoadingMessage />)
  }

  if (!data.results || data.results.length === 0) {
    return (<div>No results</div>)
  }

  return (
    <ChannelCarousel channels={data.results.map((result) => {
      return result.channel
    })}
    />
  )
}

function MainContent ({ query }) {
  const recents = useRecentsStorage()
  const favorites = useFavoritesStorage()
  const wizardData = useWizardStorage()

  const category = wizardData.get().category

  const itunes = useITunesData(query || category)
  const youtube = useYouTubeData(query || category)

  return (
    <Layout>
      <main>
        <section className={styles.hero}>
          <h1>Podcasts</h1>
          <SearchCarousel response={itunes} />
          <h1>YouTube</h1>
          <SearchCarousel response={youtube} />
        </section>
        <section>
          <h1>Favorites</h1>

          {favorites.get().length ? <ChannelCarousel channels={favorites.get()} /> : FAVORITES_HELP}
        </section>
        {recents.ready && !!recents.get().length && (
          <section>
            <h1>Recents</h1>

            <Carousel videos={Array.from(recents.get().slice(-8)).reverse()} />
          </section>
        )}
      </main>
    </Layout>
  )
}

function Wizard () {
  const router = useRouter()
  const wizardData = useWizardStorage()

  const categoryHandler = (evt) => {
    if (evt.type === 'keyup' && evt.code !== 'Enter') {
      return
    }

    const category = evt.target.dataset.category

    wizardData.set({ category })
    router.reload()
  }

  return (
    <main className={styles.main}>
      <div className={styles.wizard}>
        <img className={styles.logo} src='logo.svg' alt='logo' />
        <h1>Which category are you interested in?</h1>
        <div className={styles.categories}>
          {CATEGORIES.map((el) => (
            <div
              tabIndex='1'
              data-category={el}
              onClick={categoryHandler}
              onKeyUp={categoryHandler}
              className={styles.category}
              key={el}
            >
              {el}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default function Home ({ query }) {
  const wizardData = useWizardStorage()

  useDNav()

  if (!wizardData.get()?.category && wizardData.ready) {
    return <Wizard />
  }

  return <MainContent query={query} />
}

Home.getLayout = function (page) {
  return page
}
