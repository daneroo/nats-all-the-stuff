# `site`

This is to bootstrap the 'site" package, which is a next.js/chakra-ui, for local development, deployment and vercel deployment.

## TODO

- trying prettier-standard
- chakra-theme and Nav header

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
# chakra
npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion

    "@chakra-ui/react": "^0.8.0",
    "@emotion/react": "^11.1.2",
    "@emotion/styled": "^11.0.0",
    "emotion-theming": "^11.0.0",

# the setup pages/_app.tsx
```

### lerna setup

```bash
lerna create --private --license MIT --description 'Next.js/Chakra/Nats/Websocket demo' site
```
