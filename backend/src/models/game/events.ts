import { Player } from "./board";
import { GameState } from "./states";

export enum GameEventKind {
  StateUpdate = "state-update",
  PlayerUpdate = "player-update",
}

export interface GameStateUpdateEvent {
  kind: GameEventKind.StateUpdate;
  state: GameState;
}

export interface PlayerUpdateEvent {
  kind: GameEventKind.PlayerUpdate;
  player: Player;
}

export type GameEvent = GameStateUpdateEvent | PlayerUpdateEvent;
