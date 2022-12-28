"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const board_1 = require("./game/board");
const states_1 = require("./game/states");
class GameController {
    constructor(rules) {
        this.game = {
            rules: rules,
            players: [],
        };
        this.gameState = {
            boardState: (0, board_1.createBoardState)(this.game),
            state: {
                kind: states_1.GameStateKind.WaitingPlayer,
            },
        };
    }
    enterGame(nickname, identifier) {
        const board = [];
        for (let i = 0; i < this.game.rules.boardSize; i++)
            board.push([]);
        this.game.players.push({
            identifier: identifier,
            nickname: nickname,
            board: board,
        });
        console.log("Number of players: ", this.game.players.length);
        // TODO: make number of players variable
        if (this.game.players.length == 2) {
            this.gameState = {
                boardState: (0, board_1.createBoardState)(this.game),
                state: {
                    playerId: this.game.players[0].identifier,
                    die: this.throwDie(),
                    kind: states_1.GameStateKind.Turn,
                },
            };
            this.gameStateCallback(this.gameState);
        }
    }
    gameIsFull() {
        return this.game.players.length == this.game.rules.numberOfPlayers;
    }
    isMyTurn(playerId) {
        if (this.gameState.state.kind == states_1.GameStateKind.Turn) {
            return this.gameState.state.playerId == playerId;
        }
        return false;
    }
    play(col, playerId) {
        if (this.gameState.state.kind != states_1.GameStateKind.Turn) {
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
            }
            else {
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
            boardState: (0, board_1.createBoardState)(this.game),
            state: {
                kind: states_1.GameStateKind.Turn,
                playerId: this.nextPlayerAfter(playerId),
                die: this.throwDie(),
            },
        };
        this.gameStateCallback(this.gameState);
    }
    finishGame() {
        let bestScore = -1;
        let winnerId = undefined;
        for (const player of this.game.players) {
            const score = this.game.rules.calculateScore(player.board);
            if (score > bestScore) {
                bestScore = score;
                winnerId = player.identifier;
            }
            else if (score == bestScore) {
                winnerId = undefined;
            }
        }
        if (!winnerId) {
            this.gameState = {
                boardState: (0, board_1.createBoardState)(this.game),
                state: { kind: states_1.GameStateKind.Tie },
            };
        }
        else {
            this.gameState = {
                boardState: (0, board_1.createBoardState)(this.game),
                state: {
                    kind: states_1.GameStateKind.Win,
                    winnerId: winnerId,
                },
            };
        }
        this.gameStateCallback(this.gameState);
    }
    throwDie() {
        return Math.floor(Math.random() * this.game.rules.dieCount) + 1;
    }
    nextPlayerAfter(playerId) {
        const ids = this.game.players.map((p) => p.identifier);
        const index = ids.indexOf(playerId);
        const id = ids[(index + 1) % ids.length];
        return id;
    }
}
exports.GameController = GameController;
//# sourceMappingURL=GameController.js.map