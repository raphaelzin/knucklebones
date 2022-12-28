/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameController, GameControllerInterface } from "../GameController";
import DefaultRules from "../rules/DefaultRules";
import { randomUUID } from "crypto";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ServerEvent } from "../GameRoomEvents";
import { GameState } from "../game/states";
import { Client } from "socket.io/dist/client";

type IOSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

interface GameRoomClient {
  socket: IOSocket;
  id: string;
}

export type ClientType = "player" | "spectator";

export class GameRoom {
  controller: GameControllerInterface;
  players: GameRoomClient[];
  spectators: GameRoomClient[];
  code: string;

  constructor(code: string) {
    this.code = code;
    this.controller = new GameController(DefaultRules);
    this.controller.gameStateCallback = (state) => {
      this.handleGameStateChange(state);
    };

    this.spectators = [];
    this.players = [];
  }

  enterGame(
    socket: IOSocket,
    nickname: string,
    existingId: string | undefined
  ) {
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

    const id = randomUUID();
    const client: GameRoomClient = { id, socket };

    this.emit(socket, { kind: "welcome", id });
    this.setupListeners(socket);

    this.players.push(client);
    this.controller.enterGame(nickname, id);
  }

  spectateGame(socket: IOSocket) {
    const id = randomUUID();
    const client: GameRoomClient = { id, socket };

    this.emit(socket, { kind: "welcome", id });

    this.spectators.push(client);
  }

  setupListeners(socket: IOSocket) {
    socket.on("event", (args) => {
      socket.emit("event", `I got ${args}`);
    });

    socket.on("game-event", (payload) => {
      this.handlePlay(socket, payload);
    });
  }

  setupSpectatorListeners(socket: IOSocket) {
    socket.on("game-event", (payload) => {
      this.handlePlay(socket, payload);
    });
  }

  handlePlay(socket: IOSocket, payload: any) {
    const { column, playerId } = payload;
    if (!column || !playerId) {
      // TODO: send socket message.
      console.log("error, invalid payload");

      return;
    }
    this.controller.play(column, playerId);
  }

  handleReconnectRequest(socket: IOSocket, id: string) {
    const playerReconnectingId = id;

    const player = this.players.filter(
      (player) => player.id == playerReconnectingId
    )[0];
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

  emit(socket: IOSocket, event: ServerEvent) {
    console.log(`emitting event to ${socket.conn}: ${event.kind}`);
    socket.emit(event.kind, event);
  }

  handleGameStateChange(state: GameState) {
    console.log(state);

    for (const client of [...this.players, ...this.spectators]) {
      this.emit(client.socket, { kind: "game-state-update", state });
    }
  }
}