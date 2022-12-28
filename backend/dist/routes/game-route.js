"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const GameRoom_1 = require("../models/GameRoom");
exports.router = express_1.default.Router();
exports.router.use(express_1.default.json());
const rooms = [];
let counter = 0;
exports.router.post("/create-game", async (req, res) => {
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
io.of("/game/play").on("connection", (socket) => {
    const { roomCode, nickname, id } = socket.handshake.query;
    if (!roomCode || !nickname) {
        socket.emit("bye-bye", "Room code or nickname missing.");
        socket.disconnect(true);
        return;
    }
    const room = getRoom(roomCode);
    if (!room) {
        socket.emit("bye-bye", `No room with code ${roomCode}.`);
        socket.disconnect(true);
        return;
    }
    try {
        room.enterGame(socket, nickname, id);
    }
    catch (error) {
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
    const room = getRoom(roomCode);
    if (!room) {
        socket.emit("bye-bye", "No room with that code.");
        socket.disconnect(true);
        return;
    }
    room.spectateGame(socket);
});
const getRoom = (code) => {
    // TODO: Get channel on Redis
    for (const room of rooms) {
        if (room.code == code)
            return room;
    }
    return undefined;
};
//# sourceMappingURL=game-route.js.map