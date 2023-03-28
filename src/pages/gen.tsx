import { RefreshToken } from '@/types';
import { scopes } from '@/utils';
import {
  Anchor,
  Button,
  Center,
  Code,
  Container,
  Divider,
  MultiSelect,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { isNotEmpty, TransformedValues, useForm } from '@mantine/form';
import { useClipboard } from '@mantine/hooks';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

const TokenGen = () => {
  const router = useRouter();

  const [result, setResult] = useState<string | null>(null);

  const clipboard = useClipboard({ timeout: 500 });
  const form = useForm({
    initialValues: {
      response_type: 'code',
      client_id: '',
      scope: [''],
      redirect_uri: '',
    },

    validate: {
      response_type: isNotEmpty('Response type is necessary'),
      client_id: isNotEmpty('Client ID is necessary'),
      scope: isNotEmpty('Scopes are required'),
      redirect_uri: isNotEmpty('Redirect URI is necessary'),
    },

    transformValues: values => ({
      ...values,
      scope: values.scope.join(','),
    }),
  });
  const formForCode = useForm({
    initialValues: {
      client_id: '',
      client_secret: '',
      redirect_uri: '',
    },

    validate: {
      client_id: isNotEmpty('Client ID is necessary'),
      client_secret: isNotEmpty('Client Secret is necessary'),
      redirect_uri: isNotEmpty('Redirect URI is necessary'),
    },
  });

  const onSubmit = async (values: TransformedValues<typeof form>) => {
    const url = new URL('https://accounts.spotify.com/authorize');
    url.searchParams.append('response_type', values.response_type);
    url.searchParams.append('client_id', values.client_id);
    url.searchParams.append('scope', values.scope);
    url.searchParams.append('redirect_uri', values.redirect_uri);

    router.push(url.toString());
  };
  const onCodeCheck = async (values: typeof formForCode.values) => {
    const res = await axios.get<RefreshToken>(
      'https://accounts.spotify.com/api/token',
      {
        params: {
          client_id: values.client_id,
          client_secret: values.client_secret,
          redirect_uri: values.redirect_uri,

          grant_type: 'authorization_code',
          code: router.query.code,
        },
      },
    );

    if (res.status === 200) {
      setResult(JSON.stringify(res.data));
    }
  };

  return (
    <>
      <Container size={420} my={40}>
        <Title align="center" fw={900}>
          Generate the redirect token for spotify
        </Title>

        <Text color="dimmed" size="sm" align="center" mb="xs">
          Credits:
          <Anchor
            size="sm"
            href="https://benwiz.com/blog/create-spotify-refresh-token/"
          >
            blog post by benwiz - create spotify refresh token
          </Anchor>
        </Text>

        {router.query.code ? (
          <Paper variant="outline" withBorder shadow="md" p="sm" radius="md">
            <Center>
              <Stack>
                <Text>Redirect Code</Text>
                <Button
                  color={clipboard.copied ? 'teal' : 'blue'}
                  onClick={() => clipboard.copy('Hello, world!')}
                >
                  Copy Code
                </Button>

                {result !== null ? (
                  <>
                    <Divider mt="sm" />
                    <Code color="teal">{result}</Code>
                  </>
                ) : null}
              </Stack>
            </Center>

            <Divider mt="sm" />

            <form onSubmit={formForCode.onSubmit(onCodeCheck)}>
              <TextInput
                label="Client ID"
                placeholder=""
                withAsterisk
                {...formForCode.getInputProps('client_id')}
              />
              <TextInput
                label="Client Secret"
                placeholder=""
                withAsterisk
                {...formForCode.getInputProps('client_secret')}
              />
              <TextInput
                label="Redirect URI"
                placeholder="[CURRENT_SITE]/callback"
                withAsterisk
                {...formForCode.getInputProps('redirect_uri')}
              />

              <Button fullWidth mt="xl" type="submit">
                Request refresh token
              </Button>
            </form>
          </Paper>
        ) : (
          <Paper withBorder shadow="md" p={30} mt="sm" radius="md">
            <form onSubmit={form.onSubmit(onSubmit)}>
              <TextInput
                label="Response Type"
                placeholder=""
                withAsterisk
                readOnly
                {...form.getInputProps('response_type')}
              />
              <TextInput
                label="Client ID"
                placeholder=""
                withAsterisk
                {...form.getInputProps('client_id')}
              />
              <TextInput
                label="Redirect URI"
                placeholder="[CURRENT_SITE]/callback"
                withAsterisk
                {...form.getInputProps('redirect_uri')}
              />
              <MultiSelect
                label="Scope"
                placeholder=""
                withAsterisk
                data={scopes}
                clearable
                {...form.getInputProps('scope')}
              />
              <Button fullWidth mt="xl" type="submit">
                Generate Code
              </Button>
            </form>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default TokenGen;
