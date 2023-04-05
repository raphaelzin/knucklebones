import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const env = {
  port: +(process.env.PORT || 4000),
  frontendPort: +(process.env.FRONTEND_PORT || 3000),
  host: process.env.HOST || "localhost",
  websocketPort: +(process.env.WEBSOCKET_PORT || 4001),
};
