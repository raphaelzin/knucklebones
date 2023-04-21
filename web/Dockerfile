FROM node:19-alpine as base

WORKDIR /app

RUN npm install --global serve

# We only copy the dependencies we need
COPY libs/shared-models libs/shared-models

COPY web web

# The global package.json only contains build dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn workspace @knucklebones/web install --production
RUN yarn workspace @knucklebones/web build

CMD ["serve", "-s", "web/build", "-d"]