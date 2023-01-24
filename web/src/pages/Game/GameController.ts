import { io, Socket } from "socket.io-client";
import { Cookies } from "react-cookie";

import {
  PlayerBoardState as LocalPlayerBoardState,
  Turn as LocalTurn,
} from "../../components/Board/Board";
import { PlayerBoardInfoProps } from "../../components/PlayerBoardInfo";
import { GameStateSummary as RemoteGameStateSummary } from "@knucklebones/shared-models/src/RemoteState";

export interface GameControllerInterface {
  roomCode: string;
  onStateUpdate?: (state: LocalGameState) => void;
  onEvent?: (event: any) => void;
  play(column: number): void;
}

export interface LocalGameState {
  boards: LocalPlayerBoardState[];
  turn: LocalTurn;
  opponentInfo: PlayerBoardInfoProps;
  playerInfo: PlayerBoardInfoProps;
}

export class GameController implements GameControllerInterface {
  onStateUpdate?: (state: LocalGameState) => void = undefined;
  onEvent?: (event: any) => void = undefined;
  socket: Socket;
  cookies: Cookies;

  roomCode: string;
  token?: string;
  id?: string;

  constructor(roomCode: string, nickname: string) {
    this.cookies = new Cookies();
    this.roomCode = roomCode;
    const token = this.cookies.get(`tokens-room-${this.roomCode}`);

    let query: any = { nickname, roomCode };
    if (token) {
      this.token = token;
      query["token"] = token;
    }

    // TODO: use dot env
    this.socket = io(`localhost:4444/game/play`, {
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
      this.id = args.id;
      this.cookies.set(`tokens-room-${this.roomCode}`, args.token, {
        maxAge: 3600,
      });
    });

    this.socket.on("reconnect", (args) => {
      if (!args.success) {
        this.cookies.remove(`tokens-room-${this.roomCode}`);
      }
      this.id = args.id;
    });

    this.socket.on("game-state-update", (args) => {
      console.log(`Game State: ${JSON.stringify(args)}`);
      const newLocalState = this.convertRemoteToLocalState(args.state);
      if (this.onStateUpdate) this.onStateUpdate(newLocalState);
    });
  }

  convertRemoteToLocalState(state: RemoteGameStateSummary): LocalGameState {
    // eslint-disable-next-line no-throw-literal
    if (!this.id) throw { message: "wtf, I don't have an id" };

    let playerBoards: LocalPlayerBoardState[] = [];
    let playerInfo: PlayerBoardInfoProps = {};
    let opponentInfo: PlayerBoardInfoProps = {};

    for (const key of Object.keys(state.boardState.players)) {
      const board = state.boardState.players[key];
      const localBoard: LocalPlayerBoardState = {
        grid: board.board,
        score: board.score,
        owner: key === this.id ? "self" : "opponent",
      };

      // Is self
      if (key === this.id) {
        playerBoards.push(localBoard);
        playerInfo.score = localBoard.score;
        playerInfo.nickname = board.nickname;
      } else {
        playerBoards.splice(0, 0, localBoard);
        opponentInfo.score = localBoard.score;
        opponentInfo.nickname = board.nickname;
      }
    }

    if (state.state.kind === "turn") {
      if (state.state.playerId === this.id) {
        playerInfo.die = state.state.die;
      } else {
        opponentInfo.die = state.state.die;
      }

      return {
        boards: playerBoards,
        turn: state.state.playerId === this.id ? "self" : "opponent",
        playerInfo,
        opponentInfo,
      };
    }

    return {
      boards: playerBoards,
      turn: "opponent",
      playerInfo,
      opponentInfo,
    };
  }
}
