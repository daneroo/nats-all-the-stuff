import React, { useRef, useEffect, useState } from 'react'
import useInterval from '@use-it/interval'
import { connect, JSONCodec } from 'nats.ws'
import { Messages } from '../Messages'
import useSWR from 'swr'
import { fetcher } from '../../components/fetcher'

// use the local proxy to bypass cors
// ?subs=1 -> get subscriptions
export function NTop ({ httpUrl = 'http://localhost:18222/connz?subs=1', delay = 2000 }): FC {
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

  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

// Currently: connect, publish, drain, close
export function Publish ({
  wsurl = 'ws://localhost:19222',
  topic = 'nats.demo.clock',
  delay = 1000
}): FC {
  const [messages, setMessages] = useState([])
  useInterval(() => {
    const msg = { stamp: new Date().toISOString() }
    setMessages([msg])

    async function doAsync (): void {
      // console.log(`Connect to: ${wsurl}`)
      const nc = await connect({
        servers: wsurl,
        name: 'demo.pub',
        pendingLimit: 8192
      })

      const jc = JSONCodec()
      // console.log(`Publish to: ${topic}`)
      nc.publish(topic, jc.encode(msg))
      await nc.drain()
      await nc.close()
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

function useSubscribe ({ wsurl, topic, maxRows, messages, setMessages }: { wsurl: string, topic: string, maxRows: number}): void {
  const ncRef = useRef(null)
  const subRef = useRef(null)
  const messagesRef = useRef(messages)
  const setMessagesRef = useRef(setMessages)

  useEffect(() => {
    messagesRef.current = messages
    setMessagesRef.current = setMessages
  }, [messages, setMessages])

  useEffect(() => {
    async function connectToNats (): void {
      // console.log(`Connect to: ${wsurl}`)
      const nc = await connect({
        servers: wsurl,
        name: 'demo.sub',
        pendingLimit: 8192
      })
      ncRef.current = nc

      const jc = JSONCodec()
      // console.log(`Subscribe to: ${topic}`)
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
    connectToNats()

    return () => {
      console.log(`Unsubscribe from: ${topic}`)
      subRef.current.unsubscribe(0)

      console.log(`Disconnect from: ${wsurl}`)
      ncRef.current.close()
    }
  }, [wsurl, topic, maxRows]) // Make sure the effect runs only once
}
