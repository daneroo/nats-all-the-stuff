# `site`

This is to bootstrap the 'site" package, which is a next.js/chakra-ui, for local development, deployment and vercel deployment.

## TODO

- prettier/eslint - vs standard

## Usage

```bash
npm run dev
```

## Setup

I am using [this egghead short course](https://next.egghead.io/lessons/react-initialize-a-next-js-9-project-with-typescript) for instructions
### next,js bootstrap

```bash
npm i next react react-dom
npm i -D typescript @types/react @types/react-dom @types/node
```

### lerna setup

```bash
lerna create --private --license MIT --description 'Next.js/Chakra/Nats/Websocket demo' site
```
