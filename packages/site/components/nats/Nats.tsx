import React, { useRef, useEffect, useState, useContext, FC } from 'react'
import useInterval from '@use-it/interval'
import { connect, JSONCodec } from 'nats.ws'
import { Messages } from '../Messages'

export function Publish ({
  topic = 'nats.demo.clock',
  delay = 1000
}): FC {
  const { nc } = useContext(NatsContext)
  const [messages, setMessages] = useState([])
  const jc = JSONCodec()
  useInterval(() => {
    const msg = { stamp: new Date().toISOString() }
    setMessages([msg])

    nc.publish(topic, jc.encode(msg))
  }, delay)
  if (nc === null || nc === undefined) {
    return <div>Connecting...</div>
  }
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
  wsurl = 'ws://localhost:19222',
  topic = 'nats.demo.clock',
  maxRows = 4
}): FC {
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

function useSubscribe ({ topic, maxRows, messages, setMessages }: { wsurl: string, topic: string, maxRows: number}): void {
  const { nc } = useContext(NatsContext)
  const subRef = useRef(null)
  const messagesRef = useRef(messages)
  const setMessagesRef = useRef(setMessages)

  useEffect(() => {
    messagesRef.current = messages
    setMessagesRef.current = setMessages
  }, [messages, setMessages])

  useEffect(() => {
    async function subscribeAndConsume (): void {
      const jc = JSONCodec()
      // console.log(`Subscribe to: ${topic}`)
      if (nc === null) {
        return
      }
      const sub = nc.subscribe(topic, {})
      subRef.current = sub
      setTimeout(() => {
        (async (): void => {
          for await (const m of sub) {
            const jm = jc.decode(m.data)
            // setMessagesRef.current([...messagesRef.current, jm].slice(-maxRows))
            setMessagesRef.current([jm, ...messagesRef.current].slice(0, maxRows))
          }
        })()
      }, 0)
    }
    subscribeAndConsume()

    return () => {
      if (subRef.current !== null) {
        console.log(`Unsubscribe from: ${topic}`)
        subRef.current.unsubscribe(0)
      }
    }
  }, [nc, topic, maxRows]) // Make sure the effect runs only once
}

const NatsContext = React.createContext()

export function NatsProvider ({
  wsurl = 'ws://localhost:19222',
  name = 'unnamed', children
}: { wsurl: string, name: string}): FC {
  const [nc, setNc] = useState(null)
  useEffect(() => {
    let nc
    async function connectToNats (): void {
      console.log(`Connect to: ${name}:${wsurl}`)
      nc = await connect({
        servers: wsurl,
        name,
        // pendingLimit: 8192, // not sure, came from a demo
        waitOnFirstConnect: true,
        maxReconnectAttempts: -1 // no limit
      })
      setNc(nc)
      console.log(`Connected to: ${name}:${wsurl}`)
    }
    connectToNats()

    return async () => {
      console.log(`Disconnect from: ${name}:${wsurl}`)
      if (nc !== undefined && nc !== null) {
        await nc.drain()
        await nc.close()
      }
    }
  }, [wsurl, name]) // Make sure the effect runs only once

  return (
    <NatsContext.Provider value={{ nc }}>
      {children}
    </NatsContext.Provider>
  )
}
