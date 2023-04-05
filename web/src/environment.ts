export const env = {
  port: +(process.env.PORT || 3000),
  apiUrl: process.env.REACT_APP_API_URL || "http://localhost:4000",
  websocketUrl: process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:4001",
};
