import { Player } from "./board";

export enum GameStateKind {
  Tie = "tie",
  Win = "win",
  WaitingPlayer = "waiting-player",
  Turn = "turn",
}

export interface Turn {
  kind: GameStateKind.Turn;
  player: Player;
  die: number;
}

// Game states

export interface WinningFinish {
  kind: GameStateKind.Win;
  winner: Player;
}

export interface TieFinish {
  kind: GameStateKind.Tie;
}

export interface WaitingPlayer {
  kind: GameStateKind.WaitingPlayer;
}

export interface BoardState {
  players: { [key: string]: number[][] };
}

export type FinishedState = WinningFinish | TieFinish;

export interface GameState {
  boardState: BoardState;
  state: Turn | FinishedState | WaitingPlayer;
}
