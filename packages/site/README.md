# `site`

This is to bootstrap the 'site" package, which is a next.js/chakra-ui, for local development, deployment and vercel deployment.

## TODO

- screen captures of setup (asciinema), and working app (gif)
- Replace lcp proxy with API routes?
- Parametrize table type for chakra table, use for ConnZ and Messages
- integrate dotenv (for wsurl,topic?)
- Clone Chakra docs for mdx+header..
- remove moment in favor of date-fns
- [NATS acronym](https://docs.nats.io/faq#what-does-the-nats-acronym-stand-for)
  - NATS stands for Neural Autonomic Transport System

## Usage

```bash
(cd ..; docker-compose up -d)
npm run dev
```

## Setup

I am using [this egghead short course](https://next.egghead.io/lessons/react-initialize-a-next-js-9-project-with-typescript) for instructions

## using nats.ws

```bash
npm i nats.ws
```

### next,js bootstrap

```bash
npm i next react react-dom
npm i -D typescript @types/react @types/react-dom @types/node
# chakra
npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
# See the setup pages/_app.tsx and pages/_document.tsx to fix Lighthouse issues - html-lang and head.title
```

### lerna setup

```bash
lerna create --private --license MIT --description 'Next.js/Chakra/Nats/Websocket demo' site
```
