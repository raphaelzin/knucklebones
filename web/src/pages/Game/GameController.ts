import { io, Socket } from "socket.io-client";
import { Cookies } from "react-cookie";
import { Rules } from "@knucklebones/shared-models/src/Rules";

import { PlayerBoardState as LocalPlayerBoardState } from "../../components/Board/Board";
import { GameStateSummary as RemoteGameStateSummary } from "@knucklebones/shared-models/src/RemoteState";

export interface GameControllerInterface {
  roomCode: string;
  id?: string;
  rules?: Rules;
  onStateUpdate?: (state: RemoteGameStateSummary) => void;
  onEvent?: (event: any) => void;
  play(column: number): void;
}

export class GameController implements GameControllerInterface {
  onStateUpdate?: (state: RemoteGameStateSummary) => void = undefined;
  onEvent?: (event: any) => void = undefined;
  socket: Socket;
  cookies: Cookies;

  rules?: Rules;
  roomCode: string;
  token?: string;
  id?: string;

  constructor(roomCode: string, nickname: string, isSpectating: boolean) {
    this.cookies = new Cookies();
    this.roomCode = roomCode;
    const token = this.cookies.get(`token`);

    let query: any = { nickname, roomCode };
    if (token) {
      this.token = token;
      query["token"] = token;
    }

    // TODO: use dot env
    const path = isSpectating ? `watch` : `play`;
    this.socket = io(`localhost:4444/game/${path}`, {
      transports: ["websocket"],
      query,
    });
    this.setupListeners();
  }

  play(column: number) {
    console.log(`Emitting play at col ${column}`);
    this.socket.emit("game-event", { token: this.token, column });
  }

  setupListeners() {
    this.socket.on("error", (args) => {
      console.log(JSON.stringify(args));
    });

    this.socket.on("welcome", (args) => {
      this.token = args.token;
      this.rules = args.rules;
      this.id = args.id;
      this.cookies.set(`token`, args.token, {
        maxAge: 3600,
      });
    });

    this.socket.on("reconnect", (args) => {
      if (!args.success) {
        this.cookies.remove(`token`);
      }
      this.id = args.id;
      this.rules = args.rules;
    });

    this.socket.on("game-state-update", (args) => {
      this.onStateUpdate?.(args.state as RemoteGameStateSummary);
    });
  }
}

export const GetBoardsFromRemoteState = (
  state: RemoteGameStateSummary
): LocalPlayerBoardState[] => {
  let boards: LocalPlayerBoardState[] = [];

  for (const key of Object.keys(state.boardState.players)) {
    const board = state.boardState.players[key];
    const localBoard: LocalPlayerBoardState = {
      grid: board.board,
      score: board.score,
      playerId: key,
    };

    boards.push(localBoard);
  }
  return boards;
};
