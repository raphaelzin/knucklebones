import { addMessageToStream, getLastNFromStream } from "./RedisHelper"
import client from "./redis"
import { GameStateSummary } from "@knucklebones/shared-models"

const roomPrefix = "room:"

export const getRoomState = async (code: string) => {
    const key = `${roomPrefix}${code}`
    const state = await getLastNFromStream<GameStateSummary>(key, 1, message => JSON.parse(message["state"]), client)

    return state
}

export const appendRoomState = async (code: string, state: GameStateSummary) => {
    const key = `${roomPrefix}${code}`
    const result = addMessageToStream(key, { state: JSON.stringify(state) }, client)
    return result
}
