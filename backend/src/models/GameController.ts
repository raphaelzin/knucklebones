import { createBoardState, Game, getPlayer, Player, Rules } from "./game/board";
import { GameState, GameStateKind } from "./game/states";
import { GameEvent } from "./game/events";

export interface GameControllerInterface {
  gameState: GameState;
  game: Game;

  isMyTurn(player: Player): boolean;
  play(col: number, player: Player): void;
  onEvent: (event: GameEvent) => void;
}

export class GameController implements GameControllerInterface {
  gameState: GameState;
  game: Game;

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
    for (let i = 0; i < 5; i++) board.push([]);

    this.game.players.push({
      identifier: identifier,
      nickname: nickname,
      board: board,
    });
  }

  isMyTurn(player: Player): boolean {
    if (this.gameState.state.kind == GameStateKind.Turn) {
      return this.gameState.state.player == player;
    }
    return false;
  }

  play(col: number, player: Player) {
    if (this.gameState.state.kind != GameStateKind.Turn) {
      // <------ .error(not a turn)
      console.log("Not valid move");
      return;
    }

    if (this.gameState.state.player.identifier != player.identifier) {
      // <------ .error(not your turn)
      console.log("It's not your turn");
      return;
    }

    const die = this.gameState.state.die;

    for (const player of this.game.players) {
      if (player.identifier != player.identifier) {
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
        player: this.nextPlayerAfter(player),
        die: this.throwDie(),
      },
    };

    // <-- Publish new state
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
          winner: getPlayer(winnerId, this.game),
        },
      };
    }
  }

  throwDie(): number {
    return Math.floor(Math.random() * this.game.rules.dieCount) + 1;
  }

  nextPlayerAfter(player: Player): Player {
    const ids = this.game.players.map((p) => p.identifier);
    const index = ids.indexOf(player.identifier);
    const id = ids[(index + 1) % ids.length];
    return getPlayer(id, this.game);
  }
}
