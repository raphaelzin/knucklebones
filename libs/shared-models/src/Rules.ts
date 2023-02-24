import { Game } from "../../../backend/src/models/game/Game";

export interface Rules {
  boardSize: number;
  dieSideCount: number;
  numberOfPlayers: number;

  calculateScore(board: number[][]): number;
  evaluateGameEnd(game: Game): boolean;
}
