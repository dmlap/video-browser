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

const YT_API_KEY = 'AIzaSyC7QT4SIYsNndh-718qc7NvRI6qfUjp05U'
const YT_URL = 'https://youtube.googleapis.com/youtube/v3/search'

/**
 *
 * @see https://developers.google.com/youtube/v3/docs#Search
 */
function youtubeFetcher (url) {
  return fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  }).then((response) => { return response.json() })
    .then((json) => {
      if (json.error) {
        console.log('faking youtube json due to error', json)
        json = ytExample
      }
      return Promise.allSettled(json.items.map((item) => {
        // abandon the request after 2 seconds
        return Promise.race([
          fetchAndParseChannel(`https://www.youtube.com/feeds/videos.xml?channel_id=${item.snippet.channelId}`),
          new Promise((resolve, reject) => {
            setTimeout(reject.bind(null, { status: 'timeout' }), 2000)
          })
        ])
      })).then((channelRequests) => {
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

export default function YouTube({ query }) {
  const youtube =
        useSWR(`${YT_URL}?part=snippet&maxResults=25&q=${query}&key=${YT_API_KEY}`,
               youtubeFetcher)

  return (<>

            <h1>YouTube</h1>
            <SearchCarousel response={youtube} />

          </>)
}

YouTube.getLayout = function (page) {
  return (<Layout instantSearch={true}>{page}</Layout>)
}