import { Game } from "../game/Game";
import { Rules } from "@knucklebones/shared-models/src/Rules";

class DefaultRules implements Rules {
  boardSize = 3;
  dieSideCount = 6;
  numberOfPlayers = 2;

  evaluateGameEnd(game: Game): boolean {
    const boards = game.players.map((p) => p.board);

    for (const key in boards) {
      const board = boards[key];
      let isFull = true;
      for (const col of board) {
        if (col.length != this.boardSize) {
          isFull = false;
          break;
        }
      }

      if (isFull) return true;
    }

    return false;
  }

  calculateScore(board: number[][]): number {
    let score = 0;

    let occurrencesDict: { [key: number]: number } = {};
    for (const column of board) {
      occurrencesDict = {};

      for (const num of column) {
        occurrencesDict[num] = (occurrencesDict[num] ?? 0) + 1;
      }

      for (const key in occurrencesDict) {
        if (occurrencesDict[key] == 2) {
          score = score + parseInt(key) * 4;
        } else if (occurrencesDict[key] == 3) {
          score = score + parseInt(key) * 7;
        } else {
          score += parseInt(key);
        }
      }
    }

    return score;
  }
}

export default new DefaultRules();
