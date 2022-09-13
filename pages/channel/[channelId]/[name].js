import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Channel () {
  const router = useRouter()
  const { channelId, name } = router.query
  const [ subscribed, setSubscribed ] = useState(false)

  function toggleSubscription (event) {
    event.preventDefault()

    setSubscribed(!subscribed)

    if (subscribed) {
      localStorage.setItem(channelId, name)
    } else {
      localStorage.removeItem(channelId)
    }
  }

  return (<>
          <h1>{name}</h1>
          <form onSubmit={toggleSubscription}>
            <button type="submit">{ subscribed ? 'Unsubscribe' : 'Subscribe'}</button>
          </form>
          </>)
}
