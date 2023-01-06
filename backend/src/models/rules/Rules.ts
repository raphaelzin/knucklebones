import { Game } from "../game/Game";

export interface Rules {
  dieCount: number;
  boardSize: number;
  numberOfPlayers: number;

  calculateScore(board: number[][]): number;
  evaluateGameEnd(game: Game): boolean;
}
