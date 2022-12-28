import { BoardState } from "./states";

export interface Player {
  identifier: string;
  nickname: string;
  board: number[][];
}

export interface Rules {
  dieCount: number;
  boardSize: number;
  numberOfPlayers: number;

  calculateScore(board: number[][]): number;
  evaluateGameEnd(game: Game): boolean;
}

export interface Game {
  players: Player[];
  rules: Rules;
}

export function createBoardState(game: Game): BoardState {
  const state: { [key: string]: number[][] } = {};
  for (const player of game.players) {
    state[player.identifier] = player.board;
  }

  return { players: state };
}

export function getPlayer(id: string, game: Game): Player | undefined {
  for (const player of game.players) {
    if (player.identifier == id) return player;
  }

  return undefined;
}
