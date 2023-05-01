/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FRONTEND_PORT: number;
  readonly VITE_HOST: string;
  readonly VITE_API_PORT: number;
  readonly VITE_WEBSOCKET_PORT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
