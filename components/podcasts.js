import useSWR from 'swr'

import VLink from './vlink'
import { List } from './carousel'
import Error from './error'
import { LoadingMessage } from './loading'
import Layout from './layout'
import parseChannel from '../src/channel'

import { OFFLINE } from '../env'
import ytExample from '../public/yt-example-response.json'

const ITUNES_URL = (() => {
  // use a mock API for offline testing based on environment variables
  const SEARCH_DOMAIN = OFFLINE ? '' : 'https://itunes.apple.com'

  return SEARCH_DOMAIN + '/search'
})()

function fetchAndParseChannel (feedUrl) {
  return fetch(feedUrl)
    .then((response) => response.text())
    .then((feedXml) => {
      const channel = parseChannel(feedUrl, feedXml)
      return {
        status: 'resolved',
        channel
      }
    })
}

/**
 * SWR fetcher function to process iTunes search API responses, fetch
 * the `feedURL` of the results, and return the search results and
 * channel objects for those feeds with video contents.
 * @see https://swr.vercel.app/docs/data-fetching
 */
function itunesFetcher (url) {
  // fetch results from iTunes' search APi
  return fetch(url + `&n=${Math.round(Math.random() * 9e8)}`)
    .then((response) => { return response.json() })
    .then((json) => {
      return Promise.allSettled(json.results.map((result) => {
        // abandon the request after 2 seconds
        return Promise.race([
          fetchAndParseChannel(result.feedUrl),
          new Promise((resolve, reject) => {
            setTimeout(reject.bind(null, { status: 'timeout' }), 2000)
          })
        ])
      }))
    }).then((channelRequests) => {
      return {
        results: channelRequests.reduce((results, channelRequest) => {
          // make sure the feed was accessible and contained at least one video
          if (channelRequest.status === 'fulfilled' && channelRequest.value?.channel?.videos?.length > 0) {
            return results.concat(channelRequest.value)
          }

          return results
        }, [])
      }
    })
}

function SearchCarousel ({ response }) {
  const { data, error } = response
  if (error) {
    console.error(error)
    return (<Error message={error.message} />)
  }
  if (!data) {
    return (<LoadingMessage />)
  }

  if (!data.results || data.results.length === 0) {
    return (<div>No results</div>)
  }

  return (<List channels={data.results.map((result) => {
    return result.channel
  })} />)
}

export default function Podcasts({ query }) {
  const itunes =
        useSWR(`${ITUNES_URL}?term=${query}&entity=podcast&explicit=No`,
               itunesFetcher)

  return (<>

            <h1>Podcasts</h1>
            <SearchCarousel response={itunes} />
          </>)
}

Podcasts.getLayout = function (page) {
  return (<Layout instantSearch={true}>{page}</Layout>)
}
