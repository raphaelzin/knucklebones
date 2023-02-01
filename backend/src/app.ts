import { router as gameRouter } from "./routes/game-route";
import express, { Express } from "express";
import cors from "cors";

const app: Express = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);
app.use("/game", gameRouter);

app.listen(4000, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${4000}`);
});
