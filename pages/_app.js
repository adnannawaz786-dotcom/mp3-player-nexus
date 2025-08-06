import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import '../styles/globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const theme = {
  colorScheme: 'dark',
  colors: {
    cyber: [
      '#00ffff',
      '#00e6e6',
      '#00cccc',
      '#00b3b3',
      '#009999',
      '#008080',
      '#006666',
      '#004d4d',
      '#003333',
      '#001a1a'
    ]
  },
  primaryColor: 'cyber',
  fontFamily: 'Orbitron, monospace',
  headings: {
    fontFamily: 'Orbitron, monospace'
  }
};

export default function App({ Component, pageProps, router }) {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <Layout>
        <AnimatePresence mode="wait" initial={false}>
          <Component key={router.asPath} {...pageProps} />
        </AnimatePresence>
      </Layout>
    </MantineProvider>
  );
}