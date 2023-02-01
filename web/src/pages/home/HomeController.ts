/* eslint-disable no-throw-literal */
import { RoomJoinResponse } from "@knucklebones/shared-models/src/RemoteResponses";
import { Cookies } from "react-cookie";

export const requestRoomCreation = async (): Promise<RoomJoinResponse> => {
  const response = await fetch("http://localhost:4000/game/create-game", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname: "raphael" }),
  });

  const body = await response.json();
  if (!body || !body["data"]) throw Error("invalid response");
  const data = body["data"] as RoomJoinResponse;
  return Promise.resolve(data);
};

export const requestRoomPlayerSeat = async (
  code: string,
  token: string
): Promise<RoomJoinResponse> => {
  const response = await fetch("http://localhost:4000/game/join", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname: "raphael", roomCode: code, token }),
  });

  const body = await response.json();
  if (!body || !body["data"]) throw Error("invalid response");
  const data = body["data"] as RoomJoinResponse;
  return Promise.resolve(data);
};
