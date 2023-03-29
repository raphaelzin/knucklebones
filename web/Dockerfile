FROM node:19-alpine as base

WORKDIR /app

# We only copy the dependencies we need
COPY libs/shared-models libs/shared-models

COPY web web

# The global package.json only contains build dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn workspace @knucklebones/web install --production
RUN yarn workspace @knucklebones/web build

# FROM node:19-alpine as production

# WORKDIR /app
# COPY --from=base /app/web/build .

# CMD [ "yarn", "start" ]

# production env
FROM nginx:stable-alpine

COPY --from=base /app/web/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]