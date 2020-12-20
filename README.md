# Nats All The Stuff

Combined experiments around [nats](https://nats.io/), with websocket support

This is a lerna monorepo.

## TODO

- lerna setup
- next.js + chakra 
- nats.ws
- docker-compose + e2e

## Patterns

- auth
- pub/sub
- req/resp
- queueing

## Languages

- js (node + browser)
- ts (deno + browser/websocket)
- go (| WSAM)
- rust ( | WASM)

## Setup

This is to bootstrap the 'site" package, which is a next.js/chakra-ui, for local development, deployment and vercel deployment.

```bash
lerna init
lerna create --private --license MIT --description '"Next.js/Chakra/Nats/Websocket demo"' site
```
