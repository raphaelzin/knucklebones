import { GameController } from "./models/GameController";
import DefaultRules from "./models/rules/DefaultRules";
import { createServer } from "http";
import { GameRoom } from "./models/GameRoom";

const httpServer = createServer((request, response) => {
  console.log(new Date() + " Received request for " + request);
  response.writeHead(404);
  response.end();
});

httpServer.listen(8000, () => {
  console.log("Nothing");
});

const room = new GameRoom(httpServer);
