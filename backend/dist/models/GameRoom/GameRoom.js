"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const GameController_1 = require("../GameController");
const DefaultRules_1 = __importDefault(require("../rules/DefaultRules"));
const crypto_1 = require("crypto");
const GameRoomErrors_1 = require("./GameRoomErrors");
class GameRoom {
    constructor(code) {
        this.code = code;
        this.controller = new GameController_1.GameController(DefaultRules_1.default);
        this.controller.gameStateCallback = (state) => {
            this.handleGameStateChange(state);
        };
        this.spectators = [];
        this.players = [];
    }
    enterGame(socket, nickname, existingId) {
        // If user already has an id, he's trying to reconnect.
        if (existingId) {
            this.handleReconnectRequest(socket, existingId);
            return;
        }
        // if room is full, throw error so router can close socket.
        if (this.controller.gameIsFull()) {
            this.emit(socket, { kind: "error", error: GameRoomErrors_1.FullHouseError });
            socket.disconnect(true);
            return;
        }
        const id = (0, crypto_1.randomUUID)();
        const client = { id, socket };
        this.emit(socket, { kind: "welcome", id });
        this.setupListeners(socket);
        this.players.push(client);
        this.controller.enterGame(nickname, id);
    }
    spectateGame(socket) {
        const id = (0, crypto_1.randomUUID)();
        const client = { id, socket };
        this.emit(socket, { kind: "welcome", id });
        this.spectators.push(client);
    }
    setupListeners(socket) {
        socket.on("game-event", (payload) => {
            this.handlePlay(socket, payload);
        });
    }
    handlePlay(socket, payload) {
        const { column, playerId } = payload;
        if (column === undefined || !playerId) {
            this.emit(socket, {
                kind: "error",
                error: (0, GameRoomErrors_1.InvalidPayload)("Invalid or missing Column or Player id", payload),
            });
            return;
        }
        try {
            this.controller.play(column, playerId);
        }
        catch (error) {
            this.emit(socket, { kind: "error", error });
        }
    }
    handleReconnectRequest(socket, id) {
        const playerReconnectingId = id;
        const player = this.players.filter((player) => player.id == playerReconnectingId)[0];
        if (!player) {
            this.emit(socket, {
                kind: "reconnect",
                success: false,
                error: `No player with id "${playerReconnectingId}" in this room.`,
            });
            return;
        }
        // Replaces socket with new one.
        player.socket = socket;
        // Confirm reconnection.
        this.setupListeners(socket);
        this.emit(socket, { kind: "reconnect", success: true });
        this.emit(socket, {
            kind: "game-state-update",
            state: this.controller.gameState,
        });
    }
    emit(socket, event) {
        console.log(`Emitting "${JSON.stringify(event)}" to "${socket.id}"`);
        socket.emit(event.kind, event);
    }
    handleGameStateChange(state) {
        for (const client of [...this.players, ...this.spectators]) {
            this.emit(client.socket, { kind: "game-state-update", state });
        }
    }
}
exports.GameRoom = GameRoom;
//# sourceMappingURL=GameRoom.js.map