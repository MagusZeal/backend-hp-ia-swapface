FROM node:14-alpine as base

WORKDIR /usr/src/app

COPY . .

COPY ./.env.example ./.env

RUN npm i

CMD [ "sh", "-c", "npm run start" ]
