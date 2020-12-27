import { NextPage } from 'next'
import NextLink from 'next/link'
import { Flex, Heading, Link, Stack, Box } from '@chakra-ui/react'

import { Publish, Subscribe } from '../components/nats/Nats'
import { NTop } from '../components/nats/NTop'

const IndexPage: NextPage = () => {
  return (
    <Flex flexDirection='column' alignItems='center' margin={4}>
      <Heading as='h1' size='2xl' marginBottom='2rem'>
        NATS.ws - Next.js
      </Heading>

      <Stack direction='row' marginBottom='1rem'>
        <Box p={3} shadow='md' borderRadius='md' borderWidth='1px'>
          <Publish />
        </Box>
        <Box p={3} shadow='md' borderRadius='md' borderWidth='1px'>
          <Subscribe />
        </Box>
      </Stack>
      <NTop />

      <NextLink href='/about' passHref>
        <Link>Go to About</Link>
      </NextLink>
      <NextLink href='/clock' passHref>
        <Link>Go to Clock</Link>
      </NextLink>
    </Flex>
  )
}

export default IndexPage
