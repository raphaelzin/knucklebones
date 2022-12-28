import { router as gameRouter } from "./routes/game-route";
import express, { Express } from "express";

const app: Express = express();
app.use(express.json());

app.use("/game", gameRouter);

app.listen(6000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${6000}`);
});
