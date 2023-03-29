import { Game } from "./Game";

export interface Rules {
  boardSize: number;
  dieSideCount: number;
  numberOfPlayers: number;

  calculateScore(board: number[][]): number;
  evaluateGameEnd(game: Game): boolean;
}
