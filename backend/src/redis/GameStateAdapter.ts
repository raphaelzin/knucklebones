import { addMessageToStream, getLastNFromStream } from "./RedisHelper";
import client, { getPublisherClient, getSubscriberClient } from "./redis";
import { GameStateSummary } from "@knucklebones/shared-models";
import { logger } from "../core/logger";

const roomStreamPrefix = "room-stream:";
const channelPrefix = "room-channel";

export const roomAccessors = (code: string) => ({
  stream: `${roomStreamPrefix}${code}`,
  channel: `${channelPrefix}:${code}`
});

export const getRoomState = async (code: string) => {
  return getRoomNLastStates(code, 1);
};

export const getRoomNLastStates = async (code: string, n: number) => {
  const key = `${roomStreamPrefix}${code}`;
  const entries = await getLastNFromStream(key, n, client);

  return entries.map(entry => JSON.parse(entry["state"])) as GameStateSummary[];
};

export const appendRoomState = async (code: string, state: GameStateSummary) => {
  const key = `${roomStreamPrefix}${code}`;
  const result = addMessageToStream(key, { state: JSON.stringify(state) }, getPublisherClient());

  return result;
};

export const subscribeToRoom = async (
  code: string,
  callback: (state: GameStateSummary) => void
) => {
  const key = `${channelPrefix}:${code}`;
  const client = getSubscriberClient();

  await client.subscribe(key, (err, message) => {
    if (err) {
      logger.error("Error subscribing to room channel: ", err);
    } else {
      logger.debug(`Subscribed to room channel ${key}, (${message})})`);
    }
  });

  client.on("message", (channel, message) => {
    if (channel !== key) {
      logger.warn(`[GameStateAdapter] Wrong channel: ${channel}, expected ${key}`);
      return;
    }

    try {
      const state = JSON.parse(message) as GameStateSummary;
      callback(state);
    } catch (e) {
      logger.error(`[GameStateAdapter] Error parsing message: "${message}"\n${e}`);
      return;
    }
  });
};

export const publishNewRoomState = async (code: string, state: GameStateSummary) => {
  const key = `${channelPrefix}:${code}`;
  return await getPublisherClient().publish(key, JSON.stringify(state));
};
