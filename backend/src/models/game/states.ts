// Game states

export type GameStateKind = "tie" | "win" | "waiting-player" | "turn";

export interface Turn {
  kind: "turn";
  playerId: string;
  die: number;
}

export interface WinningFinish {
  kind: "win";
  winnerId: string;
}

export interface TieFinish {
  kind: "tie";
}

export interface WaitingPlayer {
  kind: "waiting-player";
}

export type FinishedState = WinningFinish | TieFinish;

export type GameState = Turn | FinishedState | WaitingPlayer;

// Board states

export interface PlayerBoardState {
  nickname: string;
  score: number;
  board: number[][];
}

export interface BoardState {
  players: { [key: string]: PlayerBoardState };
}

export interface GameStateSummary {
  boardState: BoardState;
  state: GameState;
}
