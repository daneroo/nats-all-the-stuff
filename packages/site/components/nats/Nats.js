import React, { useRef, useEffect, useState } from 'react'
import useInterval from '@use-it/interval'
import { connect, JSONCodec } from 'nats.ws'
import { df } from '../df'

// Currently: connect, publish, drain, close
export function Publish ({
  wsurl = 'ws://localhost:9229',
  topic = 'nats.demo.clock',
  delay = 1000
}) {
  const [messages, setMessages] = useState([])
  useInterval(() => {
    const msg = { stamp: new Date().toISOString() }
    setMessages([msg])

    async function doAsync () {
      console.log(`Connect to: ${wsurl}`)
      const nc = await connect({
        servers: wsurl,
        pendingLimit: 8192
      })

      const jc = JSONCodec()
      console.log(`Publish to: ${topic}`)
      nc.publish(topic, jc.encode(msg))
      await nc.drain()
      nc.close()
    }
    doAsync()
  }, delay)
  return (
    <div>
      <div>Publish ({wsurl})</div>
      <MessagesLayout messages={messages} maxRows={1} />
    </div>
  )
}

export function Subscribe ({
  wsurl = 'ws://localhost:9229',
  topic = 'nats.demo.clock',
  maxRows = 4
}) {
  const [messages, setMessages] = useState([])
  useSubscribe({ wsurl, topic, maxRows, messages, setMessages })

  return (
    <div>
      <div>Subscribe ({wsurl})</div>
      {/* <pre>{JSON.stringify({ messages }, null, 2)}</pre> */}
      <MessagesLayout messages={messages} maxRows={maxRows} />
    </div>
  )
}

function useSubscribe ({ wsurl, topic, maxRows, messages, setMessages }) {
  const ncRef = useRef(null)
  const subRef = useRef(null)
  const messagesRef = useRef(messages)
  const setMessagesRef = useRef(setMessages)

  useEffect(() => {
    messagesRef.current = messages
    setMessagesRef.current = setMessages
  }, [messages, setMessages])

  useEffect(() => {
    async function connectToNats () {
      console.log(`Connect to: ${wsurl}`)
      const nc = await connect({
        servers: wsurl,
        pendingLimit: 8192
      })
      ncRef.current = nc

      const jc = JSONCodec()
      console.log(`Subscribe to: ${topic}`)
      const sub = nc.subscribe(topic, {})
      subRef.current = sub
      setTimeout(async () => {
        for await (const m of sub) {
          const jm = jc.decode(m.data)
          // setMessagesRef.current([...messagesRef.current, jm].slice(-maxRows))
          setMessagesRef.current([jm, ...messagesRef.current].slice(0, maxRows))
        }
      }, 0)
    }
    connectToNats()

    return () => {
      console.log(`Unsubscribe from: ${topic}`)
      subRef.current.unsubscribe(0)

      console.log(`Disconnect from: ${wsurl}`)
      ncRef.current.close()
    }
  }, [wsurl, topic, maxRows]) // Make sure the effect runs only once
}

function MessagesLayout ({ messages, maxRows = 0 }) {
  if (!messages) return <p>---</p>

  const header = ['stamp']
  const rows = [
    header,
    ...messages
      .map(msg => {
        // const { stamp, host, text } = msg
        // const row = [df(stamp, 'HH:mm:ss'), host, text]
        const { stamp } = msg
        const row = [df(stamp, 'HH:mm:ss')]
        return row
      })
      .slice(-maxRows)
  ]

  const gridCSS = {
    display: 'grid',
    columnGap: '1em',
    gridTemplateColumns: `repeat(${header.length}, auto)`
  }
  return (
    <div style={gridCSS}>
      <Rows rows={rows} />
    </div>
  )
}

// using theme-ui and sx...
function Rows ({ rows }) {
  return rows.map((row, r) => {
    const sx = r
      ? { fontFamily: 'monospace' }
      : { color: 'primary', fontWeight: 'bold' }
    const rk = row[0]
    return row.map((c, i) => (
      <span sx={sx} key={rk + '-' + i}>
        {c}
      </span>
    ))
  })
}
