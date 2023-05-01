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
  port: +import.meta.env.VITE_FRONTEND_PORT,
  host: import.meta.env.VITE_HOST,
  apiPort: +import.meta.env.VITE_API_PORT,
  websocketPort: +import.meta.env.VITE_WEBSOCKET_PORT,
});
