import useSWR from 'swr'

import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from '../styles/Search.module.css'

const fetcher = (...args) => fetch(...args).then((response) => response.json())

export default function Search() {
  const router = useRouter()
  const { q } = router.query

  const { data, error } = useSWR('/api/search', fetcher)

  if (error) {
    return (<div>Uh oh! Something went wrong</div>)
  }
  if (!data) {
    return (<div>Loading...</div>)
  }

  if (data.resultCount === 0) {
    return (<div>No results</div>)
  }

  const results = data.results.map((result) => {
    const uriCollectionName =
          encodeURIComponent(result.collectionCensoredName
                             .toLowerCase()
                             .replace(/[ -]+/g, '-'))
    return (<li key={result.collectionId} className={styles.channelItem}>
            <Link href={`/channel/${encodeURIComponent(result.collectionId)}/${uriCollectionName}`}>
              <a>
              <img className={styles.artwork}
                   src={result.artworkUrl600}
                   width="100" alt={result.collectionCensoredName} />
                {result.collectionCensoredName}
              </a>
            </Link>
            </li>)
  })
  return (<ol className={styles.channelList}>
            {results}
          </ol>)
}
