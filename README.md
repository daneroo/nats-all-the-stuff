# Nats All The Stuff

Experiments using [NATS](https://nats.io/), with websocket support, and [Next.js](https://nextjs.org/)

![NATS.ws-Next.js](NATS.ws-Next.js-annotated.gif "NATS.ws-Next.js")

The code is organized as a lerna monorepo.

## Usage

```bash
docker-compose up -d
cd packages/site
npm install
npm run dev  # for live development
# or
npm run build && npm start # for production (like) build
```

## Patterns

- pub/sub
- req/resp
- queueing
- auth

## Languages

- js (node + browser)
- ts (deno + browser/websocket)
- go (| WSAM)
- rust ( | WASM)

## Setup

```bash
lerna init
```
