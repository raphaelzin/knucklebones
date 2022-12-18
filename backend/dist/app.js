"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameController_1 = require("./models/GameController");
const DefaultRules_1 = __importDefault(require("./models/rules/DefaultRules"));
// const app = express();
// const port = 3000;
// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });
// app.listen(port, () => {
//   return console.log(`Express is listening at http://localhost:${port}`);
// });
const gameController = new GameController_1.GameController(DefaultRules_1.default);
gameController.enterGame("raphael", "1");
gameController.enterGame("malika", "2");
console.log(gameController.gameState);
gameController.play(1, "1");
console.log(JSON.stringify(gameController.gameState));
console.log(gameController.gameState);
gameController.play(1, "2");
console.log(JSON.stringify(gameController.gameState));
//# sourceMappingURL=app.js.map