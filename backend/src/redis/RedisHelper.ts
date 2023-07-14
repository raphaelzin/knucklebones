import { Redis } from "ioredis";

export const getLastNFromStream = async (
  stream: string,
  n: number,
  client: Redis
) => {
  const entries = await client.xrevrange(stream, "+", "-", "COUNT", n);
  return entries.map(entry => parseStreamEntry(entry));
};

export const addMessageToStream = async (
  stream: string,
  message: Record<string, string>,
  client: Redis
) => {
  const result = await client.xadd(stream, "*", "state", JSON.stringify(message) , () => {
    return;
  });
  return result;
};


interface StreamEntry {
  id: string;
}

const parseStreamEntry = (entry: [id: string, fields: string[]]) => {
  let parsed: StreamEntry = {
    id: entry[0]
  }

  for (let i = 0; i < entry[1].length/2; i++) {
    const field = entry[1][i*2];
    const value = entry[1][i*2 + 1];
    parsed[field] = value;
  }
  return parsed;
}
