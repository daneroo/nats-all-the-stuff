import { useState } from 'react'
import useInterval from '@use-it/interval'
import { NextPage } from 'next'
import NextLink from 'next/link'
import { Flex, Heading, Link, SimpleGrid, Text } from '@chakra-ui/react'
import useSWR from 'swr'
import { fetcher } from '../components/fetcher'

const ClockPage: NextPage = () => {
  const delay = 1000
  const [browserStamp, setBrowserStamp] = useState(new Date().toISOString())
  useInterval(() => {
    const stamp = new Date(Math.round(+new Date() / 100) * 100).toISOString()
    setBrowserStamp(stamp)
  }, delay)
  const { data, error } = useSWR<{stamp: string}, Error>('/api/clock', fetcher, {
    refreshInterval: delay,
    dedupingInterval: 100 // default os 2000
  })
  const content = error !== null ? error.message : data === null ? 'Loading' : data.stamp
  return (
    <Flex flexDirection='column' alignItems='center' margin={4}>
      <Heading as='h1' size='2xl' marginBottom='2rem'>
        Clock - Current Time
      </Heading>
      <NextLink href='/' passHref>
        <Link>Go Home</Link>
      </NextLink>
      <SimpleGrid columns={2} width='large'>
        <Text fontWeight='bold' marginRight={4} align='right'>
          From Browser
        </Text>
        <Text>{browserStamp}</Text>
        <Text fontWeight='bold' marginRight={4} align='right'>
          From API (/api/clock)
        </Text>
        <Text>{content}</Text>
      </SimpleGrid>
    </Flex>
  )
}

export default ClockPage
