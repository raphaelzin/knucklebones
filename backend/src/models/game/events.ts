import { GameStateSummary } from "./states";

export type GameEventKind = "state-update";

export interface GameStateUpdateEvent {
  kind: "state-update";
  state: GameStateSummary;
}

export type GameEvent = GameStateUpdateEvent;
