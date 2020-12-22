import React, { useRef, useEffect, useState } from 'react'
import useInterval from '@use-it/interval'
import { connect, JSONCodec } from 'nats.ws'
import { Messages } from '../Messages'
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
      // console.log(`Connect to: ${wsurl}`)
      const nc = await connect({
        servers: wsurl,
        pendingLimit: 8192
      })

      const jc = JSONCodec()
      // console.log(`Publish to: ${topic}`)
      nc.publish(topic, jc.encode(msg))
      await nc.drain()
      nc.close()
    }
    doAsync()
  }, delay)
  return (
    <div>
      <Messages
        title={`Publish (${topic})`}
        header={['stamp']}
        messages={messages}
      />
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
      <Messages
        title={`Subscribe (${topic})`}
        header={['stamp']}
        messages={messages}
      />
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
      // console.log(`Connect to: ${wsurl}`)
      const nc = await connect({
        servers: wsurl,
        pendingLimit: 8192
      })
      ncRef.current = nc

      const jc = JSONCodec()
      // console.log(`Subscribe to: ${topic}`)
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
