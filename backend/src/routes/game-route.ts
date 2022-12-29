import { Server as WebSocketServer } from "socket.io";
import express, { Request, Response } from "express";
import { GameRoom } from "../models/GameRoom/GameRoom";

export const router = express.Router();
router.use(express.json());

const rooms: GameRoom[] = [];
let counter = 0;

router.post("/create-game", async (req: Request, res: Response) => {
  if (!req.params) {
    res.statusCode = 404;
    return;
  }

  const newRoomCode = `${counter}`;
  rooms.push(new GameRoom(newRoomCode));
  counter += 1;

  res.statusCode = 200;
  res.send(`${newRoomCode} :)`);
});

const io = new WebSocketServer(4444);

io.of("/game/play").on("connection", (socket) => {
  const { roomCode, nickname, token } = socket.handshake.query;

  if (!roomCode || !nickname) {
    socket.emit("bye-bye", "Room code or nickname missing.");
    socket.disconnect(true);
    return;
  }

  const room = getRoom(roomCode as string);
  if (!room) {
    socket.emit("bye-bye", `No room with code ${roomCode}.`);
    socket.disconnect(true);
    return;
  }

  try {
    room.enterGame(socket, nickname as string, token as string | undefined);
  } catch (error) {
    socket.emit("bye-bye", error);
    socket.disconnect(true);
  }
});

io.of("/game/watch").on("connection", (socket) => {
  const { roomCode } = socket.handshake.query;

  if (!roomCode) {
    socket.emit("bye-bye", "Room code or nickname missing.");
    socket.disconnect(true);
    return;
  }

  const room = getRoom(roomCode as string);
  if (!room) {
    socket.emit("bye-bye", "No room with that code.");
    socket.disconnect(true);
    return;
  }

  room.spectateGame(socket);
});

const getRoom = (code: string): GameRoom => {
  // TODO: Get channel on Redis

  for (const room of rooms) {
    if (room.code == code) return room;
  }
  return undefined;
};
