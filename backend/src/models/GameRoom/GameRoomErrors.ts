// Play Errors
export type ErrorDomain = "game" | "game-room";

interface GameError {
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

export const InvalidColumn: GameError = {
  error: "invalid-column",
  domain: "game",
  message: "The selected column is not valid.",
};
