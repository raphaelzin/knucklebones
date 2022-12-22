import { GameRoom } from "./models/GameRoom";
import express, { Express, Request, Response } from "express";
import { Server as WebSocketServer } from "socket.io";

const app: Express = express();
app.use(express.json());

const rooms: GameRoom[] = [];
let counter = 0;

app.listen(6000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${6000}`);
});

app.post("/game/create-game", async (req: Request, res: Response) => {
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
io.on("connection", (socket) => {
  const { roomCode } = socket.handshake.query;

  if (!roomCode) {
    socket.emit("bye-bye", "Room code missing.");
    socket.disconnect(true);
    return;
  }

  const room = getRoom(roomCode as string);
  if (!room) {
    socket.emit("bye-bye", "No room with that code.");
    socket.disconnect(true);
    return;
  }

  room.enterGame(socket);
  console.log(socket);
});

const getRoom = (code: string): GameRoom => {
  // TODO: Get channel on Redis

  for (const room of rooms) {
    if (room.code == code) return room;
  }
  return undefined;
};
