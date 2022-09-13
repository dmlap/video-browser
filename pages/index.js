import Head from 'next/head'
import Link from 'next/link'
import SearchForm from './search-form'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Video Browser</title>
        <meta name="description" content="A browser for all the world's video" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav>
        <SearchForm />
      </nav>

      <main className={styles.main}>
        <section>
          <h1>
            Favorites
          </h1>

          <ol>
            <li><Link href="/channels/one"><a>One</a></Link></li>
            <li><Link href="/channels/two"><a>Two</a></Link></li>
            <li><Link href="/channels/three"><a>Three</a></Link></li>
          </ol>
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
      </main>

      <footer className={styles.footer}>
        Powered by the video developer community
      </footer>
    </div>
  )
}
