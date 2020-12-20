import { NextPage } from 'next'
import NextLink from 'next/link'
import { Flex, Heading, Link, SimpleGrid, Text } from '@chakra-ui/react'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(res => res.json())

const ClockPage: NextPage = () => {
  const { data, error } = useSWR(`/api/clock`, fetcher, {
    refreshInterval: 100
  })
  const content = error ? error.message : !data ? 'Loading' : data.stamp
  return (
    <Flex flexDirection='column' alignItems='center' margin={4}>
      <Heading as='h1' size='2xl' marginBottom='2rem'>
        Clock
      </Heading>
      <NextLink href='/' passHref>
        <Link>Go Home</Link>
      </NextLink>
      <SimpleGrid columns={2} width='large'>
        <Text fontWeight='bold' marginRight={4} align='right'>
          Current Time
        </Text>
        <Text>{content}</Text>
      </SimpleGrid>
    </Flex>
  )
}

export default ClockPage
