import { Server as WebSocketServer } from "socket.io";
import express, { Request, Response } from "express";
import {
  createRoom,
  getRoom,
  requestPlayerTicket,
} from "../controllers/RoomService";
import { GameRoom } from "../models/GameRoom/GameRoom";
import { RoomJoinResponse } from "@knucklebones/shared-models/src/RemoteResponses";

export const router = express.Router();

router.post("/create-game", async (req: Request, res: Response) => {
  const { nickname } = req.body;

  if (!req.params || !nickname) {
    res.statusCode = 400;
    res.send({ code: "Nope" });
    return;
  }

  let newRoom: GameRoom;
  let playerTicket: { id: string; token: string };
  try {
    newRoom = await createRoom();
    playerTicket = await requestPlayerTicket(newRoom.code, nickname);
  } catch (error) {
    res.statusCode = error.code ?? 500;
    res.send({ error, code: error.code });
    return;
  }

  const response: RoomJoinResponse = {
    code: newRoom.code,
    ticket: playerTicket,
  };

  res.statusCode = 200;
  res.send({
    data: response,
  });
});

router.post("/join", async (req: Request, res: Response) => {
  const { nickname, roomCode } = req.body;
  if (!req.params || !nickname) {
    res.statusCode = 400;
    res.send({ code: "Nope" });
    return;
  }

  let room: GameRoom;
  let playerTicket: { id: string; token: string };
  try {
    room = await getRoom(roomCode);
    playerTicket = await requestPlayerTicket(room.code, nickname);
  } catch (error) {
    res.statusCode = error.code ?? 500;
    res.send({ error, code: error.code });
    return;
  }

  const response: RoomJoinResponse = {
    code: roomCode,
    ticket: playerTicket,
  };

  res.statusCode = 200;
  res.send({
    data: response,
  });
});

// TODO: use dotenv
const io = new WebSocketServer(4444, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.of("/game/play").on("connection", async (socket) => {
  const { roomCode, nickname, token } = socket.handshake.query;

  if (!roomCode || !nickname) {
    socket.emit("bye-bye", "Room code or nickname missing.");
    socket.disconnect(true);
    return;
  }

  try {
    const room = await getRoom(roomCode as string);
    room.playerConnect(socket, token as string);
  } catch (error) {
    socket.emit("bye-bye", `an error: ${error}`);
    socket.disconnect(true);
  }
});

io.of("/game/watch").on("connection", async (socket) => {
  const { roomCode } = socket.handshake.query;

  if (!roomCode) {
    socket.emit("bye-bye", "Room code or nickname missing.");
    socket.disconnect(true);
    return;
  }

  const room = await getRoom(roomCode as string);
  if (!room) {
    socket.emit("bye-bye", "No room with that code.");
    socket.disconnect(true);
    return;
  }

  room.spectateGame(socket);
});
