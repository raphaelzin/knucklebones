FROM node:19-alpine

# Create app directory
WORKDIR /app

RUN npm install -g yarn

COPY ["package.json", "package-lock.json*", "./"]
COPY ["../yarn.lock", "./""]
COPY ["../libs", "./""]

ENV NODE_ENV production
# RUN npm install -g yarn
# RUN yarn install --production
RUN npm install --production

COPY . .
RUN yarn build
CMD [ "node", "dist/app.js" ]