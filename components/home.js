import { useState } from 'react'
import sanitizeHtml from 'sanitize-html'

import Carousel, { ChannelCarousel, SearchCarousel } from './carousel'
import { useDNav } from './dnav'

import { useFavoritesStorage, useRecentsStorage, useWizardStorage } from '../src/storage'
import { useITunesData } from '../pages/api/itunes'
import { useYouTubeData } from '../pages/api/youtube'
import Layout from '../components/layout'
import { useRouter } from './vlink'
import { Category } from './category'

import styles from '../styles/Home.module.css'

const FAVORITES_HELP = (
  <small>Subscribe to channels you like and they&apos;ll show up here</small>
)

const CATEGORIES = ['News', 'Sport', 'Comedy', 'Cars', 'Music']

function MainContent ({ query }) {
  const recents = useRecentsStorage()
  const favorites = useFavoritesStorage()
  const wizardData = useWizardStorage()

  useDNav()

  const [hero, setHero] = useState({
    title: '',
    description: ''
  })

  const category = wizardData.get().category

  const itunes = useITunesData(query || category)
  const youtube = useYouTubeData(query || category)

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
    <Layout>
      {hero?.title && (
        <section className={styles.hero} style={heroStyle}>
          <h1>{hero.title}</h1>
          <p>{hero.description}</p>
        </section>
      )}
      <Category />
      <h1>Podcasts</h1>
      <SearchCarousel response={itunes} />
      <h1>YouTube</h1>
      <SearchCarousel response={youtube} />
      <section className={styles.suggestions}>
        <h1>Favorites</h1>
        {favorites.get().length
          ? (<ChannelCarousel channels={favorites.get()} onFocus={handleChannelFocus} />)
          : FAVORITES_HELP}

        {recents.ready && !!recents.get().length && (
          <>
            <h1>Recents</h1>
            <Carousel videos={Array.from(recents.get().slice(-8)).reverse()} onFocus={handleVideoFocus} />
          </>)}
      </section>
    </Layout>
  )
}

function Wizard () {
  const router = useRouter()
  const wizardData = useWizardStorage()

  useDNav()

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

  console.log(wizardData.get())

  if (!wizardData.get()?.category && wizardData.ready) {
    return <Wizard />
  }

  return <MainContent query={query} />
}

Home.getLayout = function (page) {
  return page
}
