import { Server as WebSocketServer } from "socket.io"
import express, { Request, Response } from "express"
import { createRoom, getRoom, requestPlayerTicket } from "../controllers/RoomService"
import { GameRoom } from "../models/GameRoom/GameRoom"
import { PlayerTicket, RoomJoinResponse, RoomSpectateResponse } from "@knucklebones/shared-models/src/RemoteResponses"
import { InvalidPayload } from "../models/GameRoom/GameRoomErrors"
import Joi from "joi"
import { pino } from "pino"
import { env } from "../environment"

const logger = pino()
export const router = express.Router()

router.post("/create-game", async (req: Request, res: Response) => {
    const schema = Joi.object({
        nickname: Joi.string().required(),
    })

    const { error } = schema.validate(req.body)
    if (error) {
        res.statusCode = 400
        res.send(InvalidPayload(`Invalid payload: ${error.message}`, `params: ${JSON.stringify(req.params)}`))
        logger.error(`Create game request failed. Payload: ${JSON.stringify(req.body)}. Error: ${error.message}`)
        return
    }

    const { nickname } = req.body

    let newRoom: GameRoom
    let playerTicket: PlayerTicket
    try {
        newRoom = await createRoom()
        playerTicket = await requestPlayerTicket(newRoom.code, nickname)
    } catch (error) {
        console.log("this is an error: ", JSON.stringify(error))
        res.statusCode = error.code ?? 500
        res.send({ error, code: error.code })
        return
    }

    const response: RoomJoinResponse = {
        code: newRoom.code,
        ticket: playerTicket,
    }

    res.statusCode = 200
    res.send({
        data: response,
    })
})

router.post("/watch", async (req: Request, res: Response) => {
    const schema = Joi.object({
        roomCode: Joi.string().required(),
    })

    const { error } = schema.validate(req.body)
    if (error) {
        res.statusCode = 400
        res.send(InvalidPayload(`Invalid payload: ${error.message}`, `params: ${JSON.stringify(req.params)}`))
        logger.error(`Watch game request failed. Payload: ${JSON.stringify(req.body)}. Error: ${error.message}`)
        return
    }

    const { roomCode } = req.body
    if (!req.params || !roomCode) {
        res.statusCode = 400
        res.send(InvalidPayload("Missing roomCode", `params: ${JSON.stringify(req.params)}`))
        return
    }

    const response: RoomSpectateResponse = {
        code: roomCode,
    }

    res.statusCode = 200
    res.send({ data: response })
})

router.post("/join", async (req: Request, res: Response) => {
    const schema = Joi.object({
        nickname: Joi.string().required(),
        roomCode: Joi.string().required(),
        token: Joi.string().optional(),
    })

    const { error } = schema.validate(req.body)
    if (error) {
        res.statusCode = 400
        res.send(InvalidPayload(`Invalid payload: ${error.message}`, `params: ${JSON.stringify(req.params)}`))
        logger.error(`Join game request failed. Payload: ${JSON.stringify(req.body)}. Error: ${error.message}`)
        return
    }

    const { nickname, roomCode, token } = req.body

    let room: GameRoom
    let playerTicket: PlayerTicket
    try {
        room = await getRoom(roomCode)
        playerTicket = room.ticket(token)
        if (!playerTicket) {
            playerTicket = await requestPlayerTicket(room.code, nickname)
        }
    } catch (error) {
        console.log(error.stack)
        res.statusCode = error.code ?? 500
        res.send({ error, code: error.code })
        return
    }

    const response: RoomJoinResponse = {
        code: roomCode,
        ticket: playerTicket,
    }

    res.statusCode = 200
    res.send({
        data: response,
    })
})

const io = new WebSocketServer(env.websocketPort, {
    cors: {
        origin: `http://${env.host}:${env.port}`,
    },
})

io.of("/game/play").on("connection", async socket => {
    const { roomCode, token } = socket.handshake.query

    if (!roomCode || !token) {
        socket.emit("bye-bye", "Room code, nickname or token missing missing.")
        socket.disconnect(true)
        return
    }

    try {
        const room = await getRoom(roomCode as string)
        room.handleReconnectRequest(socket, token as string)
    } catch (error) {
        socket.emit("bye-bye", `an error: ${error}`)
        socket.disconnect(true)
    }
})

io.of("/game/watch").on("connection", async socket => {
    const { roomCode } = socket.handshake.query

    if (!roomCode) {
        socket.emit("bye-bye", "Room code or nickname missing.")
        socket.disconnect(true)
        return
    }

    const room = await getRoom(roomCode as string)
    if (!room) {
        socket.emit("bye-bye", "No room with that code.")
        socket.disconnect(true)
        return
    }

    room.spectateGame(socket)
})
