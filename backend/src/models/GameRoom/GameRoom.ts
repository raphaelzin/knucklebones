/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameController, GameControllerInterface } from "../GameController";
import DefaultRules from "../rules/DefaultRules";
import { randomUUID } from "crypto";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ServerEvent } from "./GameRoomEvents";
import { GameStateSummary } from "@knucklebones/shared-models/src/RemoteState";
import { FullHouseError, InvalidPayload } from "./GameRoomErrors";

type IOSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

interface GameRoomClient {
  socket?: IOSocket;
  token: string;
  id: string;
}

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

  // enterGame(
  //   socket: IOSocket,
  //   nickname: string,
  //   existingId: string | undefined
  // ) {
  //   // If user already has an id, he's trying to reconnect.
  //   if (existingId) {
  //     this.handleReconnectRequest(socket, existingId);
  //     return;
  //   }

  //   // if room is full, throw error so router can close socket.
  //   if (this.controller.gameIsFull()) {
  //     this.emit(socket, { kind: "error", error: FullHouseError });
  //     socket.disconnect(true);
  //     return;
  //   }

  //   const id = randomUUID();
  //   const token = randomUUID();
  //   const client: GameRoomClient = { id, socket, token };
  //   this.emit(socket, { kind: "welcome", id, token });
  //   this.setupListeners(socket);

  //   // this.players.push(client);
  //   // this.controller.enterGame(nickname, id);
  // }

  playerConnect(socket: IOSocket, token: string) {
    const filteredPlayers = this.players.filter(
      (player) => player.token === token
    );

    if (filteredPlayers.length == 0) {
      this.emit(socket, { kind: "error", error: FullHouseError });
      socket.disconnect(true);
    }
    filteredPlayers[0].socket = socket;
    this.setupListeners(socket);
  }

  registerPlayer(nickname: string): { id: string; token: string } {
    if (this.controller.gameIsFull()) throw FullHouseError;
    const id = randomUUID();
    const token = randomUUID();
    console.log("will try to enter game");
    this.controller.enterGame(nickname, id);
    console.log("entered the game");
    const client: GameRoomClient = { id, token };
    console.log(`players: ${this.players}`);
    this.players.push(client);
    console.log(`client: ${client}`);
    return { id, token };
  }

  spectateGame(socket: IOSocket) {
    const id = randomUUID();
    const token = randomUUID();
    const client: GameRoomClient = { id, socket, token };

    this.emit(socket, { kind: "welcome", id, token });
    this.spectators.push(client);
  }

  setupListeners(socket: IOSocket) {
    socket.on("game-event", (payload) => {
      this.handlePlay(socket, payload);
    });
  }

  handlePlay(socket: IOSocket, payload: any) {
    const { column, token } = payload;

    const player = this.players.filter((p) => p.token == token)[0];

    if (column === undefined || !player) {
      this.emit(socket, {
        kind: "error",
        error: InvalidPayload("Invalid or missing Column or token", payload),
      });
      return;
    }

    try {
      this.controller.play(column, player.id);
    } catch (error) {
      this.emit(socket, { kind: "error", error });
    }
  }

  handleReconnectRequest(socket: IOSocket, token: string) {
    const player = this.players.filter((p) => p.token == token)[0];
    if (!player) {
      this.emit(socket, {
        kind: "reconnect",
        success: false,
        error: `No player with token "${token}" in this room.`,
      });
      return;
    }

    // Replaces socket with new one.
    player.socket = socket;

    // Confirm reconnection.
    this.setupListeners(socket);
    this.emit(socket, { kind: "reconnect", success: true, id: player.id });
    this.emit(socket, {
      kind: "game-state-update",
      state: this.controller.gameStateSummary,
    });
  }

  emit(socket: IOSocket, event: ServerEvent) {
    socket.emit(event.kind, event);
  }

  handleGameStateChange(state: GameStateSummary) {
    for (const client of [...this.players, ...this.spectators]) {
      if (client.socket)
        this.emit(client.socket, { kind: "game-state-update", state });
    }
  }
}
