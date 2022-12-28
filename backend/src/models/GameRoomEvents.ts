import { GameState } from "./game/states";

export type GameRoomEventKind =
  | "welcome"
  | "connect"
  | "reconnect"
  | "game-event"
  | "game-state-update";

/**
 * Server event sent to client with their secret id.
 */
export interface WelcomeEvent {
  kind: GameRoomEventKind;
  id: string;
}

/**
 * Event sent by the client, requesting player spot in the game for the existing player with id.
 */
export interface ReconnectRequestEvent {
  kind: GameRoomEventKind;
  id: string;
}

/**
 * Event sent by the server, with either a confirmation of reconnection or an explanation why it failed.
 */
export interface ReconnectResponseEvent {
  kind: GameRoomEventKind;
  success: boolean;
  error?: string;
}

/**
 * Client event, indicating play.
 */
export interface PlayRoomEvent {
  kind: GameRoomEventKind;
  playerId: string;
  column: number;
}

export interface StateUpdateEvent {
  kind: GameRoomEventKind;
  state: GameState;
}

// export interface Error {
//   kind
// }

export type ServerEvent =
  | ReconnectResponseEvent
  | WelcomeEvent
  | StateUpdateEvent;