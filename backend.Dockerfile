FROM node:19-alpine

# Backend Dockerfile
FROM node:14
WORKDIR /app

COPY backend/package*.json ./

RUN npm install

COPY backend/ .
COPY shared-models/ ../shared-models/
CMD ["npm", "start"]