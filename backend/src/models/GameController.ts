import { createBoardState } from "./game/Game";
import { Rules } from "@knucklebones/shared-models/src/Rules";
import DiceTower, { DiceTowerInterface } from "./game/DiceTower";
import { Game } from "@knucklebones/shared-models";
import { GameStateSummary, GameState, Turn } from "@knucklebones/shared-models/src/RemoteState";

import { ColumnFullError, InvalidMoveError, WrongTurnError } from "./GameRoom/GameRoomErrors";

export interface GameControllerInterface {
  gameStateSummary: GameStateSummary;
  game: Game;
  gameStateCallback?: (state: GameStateSummary) => void;

  enterGame(nickname: string, identifier: string): void;
  gameIsFull(): boolean;
  play(col: number, playerId: string): void;
}

export class GameController implements GameControllerInterface {
  gameStateSummary: GameStateSummary;
  game: Game;
  gameStateCallback?: (event: GameStateSummary) => void = undefined;
  diceTower: DiceTowerInterface;

  constructor(rules: Rules, diceTower: DiceTowerInterface = DiceTower) {
    this.diceTower = diceTower;
    this.game = { rules: rules, players: [] };
    this.gameStateSummary = this.createState({
      kind: "waiting-player",
      playersPresent: []
    });
  }

  gameIsFull(): boolean {
    return this.game.players.length == this.game.rules.numberOfPlayers;
  }

  enterGame(nickname: string, identifier: string) {
    const board: number[][] = [];
    for (let i = 0; i < this.game.rules.boardSize; i++) board.push([]);

    this.game.players.push({
      identifier: identifier,
      nickname: nickname,
      board: board
    });

    if (this.gameStateSummary.state.kind === "waiting-player") {
      this.gameStateSummary.state.playersPresent.push({
        nickname,
        id: identifier
      });
      this.gameStateCallback(this.gameStateSummary);
    }

    // Reached the number of players, start game.
    if (this.game.players.length == this.game.rules.numberOfPlayers) {
      this.gameStateSummary = this.createState(
        this.createNextTurn(this.game.players[0].identifier)
      );
      this.gameStateCallback(this.gameStateSummary);
    }
  }

  play(col: number, playerId: string) {
    if (this.gameStateSummary.state.kind != "turn") throw InvalidMoveError;
    if (this.gameStateSummary.state.playerId != playerId) throw WrongTurnError;

    const die = this.gameStateSummary.state.die;
    const player = this.game.players.filter(p => p.identifier == playerId)[0];

    // If the column is already full, throw error.
    if (player.board[col].length >= this.game.rules.boardSize || col < 0) throw ColumnFullError;

    for (const player of this.game.players) {
      if (player.identifier != playerId) {
        // Removes instances of die in that column of other players
        player.board[col] = player.board[col].filter(x => x != die);
      } else {
        // Adds die to current player
        player.board[col].push(die);
      }
    }

    // Finish game if applicable
    if (this.game.rules.evaluateGameEnd(this.game)) {
      this.finishGame();
      return;
    }

    this.gameStateSummary = this.createState(this.createNextTurn(playerId));
    this.gameStateCallback(this.gameStateSummary);
  }

  finishGame() {
    let bestScore = -1;
    let winnerId: string | undefined = undefined;

    for (const player of this.game.players) {
      const score = this.game.rules.calculateScore(player.board);
      if (score > bestScore) {
        bestScore = score;
        winnerId = player.identifier;
      } else if (score == bestScore) {
        winnerId = undefined;
      }
    }

    if (!winnerId) {
      this.gameStateSummary = this.createState({ kind: "tie" });
    } else {
      this.gameStateSummary = this.createState({
        kind: "win",
        winnerId
      });
    }

    this.gameStateCallback(this.gameStateSummary);
  }

  // Helper functions

  nextPlayerAfter(playerId: string): string {
    const ids = this.game.players.map(p => p.identifier);
    const index = ids.indexOf(playerId);
    const id = ids[(index + 1) % ids.length];
    return id;
  }

  createNextTurn(previousPlayer: string): Turn {
    return {
      kind: "turn",
      playerId: this.nextPlayerAfter(previousPlayer),
      die: this.diceTower.throwDice(1, this.game.rules.dieSideCount)
    };
  }

  createState(state: GameState): GameStateSummary {
    return {
      boardState: createBoardState(this.game),
      state: state
    };
  }
}
