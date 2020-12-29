# FROM node:lts-alpine
FROM node:14-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock*.json /usr/src/app/
RUN npm ci
COPY . /usr/src/app

# Default port
EXPOSE 3000

# TODO(daneroo): ensure quick start stop with signal handling/tini/explist command
CMD [ "npm", "start" ]
