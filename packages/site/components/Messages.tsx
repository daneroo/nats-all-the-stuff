import { Table, Thead, Tbody, Tr, Th, Td, TableCaption } from '@chakra-ui/react'
import React from 'react'
import { df } from './df'

export function Messages ({
  title,
  header,
  messages
}: {
  title: string
  header: string[]
  messages: Array<{stamp: string}>
}): JSX.Element {
  const rows = messages.map(msg => {
    const { stamp } = msg
    const row = [df(stamp, 'HH:mm:ss')]
    return row
  })

  return (
    <Table minWidth='20rem' variant='simple' size='sm'>
      <TableCaption placement='top'>{title}</TableCaption>
      <Thead>
        <Tr>
          {header.map((h, i) => (
            <Th key={i}>{h}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        <Rows rows={rows} />
      </Tbody>
    </Table>
  )
}

function Rows ({ rows }): JSX.Element {
  return rows.map((row, r) => {
    return (
      <Tr key={r}>
        {row.map((c, i) => (
          <Td key={i}>{c}</Td>
        ))}
      </Tr>
    )
  })
}
