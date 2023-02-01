export interface PlayerTicket {
  id: string;
  token: string;
}

export interface RoomJoinResponse {
  code: string;
  ticket: PlayerTicket;
}
