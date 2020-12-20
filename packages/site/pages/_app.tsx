import { AppProps } from 'next/app'
import Head from 'next/Head'
import { ChakraProvider, CSSReset } from '@chakra-ui/react'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Head>
        <title>NATS.ws Demo</title>
        <meta name='author' content='Daniel Lauzon'></meta>
        <meta
          name='description'
          content='Next.js / Chakra UI / NATS Websocket Demo'
        ></meta>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
