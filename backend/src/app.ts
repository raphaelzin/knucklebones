import { router as gameRouter } from "./routes/game-route";
import express, { Express } from "express";
import cors from "cors";
import { pinoHttp } from "pino-http";
import { env } from "./environment";

const app: Express = express();
app.use(express.json());
app.use(pinoHttp());

app.use(
  cors({
    origin: [
      `http://${env.host}:${env.frontendPort}`,
      `https://${env.host}:${env.frontendPort}`,
      `http://${env.host}`,
      `https://${env.host}`,
    ],
  })
);
app.use("/game", gameRouter);

app.listen(env.port, () => {
  console.log(
    `⚡️[server]: Server is running at https://${env.host}:${env.port}`
  );
});
