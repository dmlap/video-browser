import parseChannel from '../../src/channel';

export function fetchAndParseChannel(feedUrl) {
  return fetch(feedUrl)
    .then((response) => response.text())
    .then((feedXml) => {
      const channel = parseChannel(feedUrl, feedXml);
      return {
        status: 'resolved',
        channel,
      };
    });
}
