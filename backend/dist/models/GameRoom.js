"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
const GameController_1 = require("./GameController");
const DefaultRules_1 = __importDefault(require("./rules/DefaultRules"));
const crypto_1 = require("crypto");
class GameRoom {
    constructor(code) {
        this.code = code;
        this.controller = new GameController_1.GameController(DefaultRules_1.default);
        this.clients = [];
        this.players = [];
    }
    enterGame(socket) {
        const id = (0, crypto_1.randomUUID)();
        const client = {
            id: id,
            socket: socket,
        };
        socket.on("event", (args) => {
            this.handleEvents(id, "event", args);
            socket.emit("event", `I got ${args}`);
        });
        socket.emit("welcome", id);
        this.clients.push(client);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleEvents(clientId, channel, args) {
        // Parse events from clients
        console.log(clientId, channel, args);
    }
}
exports.GameRoom = GameRoom;
//# sourceMappingURL=GameRoom.js.map