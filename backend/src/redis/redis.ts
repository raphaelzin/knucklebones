import { createClient } from "redis";

const client = createClient({ url: "redis://localhost:6379" });
client.connect();

export default client;
