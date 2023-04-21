import { z } from "zod";

const Environment = z.object({
  port: z.number(),
  host: z.string(),
  apiPort: z.number(),
  websocketPort: z.number(),
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
type Environment = z.infer<typeof Environment>;

export const env = Environment.parse({
  port: +process.env.REACT_APP_FRONTEND_PORT!,
  host: process.env.REACT_APP_HOST!,
  apiPort: +process.env.REACT_APP_API_PORT!,
  websocketPort: +process.env.REACT_APP_WEBSOCKET_PORT!,
});
