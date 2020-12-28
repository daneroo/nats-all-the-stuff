import React, { useRef, useEffect, useState, useContext, useReducer, FC } from 'react'
import useInterval from '@use-it/interval'
import { connect, JSONCodec, NatsConnection, Subscription } from 'nats.ws'
import { Messages } from '../Messages'

interface PublishProps {
  name: string
  topic?: string
  delay?: number
}

export const Publish: FC<PublishProps> = ({
  name = 'Publisher',
  topic = 'nats.demo.clock',
  delay = 1000
}) => {
  const { nc } = useContext(NatsContext)
  const [messages, setMessages] = useState<Array<{ stamp: string }>>([])
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
        title={`${name} (${topic})`}
        header={['stamp']}
        messages={messages}
      />
    </div>
  )
}

interface SubscribeProps {
  name: string
  topic?: string
  maxRows?: number
}

export const Subscribe: FC<SubscribeProps> = ({
  name = 'Subscriber',
  topic = 'nats.demo.clock',
  maxRows = 4
}) => {
  function accumulatingReducer (messages: Array<{ stamp: string }>, msg: { stamp: string }): Array<{ stamp: string }> {
    return [msg, ...messages].slice(0, maxRows)
  }
  const [messages, dispatch] = useReducer(accumulatingReducer, [])
  useSubscribe({ topic, dispatch })

  return (
    <div>
      <Messages
        title={`${name} (${topic})`}
        header={['stamp']}
        messages={messages}
      />
    </div>
  )
}

interface useSubscribeProps {
  topic: string
  dispatch: React.Dispatch<{ stamp: string }>
}

function useSubscribe ({ topic, dispatch }: useSubscribeProps): void {
  const { nc } = useContext(NatsContext)
  const subRef = useRef<Subscription | null>(null)

  async function consumeUntilDone (sub, dispatch): Promise<void> {
    const jc = JSONCodec()
    for await (const m of sub) {
      const msg = jc.decode(m.data)
      dispatch(msg)
    }
  }

  useEffect(() => {
    // Check if the connection is in a state to add a subscription
    //  if not: early return
    if (nc === null || nc.isClosed() || nc.isDraining()) {
      // if (nc === null) {
      //   console.log('early abort, nc is null')
      // } else if (nc.isClosed()) {
      //   console.log('early abort, nc is closed')
      // } else if (nc.isDraining()) {
      //   console.log('early abort, nc is draining')
      // }
      return
    }

    // console.log(`Subscribe to: ${topic}`)
    const sub = nc.subscribe(topic, {})

    // keep the reference for the cleanup function
    subRef.current = sub
    consumeUntilDone(sub, dispatch).catch(() => { })

    // This is the cleanup function
    return () => {
      if (subRef.current !== null) {
        console.log(`Unsubscribe from: ${topic}`)
        subRef.current.unsubscribe(0)
        subRef.current = null
      }
    }
  }, [nc, topic]) // Make sure the effect runs only once
}

const NatsContext = React.createContext<{ nc: NatsConnection | null }>({ nc: null })

interface NatsProviderProps {
  wsurl?: string
  name?: string
  // children?: React.ReactNode
}

export const NatsProvider: FC<NatsProviderProps> = ({
  wsurl = 'ws://localhost:19222',
  name = 'unnamed',
  children
}) => {
  const [nc, setNc] = useState<NatsConnection | null>(null)
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
    connectToNats().catch(() => { })

    return () => {
      async function cleanup (): Promise<void> {
        console.log(`Disconnect from: ${name}:${wsurl}`)
        if (nc !== undefined && nc !== null) {
          await nc.drain()
          await nc.close()
        }
      }
      cleanup().catch(() => { })
    }
  }, [wsurl, name]) // Make sure the effect runs only once

  return (
    <NatsContext.Provider value={{ nc }}>
      {children}
    </NatsContext.Provider>
  )
}
