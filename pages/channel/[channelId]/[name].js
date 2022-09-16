import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Channel () {
  const router = useRouter()
  const { channelId, name } = router.query
  const [loaded, setLoaded] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    setSubscribed(!!localStorage.getItem(channelId))
    setLoaded(true)
  })

  function toggleSubscription (event) {
    event.preventDefault()

    if (subscribed) {
      localStorage.removeItem(channelId)
    } else {
      localStorage.setItem(channelId, name)
    }
    setSubscribed(!subscribed)
  }

  return (<>
          <h1>{name}</h1>
          <form onSubmit={toggleSubscription}>
          { loaded &&
            (<button type="submit">{ subscribed ? 'Unsubscribe' : 'Subscribe'}</button>)
          }
          </form>
          </>)
}
