"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameController = void 0;
const board_1 = require("./game/board");
const states_1 = require("./game/states");
const GameRoomErrors_1 = require("./GameRoom/GameRoomErrors");
class GameController {
    constructor(rules) {
        this.game = { rules: rules, players: [] };
        this.gameState = this.createState({ kind: states_1.GameStateKind.WaitingPlayer });
    }
    gameIsFull() {
        return this.game.players.length == this.game.rules.numberOfPlayers;
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
        // Reached the number of players, start game.
        if (this.game.players.length == this.game.rules.numberOfPlayers) {
            this.gameState = this.createState(this.createNextTurn(this.game.players[0].identifier));
            this.gameStateCallback(this.gameState);
        }
    }
    play(col, playerId) {
        if (this.gameState.state.kind != states_1.GameStateKind.Turn)
            throw GameRoomErrors_1.InvalidMoveError;
        if (this.gameState.state.playerId != playerId)
            throw GameRoomErrors_1.WrongTurnError;
        const die = this.gameState.state.die;
        const player = this.game.players.filter((p) => p.identifier == playerId)[0];
        // If the column is already full, throw error.
        if (player.board[col].length >= this.game.rules.boardSize || col < 0)
            throw GameRoomErrors_1.ColumnFullError;
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
            this.gameState = this.createState({ kind: states_1.GameStateKind.Tie });
        }
        else {
            this.gameState = this.createState({ kind: states_1.GameStateKind.Win, winnerId });
        }
        this.gameStateCallback(this.gameState);
    }
    // Helper functions
    throwDie() {
        return Math.floor(Math.random() * this.game.rules.dieCount) + 1;
    }
    nextPlayerAfter(playerId) {
        const ids = this.game.players.map((p) => p.identifier);
        const index = ids.indexOf(playerId);
        const id = ids[(index + 1) % ids.length];
        return id;
    }
    createNextTurn(previousPlayer) {
        return {
            kind: states_1.GameStateKind.Turn,
            playerId: this.nextPlayerAfter(previousPlayer),
            die: this.throwDie(),
        };
    }
    createState(state) {
        return {
            boardState: (0, board_1.createBoardState)(this.game),
            state: state,
        };
    }
}
exports.GameController = GameController;
//# sourceMappingURL=GameController.js.map