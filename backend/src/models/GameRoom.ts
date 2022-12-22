import { GameController } from "./GameController";
import DefaultRules from "./rules/DefaultRules";
import { randomUUID } from "crypto";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type IOSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;

interface GameRoomClient {
  socket: IOSocket;
  id: string;
}

export class GameRoom {
  controller: GameController;
  players: GameRoomClient[];
  clients: GameRoomClient[];
  code: string;

  constructor(code: string) {
    this.code = code;
    this.controller = new GameController(DefaultRules);

    this.clients = [];
    this.players = [];
  }

  enterGame(socket: IOSocket) {
    const id = randomUUID();
    const client: GameRoomClient = {
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
  handleEvents(clientId: string, channel: string, args: any) {
    // Parse events from clients
    console.log(clientId, channel, args);
  }
}
