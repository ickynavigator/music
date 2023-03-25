import { useRouterTransition } from '@/hooks';
import { MantineProvider } from '@mantine/core';
import { NavigationProgress } from '@mantine/nprogress';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  useRouterTransition();

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <NavigationProgress autoReset={true} />
      <Component {...pageProps} />
    </MantineProvider>
  );
}
