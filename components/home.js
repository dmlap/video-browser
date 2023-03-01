import { useRouter } from 'next/router';

import Carousel from './carousel';
import { ChannelCarousel } from './carousel';
import VLink from './vlink';
import Channel from './channel';
import { useDNav } from './dnav';

import { useFavoritesStorage, useRecentsStorage, useWizardStorage } from '../src/storage';
import { useITunesData } from '../pages/api/itunes';
import { useYouTubeData } from '../pages/api/youtube';
import Layout from '../components/layout';

import styles from '../styles/Home.module.css';

const FAVORITES_HELP = <small>{"Subscribe to channels you like and they'll show up here"}</small>;

const CATEGORIES = ['News', 'Sport', 'Comedy', 'Cars', 'JW Player'];

function MainContent() {
  const recents = useRecentsStorage();
  const favorites = useFavoritesStorage();
  const wizardData = useWizardStorage();

  useDNav();

  const { data: itunes } = useITunesData(wizardData.get().category);
  const { data: youtube } = useYouTubeData(wizardData.get().category);

  return (
    <Layout>
      <main>
        <section className={styles.hero}>
          <h1>Podcasts</h1>
          {itunes && <ChannelCarousel channels={itunes?.results.map((result) => result.channel)} />}
          <h1>YouTube</h1>
          {youtube && <ChannelCarousel channels={youtube?.results.map((result) => result.channel)} />}
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
  );
}

function Wizard() {
  const router = useRouter();
  const wizardData = useWizardStorage();

  useDNav();

  const categoryHandler = (evt) => {
    console.log(evt);
    if (event.type === 'keyup' && event.code !== 'Enter') {
      return;
    }

    const category = evt.target.dataset.category;

    wizardData.set({ category });
    router.replace({
      query: { ...router.query, category: category.toLowerCase() },
    });
    router.reload();
  };

  return (
    <main className={styles.main}>
      <div className={styles.wizard}>
        <img className={styles.logo} src="logo.svg" alt="logo" />
        <h1>Which category are you interested in?</h1>
        <div className={styles.categories}>
          {CATEGORIES.map((el) => (
            <div
              tabIndex="1"
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
  );
}

export default function Home() {
  const wizardData = useWizardStorage();

  if (!wizardData.get()?.category) {
    return <Wizard />;
  }

  return <MainContent />;
}

Home.getLayout = function (page) {
  return page;
};
