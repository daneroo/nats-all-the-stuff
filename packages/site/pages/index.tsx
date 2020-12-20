import { NextPage } from 'next'
import NextLink from 'next/link'
import { Flex, Heading, Link } from '@chakra-ui/react'

const IndexPage: NextPage = () => {
  return (
    <Flex flexDirection='column' alignItems='center' margin={4}>
      <Heading as='h1' size='2xl' marginBottom='2rem'>
        Hello Next.js
      </Heading>
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
