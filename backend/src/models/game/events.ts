import { GameStateSummary } from "@knucklebones/shared-models/src/RemoteState";

export type GameEventKind = "state-update";

export interface GameStateUpdateEvent {
  kind: "state-update";
  state: GameStateSummary;
}

export type GameEvent = GameStateUpdateEvent;
