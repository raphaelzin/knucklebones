/* eslint-disable no-throw-literal */
export const requestRoomCreation = async (): Promise<string> => {
  const response = await fetch("http://localhost:4000/game/create-game", {
    method: "POST",
    mode: "cors",
  });

  const body = await response.json();
  if (body["data"] && body.data["code"]) {
    return body.data.code;
  }

  throw Error("invalid response");
};
