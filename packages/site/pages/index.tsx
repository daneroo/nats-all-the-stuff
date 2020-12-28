import { NextPage } from 'next'
import NextLink from 'next/link'
import { Flex, Heading, Link, Stack, Box } from '@chakra-ui/react'

import { Publish, Subscribe, NatsProvider } from '../components/nats/Nats'
import { NTop } from '../components/nats/NTop'

const IndexPage: NextPage = () => {
  return (
    <Flex flexDirection='column' alignItems='center' margin={4}>
      <Heading as='h1' size='2xl' marginBottom='2rem'>
        NATS.ws - Next.js
      </Heading>

      <Stack direction='row' marginBottom='1rem'>
        <Box p={3} shadow='md' borderRadius='md' borderWidth='1px'>
          <NatsProvider name='demo.pub'>
            <Publish />
          </NatsProvider>
        </Box>
        <Box p={3} shadow='md' borderRadius='md' borderWidth='1px'>
          <NatsProvider name='demo.sub-1'>
            <Subscribe />
          </NatsProvider>
        </Box>

        <Box p={3} shadow='md' borderRadius='md' borderWidth='1px'>
          <NatsProvider name='demo.sub-2'>
            <Subscribe />
          </NatsProvider>
        </Box>

      </Stack>
      <NTop />

      <Stack direction='row' marginTop='1rem'>
        <NextLink href='/about' passHref>
          <Link>Go to About</Link>
        </NextLink>
        <NextLink href='/clock' passHref>
          <Link>Go to Clock</Link>
        </NextLink>
      </Stack>
    </Flex>
  )
}

export default IndexPage
