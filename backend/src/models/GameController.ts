import { createBoardState, Game, Rules } from "./game/board";
import { GameState, GameStateKind } from "./game/states";
import { GameEvent } from "./game/events";

export interface GameControllerInterface {
  gameState: GameState;
  game: Game;
  gameStateCallback: (state: GameState) => void;

  enterGame(nickname: string, identifier: string);
  gameIsFull(): boolean;
  isMyTurn(playerId: string): boolean;
  play(col: number, playerId: string): void;
  onEvent: (event: GameEvent) => void;
}

export class GameController implements GameControllerInterface {
  gameState: GameState;
  game: Game;
  gameStateCallback: (event: GameState) => void;

  onEvent: (event: GameEvent) => void;

  constructor(rules: Rules) {
    this.game = {
      rules: rules,
      players: [],
    };

    this.gameState = {
      boardState: createBoardState(this.game),
      state: {
        kind: GameStateKind.WaitingPlayer,
      },
    };
  }

  enterGame(nickname: string, identifier: string) {
    const board: number[][] = [];
    for (let i = 0; i < this.game.rules.boardSize; i++) board.push([]);

    this.game.players.push({
      identifier: identifier,
      nickname: nickname,
      board: board,
    });

    console.log("Number of players: ", this.game.players.length);
    // TODO: make number of players variable
    if (this.game.players.length == 2) {
      this.gameState = {
        boardState: createBoardState(this.game),
        state: {
          playerId: this.game.players[0].identifier,
          die: this.throwDie(),
          kind: GameStateKind.Turn,
        },
      };
      this.gameStateCallback(this.gameState);
    }
  }

  gameIsFull(): boolean {
    return this.game.players.length == this.game.rules.numberOfPlayers;
  }

  isMyTurn(playerId: string): boolean {
    if (this.gameState.state.kind == GameStateKind.Turn) {
      return this.gameState.state.playerId == playerId;
    }
    return false;
  }

  play(col: number, playerId: string) {
    if (this.gameState.state.kind != GameStateKind.Turn) {
      // <------ .error(not a turn)
      console.log("Not valid move");
      return;
    }

    if (this.gameState.state.playerId != playerId) {
      // <------ .error(not your turn)
      console.log("It's not your turn");
      return;
    }

    const die = this.gameState.state.die;

    for (const player of this.game.players) {
      if (player.identifier != playerId) {
        // Removes instances of die in that column of other players
        player.board[col] = player.board[col].filter((x) => x != die);
      } else {
        // Adds die to current player
        player.board[col].push(die);
      }
    }

    // publish play to players
    // <--

    // Finish game if applicable
    if (this.game.rules.evaluateGameEnd(this.game)) {
      this.finishGame();
      return;
    }

    this.gameState = {
      boardState: createBoardState(this.game),
      state: {
        kind: GameStateKind.Turn,
        playerId: this.nextPlayerAfter(playerId),
        die: this.throwDie(),
      },
    };

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
      this.gameState = {
        boardState: createBoardState(this.game),
        state: { kind: GameStateKind.Tie },
      };
    } else {
      this.gameState = {
        boardState: createBoardState(this.game),
        state: {
          kind: GameStateKind.Win,
          winnerId: winnerId,
        },
      };
    }
    this.gameStateCallback(this.gameState);
  }

  throwDie(): number {
    return Math.floor(Math.random() * this.game.rules.dieCount) + 1;
  }

  nextPlayerAfter(playerId: string): string {
    const ids = this.game.players.map((p) => p.identifier);
    const index = ids.indexOf(playerId);
    const id = ids[(index + 1) % ids.length];
    return id;
  }
}
