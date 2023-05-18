import { randomUUID } from "crypto";
import { GameRoom } from "../models/GameRoom/GameRoom";
import murmurhash from "murmurhash";

const rooms: GameRoom[] = [];

export const getRoom = async (code: string): Promise<GameRoom> => {
  const room = rooms.filter((room) => room.code === code)[0];
  if (!room) throw `room with code ${code} not found`;

  return room;
};

export const createRoom = async () => {
  const code = murmurhash.v3(randomUUID());

  const newRoom = new GameRoom(`${code}`);
  rooms.push(newRoom);
  return newRoom;
};

export const requestPlayerTicket = async (code: string, nickname: string) => {
  const room = await getRoom(code);
  return room.registerPlayer(nickname);
};
