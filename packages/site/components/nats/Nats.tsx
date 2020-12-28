import React, { useRef, useEffect, useState, useContext } from 'react'
import useInterval from '@use-it/interval'
import { connect, JSONCodec, NatsConnection, Subscription } from 'nats.ws'
import { Messages } from '../Messages'

export function Publish ({
  topic = 'nats.demo.clock',
  delay = 1000
}: {
  topic?: string
  delay?: number
}): JSX.Element {
  const { nc } = useContext(NatsContext)
  const [messages, setMessages] = useState<Array<{stamp: string}>>([])
  const jc = JSONCodec()

  useInterval(() => {
    const msg = { stamp: new Date().toISOString() }
    setMessages([msg])
    if (nc !== null) {
      nc.publish(topic, jc.encode(msg))
    }
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
  topic = 'nats.demo.clock',
  maxRows = 4
}: {
  topic?: string
  maxRows?: number
}): JSX.Element {
  const [messages, setMessages] = useState<Array<{stamp: string}>>([])
  useSubscribe({ topic, maxRows, messages, setMessages })

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

function useSubscribe ({ topic, maxRows, messages, setMessages }: {
  topic: string
  maxRows: number
  messages: Array<{stamp: string}>
  setMessages: React.Dispatch<React.SetStateAction<Array<{ stamp: string }>>>
}): void {
  const { nc } = useContext(NatsContext)
  const subRef = useRef<Subscription|null>(null)
  const messagesRef = useRef(messages)
  const setMessagesRef = useRef(setMessages)

  useEffect(() => {
    messagesRef.current = messages
    setMessagesRef.current = setMessages
  }, [messages, setMessages])

  useEffect(() => {
    async function subscribeAndConsume (): Promise<void> {
      const jc = JSONCodec()
      // console.log(`Subscribe to: ${topic}`)
      if (nc === null) {
        return
      }
      const sub = nc.subscribe(topic, {})
      subRef.current = sub
      setTimeout(() => {
        (async (): Promise<void> => {
          for await (const m of sub) {
            const jm = jc.decode(m.data)
            // setMessagesRef.current([...messagesRef.current, jm].slice(-maxRows))
            setMessagesRef.current([jm, ...messagesRef.current].slice(0, maxRows))
          }
        })().catch(() => {})
      }, 0)
    }
    subscribeAndConsume().catch(() => {})

    return () => {
      if (subRef.current !== null) {
        console.log(`Unsubscribe from: ${topic}`)
        subRef.current.unsubscribe(0)
      }
    }
  }, [nc, topic, maxRows]) // Make sure the effect runs only once
}

const NatsContext = React.createContext<{nc: NatsConnection|null}>({ nc: null })

export function NatsProvider ({
  wsurl = 'ws://localhost:19222',
  name = 'unnamed',
  children
}: { wsurl?: string, name: string, children: any}): any {
  const [nc, setNc] = useState<NatsConnection|null>(null)
  useEffect(() => {
    let nc
    async function connectToNats (): Promise<void> {
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
    connectToNats().catch(() => {})

    return () => {
      async function cleanup (): Promise<void> {
        console.log(`Disconnect from: ${name}:${wsurl}`)
        if (nc !== undefined && nc !== null) {
          await nc.drain()
          await nc.close()
        }
      }
      cleanup().catch(() => {})
    }
  }, [wsurl, name]) // Make sure the effect runs only once

  return (
    <NatsContext.Provider value={{ nc }}>
      {children}
    </NatsContext.Provider>
  )
}
