import {
  Rules,
  BoardState,
  PlayerBoardState,
} from "@knucklebones/shared-models";

export interface Player {
  identifier: string;
  nickname: string;
  board: number[][];
}

export interface Game {
  players: Player[];
  rules: Rules;
}

export function createBoardState(game: Game): BoardState {
  const state: { [key: string]: PlayerBoardState } = {};
  for (const player of game.players) {
    state[player.identifier] = {
      nickname: player.nickname,
      board: player.board,
      score: game.rules.calculateScore(player.board),
    };
  }

  return { players: state };
}

export function getPlayer(id: string, game: Game): Player | undefined {
  for (const player of game.players) {
    if (player.identifier == id) return player;
  }

  return undefined;
}
