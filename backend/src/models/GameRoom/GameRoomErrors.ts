// Play Errors
export type ErrorDomain = "game" | "game-room";

export interface GameError extends Error {
  name: string;
  domain: ErrorDomain;
  debugMessage?: string;
  message: string;
}

export const ColumnFullError: GameError = {
  name: "column-full",
  domain: "game",
  message: "The selected column is already full",
};

export const WrongTurnError: GameError = {
  name: "wrong-player-turn",
  domain: "game",
  message: "It is not your turn.",
};

export const InvalidMoveError: GameError = {
  name: "invalid-move",
  domain: "game",
  message: "This is an invalid play",
};

export const InvalidColumn: GameError = {
  name: "invalid-column",
  domain: "game",
  message: "The selected column is not valid.",
};

export const FullHouseError: GameError = {
  name: "full-house",
  domain: "game",
  message: "This game is already full. Consider entering as a spectator",
};

export const InvalidPayload = (
  message: string,
  debugMessage: string = undefined
): GameError => {
  return {
    name: "invalid-payload",
    domain: "game-room",
    message,
    debugMessage,
  };
};
