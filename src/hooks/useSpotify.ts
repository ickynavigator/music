import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import Spotify from 'spotify-web-api-js';

export const useSpotify = () => {
  const [tokenSet, setTokenSet] = useState(false);
  const spotifyApi = useMemo(() => new Spotify(), []);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await axios.get<string>('/api/token');

        if (res.status === 200) {
          const token = res.data;
          spotifyApi.setAccessToken(token);

          setTokenSet(true);
        } else {
          setTokenSet(false);
        }
      } catch (error) {
        setTokenSet(true);
        console.log(error);
      }
    };

    fetchToken();
  }, [spotifyApi]);

  return {
    tokenSet,
    spotifyApi,
  };
};
