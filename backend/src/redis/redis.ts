import Redis from "ioredis";

const client = new Redis("redis://localhost:6379");

export default client;

let cachedPublisherClient: Redis = undefined;
let cachedSubscriberClient: Redis = undefined;

export const getSubscriberClient = () => {
  if (cachedSubscriberClient) return cachedSubscriberClient;
  cachedSubscriberClient = client.duplicate();
  return cachedSubscriberClient;
};

export const getPublisherClient = () => {
  if (cachedPublisherClient) return cachedPublisherClient;
  cachedPublisherClient = client.duplicate();
  return cachedPublisherClient;
};
