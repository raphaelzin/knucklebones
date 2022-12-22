"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameRoom_1 = require("./models/GameRoom");
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const rooms = [];
let counter = 0;
app.listen(6000, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${6000}`);
});
app.post("/game/create-game", async (req, res) => {
    if (!req.params) {
        res.statusCode = 404;
        return;
    }
    const newRoomCode = `${counter}`;
    rooms.push(new GameRoom_1.GameRoom(newRoomCode));
    counter += 1;
    res.statusCode = 200;
    res.send(`${newRoomCode} :)`);
});
const io = new socket_io_1.Server(4444);
io.on("connection", (socket) => {
    const { roomCode } = socket.handshake.query;
    if (!roomCode) {
        socket.emit("bye-bye", "Room code missing.");
        socket.disconnect(true);
        return;
    }
    const room = getRoom(roomCode);
    if (!room) {
        socket.emit("bye-bye", "No room with that code.");
        socket.disconnect(true);
        return;
    }
    room.enterGame(socket);
    console.log(socket);
});
const getRoom = (code) => {
    // TODO: Get channel on Redis
    for (const room of rooms) {
        if (room.code == code)
            return room;
    }
    return undefined;
};
//# sourceMappingURL=app.js.map