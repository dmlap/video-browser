import Head from 'next/head'
import Layout from '../components/layout'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (<>
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
          </>)
}
