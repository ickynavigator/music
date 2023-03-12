import RouterTransition from '@/components/RouterTransition';
import { MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <RouterTransition />
      <Component {...pageProps} />
    </MantineProvider>
  );
}
