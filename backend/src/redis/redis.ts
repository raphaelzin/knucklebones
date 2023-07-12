import Redis from "ioredis";

const client = new Redis("redis://localhost:6379");

export default client;

let cachedPublishingClient: Redis = undefined;
export const publishingClient = () => {
  if (cachedPublishingClient) return cachedPublishingClient;

  const client = new Redis("redis://localhost:6379");
  cachedPublishingClient = client;
  return client;
};
