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

# Production stage
FROM node:19-alpine

WORKDIR /app
RUN npm install --global serve
# Copy the built dist folder from the previous stage
COPY --from=base /app/web/dist /app/dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-d"]