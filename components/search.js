import useSWR from 'swr'

import VLink from './vlink'
import { ChannelCarousel } from './carousel'
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

  return (<ChannelCarousel channels={data.results.map((result) => {
    return result.channel
  })} />)
}

export default function Search({ query }) {
  const itunes =
        useSWR(`${ITUNES_URL}?term=${query}&entity=podcast&explicit=No`,
               itunesFetcher)
  const youtube =
        useSWR(`${YT_URL}?part=snippet&maxResults=25&q=${query}&key=${YT_API_KEY}`,
               youtubeFetcher)

  return (<>

            <h1>Podcasts</h1>
            <SearchCarousel response={itunes} />

            <h1>YouTube</h1>
            <SearchCarousel response={youtube} />

          </>)
}

Search.getLayout = function (page) {
  return (<Layout instantSearch={true}>{page}</Layout>)
}
