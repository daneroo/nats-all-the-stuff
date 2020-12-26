import { NextPage } from 'next'
import NextLink from 'next/link'
import { Flex, Heading, Link } from '@chakra-ui/react'
import { Publish, Subscribe, NTop } from '../components/nats/Nats'

const IndexPage: NextPage = () => {
  return (
    <Flex flexDirection='column' alignItems='center' margin={4}>
      <Heading as='h1' size='2xl' marginBottom='2rem'>
        NATS.ws Example
      </Heading>

      <Publish />
      <Subscribe />
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
