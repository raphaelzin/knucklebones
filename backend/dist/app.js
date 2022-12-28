"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_route_1 = require("./routes/game-route");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/game", game_route_1.router);
app.listen(6000, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${6000}`);
});
//# sourceMappingURL=app.js.map