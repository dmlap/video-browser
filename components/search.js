import VLink from './vlink';
import { ChannelCarousel } from './carousel';
import Error from './error';
import { LoadingMessage } from './loading';
import Layout from './layout';
import parseChannel from '../src/channel';

import { OFFLINE } from '../env';
import ytExample from '../public/yt-example-response.json';

import { useITunesData } from '../pages/api/itunes';
import { useYouTubeData } from '../pages/api/youtube';

function SearchCarousel({ response }) {
  const { data, error } = response;
  if (error) {
    console.error(error);
    return <Error message={error.message} />;
  }
  if (!data) {
    return <LoadingMessage />;
  }

  if (!data.results || data.results.length === 0) {
    return <div>No results</div>;
  }

  return (
    <ChannelCarousel
      channels={data.results.map((result) => {
        return result.channel;
      })}
    />
  );
}

export default function Search({ query }) {
  const itunes = useITunesData(query);
  const youtube = useYouTubeData(query);

  return (
    <main>
      <h1>Podcasts</h1>
      <SearchCarousel response={itunes} />

      <h1>YouTube</h1>
      <SearchCarousel response={youtube} />
    </main>
  );
}

Search.getLayout = function (page) {
  return <Layout instantSearch={true}>{page}</Layout>;
};
