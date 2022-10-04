import Head from 'next/head'

import Navigation from './navigation'

import styles from '../styles/Layout.module.css'

export default function Layout ({ children }) {
  return (<>
          <Head>
            <title>Video Browser</title>
            <meta name="description" content="A browser for all the world's video" />
          </Head>

          <Navigation className={styles.nav} />
          { children }

          </>)
}
