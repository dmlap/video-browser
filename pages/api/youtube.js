import useSWR from 'swr';

import { fetchAndParseChannel } from './utils';

const YT_API_KEY = 'AIzaSyC7QT4SIYsNndh-718qc7NvRI6qfUjp05U';
const YT_URL = 'https://youtube.googleapis.com/youtube/v3/search';

/**
 *
 * @see https://developers.google.com/youtube/v3/docs#Search
 */
export function youTubeDataFetcher(url) {
  return fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.error) {
        console.log('faking youtube json due to error', json);
        json = ytExample;
      }
      return Promise.allSettled(
        json.items.map((item) => {
          // abandon the request after 2 seconds
          return Promise.race([
            fetchAndParseChannel(`https://www.youtube.com/feeds/videos.xml?channel_id=${item.snippet.channelId}`),
            new Promise((resolve, reject) => {
              setTimeout(reject.bind(null, { status: 'timeout' }), 2000);
            }),
          ]);
        })
      ).then((channelRequests) => {
        return {
          results: channelRequests.reduce((results, channelRequest) => {
            // make sure the feed was accessible and contained at least one video
            if (channelRequest.status === 'fulfilled' && channelRequest.value?.channel?.videos?.length > 0) {
              return results.concat(channelRequest.value);
            }

            return results;
          }, []),
        };
      });
    });
}

export function useYouTubeData(query) {
  return useSWR(`${YT_URL}?part=snippet&maxResults=25&q=${query}&key=${YT_API_KEY}`, youTubeDataFetcher);
}
