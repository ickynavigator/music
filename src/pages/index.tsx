import { TrackCard } from '@/components';
import { useSpotify } from '@/hooks';
import Head from 'next/head';
import { useEffect, useState } from 'react';

const Home = () => {
  const {
    tokenSet,
    spotifyApi: { getMyCurrentPlayingTrack },
  } = useSpotify();
  const [track, setTrack] =
    useState<SpotifyApi.CurrentlyPlayingResponse | null>(null);

  useEffect(() => {
    if (!tokenSet) return;

    getMyCurrentPlayingTrack().then(res => {
      setTrack(res);
    });
  }, [getMyCurrentPlayingTrack, tokenSet]);

  return (
    <>
      <Head>
        <title>Obi is listening to</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <TrackCard track={track ? track.item : null} />
      </div>
    </>
  );
};

export default Home;
