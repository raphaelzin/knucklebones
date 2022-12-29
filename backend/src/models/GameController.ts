import { createBoardState, Game, Rules } from "./game/board";
import DiceTower, { DiceTowerInterface } from "./game/DiceTower";
import { GameState, GameStateKind, PlayState, Turn } from "./game/states";

import {
  ColumnFullError,
  InvalidMoveError,
  WrongTurnError,
} from "./GameRoom/GameRoomErrors";

export interface GameControllerInterface {
  gameState: GameState;
  game: Game;
  gameStateCallback?: (state: GameState) => void;

  enterGame(nickname: string, identifier: string): void;
  gameIsFull(): boolean;
  play(col: number, playerId: string): void;
}

export class GameController implements GameControllerInterface {
  gameState: GameState;
  game: Game;
  gameStateCallback?: (event: GameState) => void = undefined;
  diceTower: DiceTowerInterface;

  constructor(rules: Rules, diceTower: DiceTowerInterface = DiceTower) {
    this.diceTower = diceTower;
    this.game = { rules: rules, players: [] };
    this.gameState = this.createState({ kind: GameStateKind.WaitingPlayer });
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
      board: board,
    });

    // Reached the number of players, start game.
    if (this.game.players.length == this.game.rules.numberOfPlayers) {
      this.gameState = this.createState(
        this.createNextTurn(this.game.players[0].identifier)
      );
      this.gameStateCallback(this.gameState);
    }
  }

  play(col: number, playerId: string) {
    if (this.gameState.state.kind != GameStateKind.Turn) throw InvalidMoveError;
    if (this.gameState.state.playerId != playerId) throw WrongTurnError;

    const die = this.gameState.state.die;
    const player = this.game.players.filter((p) => p.identifier == playerId)[0];

    // If the column is already full, throw error.
    if (player.board[col].length >= this.game.rules.boardSize || col < 0)
      throw ColumnFullError;

    for (const player of this.game.players) {
      if (player.identifier != playerId) {
        // Removes instances of die in that column of other players
        player.board[col] = player.board[col].filter((x) => x != die);
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

    this.gameState = this.createState(this.createNextTurn(playerId));
    this.gameStateCallback(this.gameState);
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
      this.gameState = this.createState({ kind: GameStateKind.Tie });
    } else {
      this.gameState = this.createState({ kind: GameStateKind.Win, winnerId });
    }

    this.gameStateCallback(this.gameState);
  }

  // Helper functions

  nextPlayerAfter(playerId: string): string {
    const ids = this.game.players.map((p) => p.identifier);
    const index = ids.indexOf(playerId);
    const id = ids[(index + 1) % ids.length];
    return id;
  }

  createNextTurn(previousPlayer: string): Turn {
    return {
      kind: GameStateKind.Turn,
      playerId: this.nextPlayerAfter(previousPlayer),
      die: this.diceTower.throwDice(1, this.game.rules.dieCount),
    };
  }

  createState(state: PlayState): GameState {
    return {
      boardState: createBoardState(this.game),
      state: state,
    };
  }
}
