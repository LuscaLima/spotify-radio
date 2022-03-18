FROM node:17-slim

RUN apt-get update && apt-get install sox libsox-fmt-all -y

WORKDIR /spotify-radio/

COPY package.json package-lock.json /spotify-radio/

RUN npm ci --silent

COPY . .

USER node

CMD npm run dev
