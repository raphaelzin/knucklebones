"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const GameController_1 = require("./GameController");
const DefaultRules_1 = __importDefault(require("./rules/DefaultRules"));
const crypto_1 = require("crypto");
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
            // TODO: Replace with a typed error
            throw "Game is full, consider entering as spectator";
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
        socket.on("event", (args) => {
            socket.emit("event", `I got ${args}`);
        });
        socket.on("game-event", (payload) => {
            this.handlePlay(socket, payload);
        });
    }
    setupSpectatorListeners(socket) {
        socket.on("game-event", (payload) => {
            this.handlePlay(socket, payload);
        });
    }
    handlePlay(socket, payload) {
        const { column, playerId } = payload;
        if (!column || !playerId) {
            // TODO: send socket message.
            console.log("error, invalid payload");
        }
        this.controller.play(column, playerId);
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
        this.emit(socket, { kind: "reconnect", success: true });
        this.emit(socket, {
            kind: "game-state-update",
            state: this.controller.gameState,
        });
    }
    emit(socket, event) {
        console.log(`emitting event to ${socket.conn}: ${event.kind}`);
        socket.emit(event.kind, event);
    }
    handleGameStateChange(state) {
        console.log(state);
        for (const client of [...this.players, ...this.spectators]) {
            this.emit(client.socket, { kind: "game-state-update", state });
        }
    }
}
exports.GameRoom = GameRoom;
//# sourceMappingURL=GameRoom.js.map