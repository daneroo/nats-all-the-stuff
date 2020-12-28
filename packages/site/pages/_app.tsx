import { AppProps } from 'next/app'
import Head from 'next/Head'
import { ChakraProvider } from '@chakra-ui/react'

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ChakraProvider>
      <Head>
        <title>NATS.ws Demo</title>
        <meta name='author' content='Daniel Lauzon' />
        <meta
          name='description'
          content='Next.js / Chakra UI / NATS Websocket Demo'
        />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
