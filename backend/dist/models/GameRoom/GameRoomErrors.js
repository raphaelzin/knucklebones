"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPayload = exports.FullHouseError = exports.InvalidColumn = exports.InvalidMoveError = exports.WrongTurnError = exports.ColumnFullError = void 0;
exports.ColumnFullError = {
    error: "column-full",
    domain: "game",
    message: "The selected column is already full",
};
exports.WrongTurnError = {
    error: "wrong-player-turn",
    domain: "game",
    message: "It is not your turn.",
};
exports.InvalidMoveError = {
    error: "invalid-move",
    domain: "game",
    message: "This is an invalid play",
};
exports.InvalidColumn = {
    error: "invalid-column",
    domain: "game",
    message: "The selected column is not valid.",
};
exports.FullHouseError = {
    error: "full-house",
    domain: "game",
    message: "This game is already full. Consider entering as a spectator",
};
const InvalidPayload = (message, debugMessage = undefined) => {
    return {
        error: "invalid-payload",
        domain: "game-room",
        message,
        debugMessage,
    };
};
exports.InvalidPayload = InvalidPayload;
//# sourceMappingURL=GameRoomErrors.js.map