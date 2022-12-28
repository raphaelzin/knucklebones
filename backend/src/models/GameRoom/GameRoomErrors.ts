// Play Errors
export type ErrorDomain = "game" | "game-room";

export interface GameError {
  error: string;
  domain: ErrorDomain;
  debugMessage?: string;
  message: string;
}

export const ColumnFullError: GameError = {
  error: "column-full",
  domain: "game",
  message: "The selected column is already full",
};

export const WrongTurnError: GameError = {
  error: "wrong-player-turn",
  domain: "game",
  message: "It is not your turn.",
};

export const InvalidMoveError: GameError = {
  error: "invalid-move",
  domain: "game",
  message: "This is an invalid play",
};

export const InvalidColumn: GameError = {
  error: "invalid-column",
  domain: "game",
  message: "The selected column is not valid.",
};

export const FullHouseError: GameError = {
  error: "full-house",
  domain: "game",
  message: "This game is already full. Consider entering as a spectator",
};

export const InvalidPayload = (
  message: string,
  debugMessage: string = undefined
): GameError => {
  return {
    error: "invalid-payload",
    domain: "game-room",
    message,
    debugMessage,
  };
};
