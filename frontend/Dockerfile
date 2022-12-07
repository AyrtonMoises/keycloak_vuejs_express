FROM node:alpine

WORKDIR /app

RUN npm config set unsafe-perm true

COPY package.json .
RUN npm install

RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache


CMD ["npm", "run", "serve"]