export interface PlayerTicket {
  id: string;
  token: string;
}

export interface RoomJoinResponse {
  code: string;
  ticket: PlayerTicket;
}

export interface RoomCreationResponse {
  code: string;
  ticket: PlayerTicket;
}

export interface ResponseError extends Error {
  message: string;
}
