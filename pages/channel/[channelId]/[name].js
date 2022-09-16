import useSWR from 'swr'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Error from '../../../components/error'

import fetcher from '../../../src/json-fetcher'

export default function Channel () {
  const router = useRouter()
  const { channelId } = router.query
  const [loaded, setLoaded] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  // load subscription state from localStorage
  useEffect(() => {
    setSubscribed(!!localStorage.getItem(channelId))
    setLoaded(true)
  }, [])

  // load the channel info from the API
  const { data, error } =
        useSWR(() => {
          if (!channelId) {
            // channelId will not be available during static page
            // generation
            // signal that the request should be retried by returning
            // false
            return false
          }
          return `/api/lookup?collectionId=${encodeURIComponent(channelId)}`
        }, fetcher)

  if (!channelId) {
    return (<div>Loading...</div>)
  }

  if (error) {
    console.error(error)
    return (<Error message={error.message} />)
  }

  if (!data) {
    return (<div>Loading...</div>)
  }

  const channel = data

  function toggleSubscription (event) {
    event.preventDefault()

    if (subscribed) {
      localStorage.removeItem(channelId)
    } else {
      localStorage.setItem(channelId, JSON.stringify(channel))
    }
    setSubscribed(!subscribed)
  }

  return (<>
          <h1>{channel.collectionCensoredName}</h1>
          <img src={channel.artworkUrl600}
               width={100}
               height={100}
               alt={channel.collectionCensoredName + ' artwork'} />
          <p>{channel.genres.slice(0, 3).join(', ')}</p>

          <form onSubmit={toggleSubscription}>
          { loaded &&
            (<button type="submit">{ subscribed ? 'Unsubscribe' : 'Subscribe'}</button>)
          }
          </form>
          </>)
}
