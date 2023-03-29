import { Rules } from "./Rules";

export interface Player {
  identifier: string;
  nickname: string;
  board: number[][];
}

export interface Game {
  players: Player[];
  rules: Rules;
}
