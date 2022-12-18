import { GameController } from "./GameController";
import DefaultRules from "./rules/DefaultRules";
import {
  server as WebSocketServer,
  connection as WebSocketConnection,
} from "websocket";
import { Server } from "http";
import { randomUUID } from "crypto";

interface GameRoomClient {
  connection: WebSocketConnection;
  id: string;
}

export class GameRoom {
  controller: GameController;
  websocketServer: WebSocketServer;
  clients: GameRoomClient[];
  code: string;

  constructor(server: Server) {
    this.controller = new GameController(DefaultRules);
    this.websocketServer = new WebSocketServer({
      httpServer: server,
      autoAcceptConnections: false,
    });
  }

  enterGame(nickname: string) {
    const id = randomUUID();

    // this.websocketServer.handleUpgrade()

    this.websocketServer.on("request", (request) => {
      const connection = request.accept(request.origin);
      const client = { connection: connection, id: id };
      this.clients.push(client);
      this.controller.enterGame(nickname, randomUUID());
    });
  }
}
