export enum GameStateKind {
  Tie = "tie",
  Win = "win",
  WaitingPlayer = "waiting-player",
  Turn = "turn",
}

export interface Turn {
  kind: GameStateKind.Turn;
  playerId: string;
  die: number;
}

// Game states

export interface WinningFinish {
  kind: GameStateKind.Win;
  winnerId: string;
}

export interface TieFinish {
  kind: GameStateKind.Tie;
}

export interface WaitingPlayer {
  kind: GameStateKind.WaitingPlayer;
}

export interface PlayerBoardState {
  score: number;
  board: number[][];
}

export interface BoardState {
  players: { [key: string]: PlayerBoardState };
}

export type FinishedState = WinningFinish | TieFinish;

export type PlayState = Turn | FinishedState | WaitingPlayer;

export interface GameState {
  boardState: BoardState;
  state: PlayState;
}
