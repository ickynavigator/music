import { Card, Group, Image, Skeleton, Stack, Text } from '@mantine/core';

interface ITrackCard {
  track: SpotifyApi.TrackObjectFull | null;
}

export const TrackCard: React.FC<ITrackCard> = props => {
  const { track } = props;

  if (!track) {
    return <Skeleton height={8} radius="xl" />;
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={track.album.images[0].url}
          height={300}
          width={300}
          alt="Norway"
        />
      </Card.Section>

      <Group>
        <Stack>
          <Text>{track.name}</Text>
          <Text>{track.artists.map(artist => artist.name).join(', ')}</Text>
        </Stack>
      </Group>
    </Card>
  );
};
