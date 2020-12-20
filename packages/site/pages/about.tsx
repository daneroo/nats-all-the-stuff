import { NextPage } from 'next'
import NextLink from 'next/link'
import { Flex, Heading, Link } from '@chakra-ui/react'

const AboutPage: NextPage = () => {
  return (
    <Flex flexDirection='column' alignItems='center' margin={4}>
      <Heading as='h1' size='2xl' marginBottom='2rem'>
        About Next.js
      </Heading>
      <NextLink href='/' passHref>
        <Link>Go Home</Link>
      </NextLink>
    </Flex>
  )
}

export default AboutPage
