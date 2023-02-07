import { randomUUID } from "crypto";
import { GameRoom } from "../models/GameRoom/GameRoom";
import murmurhash from "murmurhash";

// const client = createClient({
//   url: "",
// });

// const RoomStateStream = (code: string) => `room-stream-state-${code}`;
// const StreamRoom = (code: string) => `room-stream-${code}`;
// const PubSubRoom = (code: string) => `room-pubsub-${code}`;

// Generates a RoomSummary cache key from a code.
// const RoomSummaryKey = (code: string) => `room-summary-${code}`;

// export interface RoomSummary {
//   stateSummary: GameStateSummary;
//   rules: "default";
//   code: string;
// }

// const StreamStartEvent = (code: string) => {
//   return `room ${code} created at ${new Date()}`;
// };

// const addStreamEntry = async (
//   entry: Record<string, string>,
//   streamId: string,
//   createOnMiss = false
// ) => {
//   return await client.xAdd(streamId, "*", entry, {
//     NOMKSTREAM: createOnMiss ? true : undefined,
//   });
// };

const rooms: GameRoom[] = [];

export const getRoom = async (code: string): Promise<GameRoom> => {
  //   const streamId = RoomStateStream(code);
  //   if ((await client.exists(streamId)) !== 1) {
  //     throw "room not found";
  //   }

  const room = rooms.filter((room) => room.code === code)[0];
  if (!room) throw `room with code ${code} not found`;

  return room;
};

export const createRoom = async () => {
  const code = murmurhash.v3(randomUUID());
  // const streamId = RoomStateStream(code);
  // const startEvent = { event: StreamStartEvent(code) };
  // await addStreamEntry(startEvent, streamId, true);

  const newRoom = new GameRoom(`${code}`);
  rooms.push(newRoom);
  return newRoom;
};

export const requestPlayerTicket = async (code: string, nickname: string) => {
  const room = await getRoom(code);
  return room.registerPlayer(nickname);
};
