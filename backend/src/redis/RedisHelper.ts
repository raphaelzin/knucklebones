export const getLastNFromStream = async <T>(stream: string, n: number, unwrap: (message: Record<string, string>) => T, client) => {
  const last = await client.xrevrange(stream, "+", "-", { COUNT: n });
  return last.map(entry => unwrap(entry.message));
};

export const addMessageToStream = async (stream: string, message: Record<string, string>, client) => {
  const result = await client.xadd(stream, "*", message);
  return result;
};
