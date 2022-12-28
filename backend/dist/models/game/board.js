"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayer = exports.createBoardState = void 0;
function createBoardState(game) {
    const state = {};
    for (const player of game.players) {
        state[player.identifier] = {
            board: player.board,
            score: game.rules.calculateScore(player.board),
        };
    }
    return { players: state };
}
exports.createBoardState = createBoardState;
function getPlayer(id, game) {
    for (const player of game.players) {
        if (player.identifier == id)
            return player;
    }
    return undefined;
}
exports.getPlayer = getPlayer;
//# sourceMappingURL=board.js.map