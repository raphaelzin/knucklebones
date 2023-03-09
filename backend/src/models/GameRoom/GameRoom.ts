/* eslint-disable @typescript-eslint/no-explicit-any */
import { GameController, GameControllerInterface } from "../GameController";
import DefaultRules from "../rules/DefaultRules";
import { randomUUID } from "crypto";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ServerEvent } from "./GameRoomEvents";
import { GameStateSummary } from "@knucklebones/shared-models/src/RemoteState";
import { FullHouseError, InvalidPayload } from "./GameRoomErrors";
import { PlayerTicket } from "@knucklebones/shared-models/src/RemoteResponses";

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

  ticket(token: string): PlayerTicket | undefined {
    const p = this.players.filter((p) => p.token == token);
    if (p.length == 0) return undefined;
    return { token: token, id: p[0].id };
  }

  registerPlayer(nickname: string): { id: string; token: string } {
    if (this.controller.gameIsFull()) throw FullHouseError;
    const id = randomUUID();
    const token = randomUUID();

    this.controller.enterGame(nickname, id);
    const client: GameRoomClient = { id, token };
    this.players.push(client);

    return { id, token };
  }

  spectateGame(socket: IOSocket) {
    const id = randomUUID();
    const token = randomUUID();
    const client: GameRoomClient = { id, socket, token };

    this.emit(socket, {
      kind: "welcome",
      id,
      token,
      rules: this.controller.game.rules,
    });
    this.spectators.push(client);
    this.emit(socket, {
      kind: "game-state-update",
      state: this.controller.gameStateSummary,
    });
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
    console.log("Reconnecting user");
    const player = this.players.filter((p) => p.token == token)[0];
    if (!player) {
      this.emit(socket, {
        kind: "reconnect",
        success: false,
        rules: this.controller.game.rules,
        error: `No player with token "${token}" in this room.`,
      });
      return;
    }

    // Replaces socket with new one.
    player.socket = socket;

    // Confirm reconnection.
    this.setupListeners(socket);
    this.emit(socket, {
      kind: "reconnect",
      success: true,
      id: player.id,
      rules: this.controller.game.rules,
    });
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
      else console.log(`client ${client.id} doesn't have a socket attached.`);
    }
  }
}
