import React from 'react'
import useSWR from 'swr'
import { fetcher } from '../../components/fetcher'
import {
  Stat, StatLabel, StatNumber, StatHelpText, StatGroup, // StatArrow,
  Box, Heading,
  Table, Thead, Tbody, Tr, Th, Td, TableCaption
} from '@chakra-ui/react'
import { df } from '../df'

// use the local proxy to bypass cors
// ?subs=1 -> get subscriptions

export function NTop (): FC {
  return (
    <Box p={3} shadow='md' borderRadius='md' borderWidth='1px'>
      <VarZ />
      <ConnZ />
    </Box>
  )
}

function ConnZ ({ httpUrl = 'http://localhost:18222/connz?subs=1', delay = 1000 }): FC {
  const { data, error } = useSWR<any, Error>(httpUrl, fetcher, {
    refreshInterval: delay,
    dedupingInterval: 100 // default os 2000
  })
  // const content = error !== null ? error.message : data === null ? 'Loading' : data.stamp
  if (error !== null && error !== undefined) {
    return <pre>Error: {error.message}</pre>
  }
  if (data === null || data === undefined) {
    return <pre>Loading...</pre>
  }

  const connections = data.connections.map((row) => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const {
      cid,
      ip,
      // port,
      // start,
      last_activity,
      // rtt,
      uptime,
      // idle,
      // pending_bytes,
      in_msgs,
      out_msgs,
      in_bytes,
      out_bytes,
      // subscriptions,
      name,
      lang,
      version,
      subscriptions_list
    } = row
    const subs = (Array.isArray(subscriptions_list)) ? subscriptions_list.join(',') : ''
    /* eslint-enable @typescript-eslint/naming-convention */
    return (
      <Tr key={cid}>
        <Td>{ip}</Td>
        <Td>{name} </Td>
        <Td>{printSize(out_msgs)} </Td>
        <Td>{printSize(in_msgs)} </Td>
        <Td>{printSize(out_bytes)} </Td>
        <Td>{printSize(in_bytes)} </Td>
        <Td>{lang}:{version} </Td>
        <Td>{uptime} </Td>
        <Td>{df(last_activity, 'HH:mm:ss')} </Td>
        <Td>{subs} </Td>
      </Tr>
    )
  })
  const header = ['host', 'name', 'Msgs To', 'Msgs From', 'Bytes To', 'Bytes From', 'lang@ver', 'uptime', 'last', 'subs']
  return (
    <Table minWidth='20rem' variant='simple' size='sm'>
      <TableCaption placement='top'>Connections</TableCaption>
      <Thead>
        <Tr>
          {header.map((h, i) => (
            <Th key={i}>{h}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {connections}
      </Tbody>
    </Table>
  )
}

function VarZ ({ httpUrl = 'http://localhost:18222/varz', delay = 3000 }): FC {
  const { data, error } = useSWR<any, Error>(httpUrl, fetcher, {
    refreshInterval: delay,
    dedupingInterval: 100 // default os 2000
  })
  // const content = error !== null ? error.message : data === null ? 'Loading' : data.stamp
  if (error !== null && error !== undefined) {
    return <pre>Error: {error.message}</pre>
  }
  if (data === null || data === undefined) {
    return <pre>Loading...</pre>
  }

  const {
    version, uptime, cpu, mem,
    in_msgs, out_msgs, in_bytes, out_bytes // eslint-disable-line @typescript-eslint/naming-convention
  } = data
  return (
    <>
      <Heading as='h2' size='xs'>
        NATS Server v{version} (uptime: {uptime})
      </Heading>
      <StatGroup>
        <Stat>
          <StatLabel>CPU Load</StatLabel>
          <StatNumber>{cpu}%</StatNumber>
          <StatHelpText>
            Memory: {printSize(mem)}
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>In Msgs</StatLabel>
          <StatNumber>{printSize(in_msgs)}</StatNumber>
          <StatHelpText>
            Msgs/Sec: --
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>In Bytes</StatLabel>
          <StatNumber>{printSize(in_bytes)}</StatNumber>
          <StatHelpText>
            Bytes/Sec: --
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Out Msgs</StatLabel>
          <StatNumber>{printSize(out_msgs)}</StatNumber>
          <StatHelpText>
            Msgs/Sec: --
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Out Bytes</StatLabel>
          <StatNumber>{printSize(out_bytes)}</StatNumber>
          <StatHelpText>
            Bytes/Sec: --
          </StatHelpText>
        </Stat>
      </StatGroup>
    </>
  )
}

function printSize (size: number): string {
  size = Number.parseFloat(size)
  if (size < 1024) {
    return size.toFixed(0)
  } else if (size < (1024 * 1024)) {
    return (size / 1024).toFixed(1) + 'K'
  } else if (size < (1024 * 1024 * 1024)) {
    return (size / 1024 / 1024).toFixed(1) + 'M'
  } else if (size >= (1024 * 1024 * 1024)) {
    return (size / 1024 / 1024 / 1024).toFixed(1) + 'G'
  } else {
    return 'NA'
  }
}
