import Head from 'next/head'

import Navigation from './navigation'

import styles from '../styles/Layout.module.css'

export default function Layout ({ children, instantSearch }) {
  return (
    <>
      <Head>
        <title>Video Browser</title>
        <link rel='shortcut icon' href='/logo-white.svg' />
        <meta name='description' content="A browser for all the world's video" />
      </Head>

      <Navigation className={styles.nav} instantSearch={instantSearch} />
      <main className={styles.main}>
        {children}
      </main>

    </>
  )
}
