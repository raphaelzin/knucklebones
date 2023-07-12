import pino from "pino";
import { addMessageToStream, getLastNFromStream } from "./RedisHelper";
import client from "./redis";
import { GameStateSummary } from "@knucklebones/shared-models";

const logger = pino();
const roomStreamPrefix = "room-stream:";
const channelPrefix = "room-channel";

export const roomAccessors = (code: string) => ({
  stream: `${roomStreamPrefix}${code}`,
  channel: `${channelPrefix}:${code}`
});

export const getRoomState = async (code: string) => {
  const key = `${roomStreamPrefix}${code}`;
  const state = await getLastNFromStream<GameStateSummary>(key, 1, message => JSON.parse(message["state"]), client);

  return state;
};

export const appendRoomState = async (code: string, state: GameStateSummary) => {
  const key = `${roomStreamPrefix}${code}`;
  const result = addMessageToStream(key, { state: JSON.stringify(state) }, client);

  return result;
};

export const subscribeToRoom = async (code: string, callback: (message: string) => void) => {
  const key = `${channelPrefix}:${code}`;

  await client.subscribe(key, (err, message) => {
    if (err) {
      logger.error("Error subscribing to room channel: ", err);
    }
    callback(message as string);
  });
};

export const publishNewRoomState = async (code: string, state: GameStateSummary) => {
  const key = `${channelPrefix}:${code}`;
  const result = await client.publish(key, JSON.stringify({ state }));
  return result;
};
