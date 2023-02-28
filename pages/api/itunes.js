import useSWR from 'swr';

import { OFFLINE } from '../../env';
import { fetchAndParseChannel } from './utils';

const ITUNES_URL = (() => {
  // use a mock API for offline testing based on environment variables
  const SEARCH_DOMAIN = OFFLINE ? '' : 'https://itunes.apple.com';

  return SEARCH_DOMAIN + '/search';
})();

/**
 * SWR fetcher function to process iTunes search API responses, fetch
 * the `feedURL` of the results, and return the search results and
 * channel objects for those feeds with video contents.
 * @see https://swr.vercel.app/docs/data-fetching
 */
export function iTunesDataFetcher(url) {
  // fetch results from iTunes' search APi
  return fetch(url + `&n=${Math.round(Math.random() * 9e8)}`)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      return Promise.allSettled(
        json.results.map((result) => {
          // abandon the request after 2 seconds
          return Promise.race([
            fetchAndParseChannel(result.feedUrl),
            new Promise((resolve, reject) => {
              setTimeout(reject.bind(null, { status: 'timeout' }), 2000);
            }),
          ]);
        })
      );
    })
    .then((channelRequests) => {
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
}

export function useITunesData(query) {
  return useSWR(`${ITUNES_URL}?term=${query}&entity=podcast&explicit=No`, iTunesDataFetcher);
}
