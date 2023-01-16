import { Server as WebSocketServer } from "socket.io";
import express, { Request, Response } from "express";
import { createRoom, getRoom } from "../controllers/RoomService";
import { GameRoom } from "../models/GameRoom/GameRoom";

export const router = express.Router();
router.use(express.json());

router.post("/create-game", async (req: Request, res: Response) => {
  if (!req.params) {
    res.statusCode = 404;
    return;
  }

  let newRoom: GameRoom;
  try {
    newRoom = await createRoom();
  } catch (error) {
    res.statusCode = error.code;
    res.send({ error, code: error.code });
    return;
  }

  console.log(`Room created: ${newRoom.code}`);
  res.statusCode = 200;
  res.send({
    data: {
      code: newRoom.code,
    },
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
    room.enterGame(socket, nickname as string, token as string | undefined);
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
