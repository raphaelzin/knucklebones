FROM node:19-alpine as base

WORKDIR /app

# We only copy the dependencies we need
COPY libs/shared-models libs/shared-models

COPY backend backend

# The global package.json only contains build dependencies
COPY package.json .
COPY yarn.lock .


RUN yarn workspace @knucklebones/backend install --production
RUN yarn workspace @knucklebones/backend build

FROM node:19-alpine as production

WORKDIR /app
COPY --from=base /app/backend/dist .

CMD [ "node", "app.cjs" ]