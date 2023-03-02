/* eslint-disable no-throw-literal */
import {
  DefaultResponse,
  ResponseError,
  RoomCreationResponse,
  RoomJoinResponse,
} from "@knucklebones/shared-models/src/RemoteResponses";
import axios from "axios";

export const requestRoomCreation = async (
  nickname: string
): Promise<RoomCreationResponse> => {
  try {
    const { data } = await axios.post<
      DefaultResponse<RoomCreationResponse, Error>
    >("http://localhost:4000/game/create-game", {
      nickname,
    });

    return Promise.resolve(data.data);
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      const message = error.response?.data.message;

      if (message) {
        return Promise.reject(message);
      }
    }

    return Promise.reject(error);
  }
};

export const requestRoomPlayerSeat = async (
  code: string,
  token: string,
  nickname: string
): Promise<RoomJoinResponse> => {
  try {
    const { data } = await axios.post<DefaultResponse<RoomJoinResponse, Error>>(
      "http://localhost:4000/game/join",
      {
        nickname,
        roomCode: code,
        token,
      }
    );
    return Promise.resolve(data.data);
  } catch (error) {
    if (axios.isAxiosError<ResponseError>(error)) {
      const message = error.response?.data.message;

      if (message) {
        return Promise.reject(message);
      }
    }

    return Promise.reject(error);
  }
};
