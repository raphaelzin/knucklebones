import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../.env" });

const Environment = z.object({
  port: z.number(),
  frontendPort: z.number(),
  host: z.string(),
  websocketPort: z.number(),
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
type Environment = z.infer<typeof Environment>;

export const env = Environment.parse({
  port: +process.env.API_PORT!,
  frontendPort: +process.env.FRONTEND_PORT!,
  host: process.env.HOST,
  websocketPort: +process.env.API_WEBSOCKET_PORT!,
});
