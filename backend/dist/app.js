var $1FMIp$express = require("express");
var $1FMIp$cors = require("cors");
var $1FMIp$socketio = require("socket.io");
var $1FMIp$crypto = require("crypto");
var $1FMIp$murmurhash = require("murmurhash");

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}



/* eslint-disable @typescript-eslint/no-explicit-any */ function $ecacab428e61e01a$export$89afb3b1226ef1c9(game) {
    const state = {};
    for (const player of game.players)state[player.identifier] = {
        nickname: player.nickname,
        board: player.board,
        score: game.rules.calculateScore(player.board)
    };
    return {
        players: state
    };
}
function $ecacab428e61e01a$export$cae4205f9169b2e9(id, game) {
    for (const player of game.players){
        if (player.identifier == id) return player;
    }
    return undefined;
}


class $4b804b1cef173b97$var$DiceTower {
    throwDice(diceCount, sides) {
        return Math.floor(Math.random() * sides * diceCount) + 1;
    }
}
var $4b804b1cef173b97$export$2e2bcd8739ae039 = new $4b804b1cef173b97$var$DiceTower();


// Play Errors
const $8925cb211138c4b2$export$12f3fca0ab75890f = {
    name: "column-full",
    domain: "game",
    message: "The selected column is already full"
};
const $8925cb211138c4b2$export$3528e15a3aebe6cd = {
    name: "wrong-player-turn",
    domain: "game",
    message: "It is not your turn."
};
const $8925cb211138c4b2$export$61011c9359f9bd4a = {
    name: "invalid-move",
    domain: "game",
    message: "This is an invalid play"
};
const $8925cb211138c4b2$export$982d9566950a5c3e = {
    name: "invalid-column",
    domain: "game",
    message: "The selected column is not valid."
};
const $8925cb211138c4b2$export$31f1c7902a035837 = {
    name: "full-house",
    domain: "game",
    message: "This game is already full. Consider entering as a spectator"
};
const $8925cb211138c4b2$export$18a9427d80c1a057 = (message, debugMessage)=>{
    return {
        name: "invalid-payload",
        domain: "game-room",
        message: message,
        debugMessage: debugMessage
    };
};


class $cbed54bc08405ed8$export$f3f3f6c0124f08de {
    gameStateCallback = undefined;
    constructor(rules, diceTower = (0, $4b804b1cef173b97$export$2e2bcd8739ae039)){
        this.diceTower = diceTower;
        this.game = {
            rules: rules,
            players: []
        };
        this.gameStateSummary = this.createState({
            kind: "waiting-player"
        });
    }
    gameIsFull() {
        return this.game.players.length == this.game.rules.numberOfPlayers;
    }
    enterGame(nickname, identifier) {
        const board = [];
        for(let i = 0; i < this.game.rules.boardSize; i++)board.push([]);
        this.game.players.push({
            identifier: identifier,
            nickname: nickname,
            board: board
        });
        // Reached the number of players, start game.
        if (this.game.players.length == this.game.rules.numberOfPlayers) {
            this.gameStateSummary = this.createState(this.createNextTurn(this.game.players[0].identifier));
            this.gameStateCallback(this.gameStateSummary);
        }
    }
    play(col, playerId) {
        if (this.gameStateSummary.state.kind != "turn") throw 0, $8925cb211138c4b2$export$61011c9359f9bd4a;
        if (this.gameStateSummary.state.playerId != playerId) throw 0, $8925cb211138c4b2$export$3528e15a3aebe6cd;
        const die = this.gameStateSummary.state.die;
        const player = this.game.players.filter((p)=>p.identifier == playerId)[0];
        // If the column is already full, throw error.
        if (player.board[col].length >= this.game.rules.boardSize || col < 0) throw 0, $8925cb211138c4b2$export$12f3fca0ab75890f;
        for (const player1 of this.game.players)if (player1.identifier != playerId) // Removes instances of die in that column of other players
        player1.board[col] = player1.board[col].filter((x)=>x != die);
        else // Adds die to current player
        player1.board[col].push(die);
        // Finish game if applicable
        if (this.game.rules.evaluateGameEnd(this.game)) {
            this.finishGame();
            return;
        }
        this.gameStateSummary = this.createState(this.createNextTurn(playerId));
        this.gameStateCallback(this.gameStateSummary);
    }
    finishGame() {
        let bestScore = -1;
        let winnerId = undefined;
        for (const player of this.game.players){
            const score = this.game.rules.calculateScore(player.board);
            if (score > bestScore) {
                bestScore = score;
                winnerId = player.identifier;
            } else if (score == bestScore) winnerId = undefined;
        }
        if (!winnerId) this.gameStateSummary = this.createState({
            kind: "tie"
        });
        else this.gameStateSummary = this.createState({
            kind: "win",
            winnerId: winnerId
        });
        this.gameStateCallback(this.gameStateSummary);
    }
    // Helper functions
    nextPlayerAfter(playerId) {
        const ids = this.game.players.map((p)=>p.identifier);
        const index = ids.indexOf(playerId);
        const id = ids[(index + 1) % ids.length];
        return id;
    }
    createNextTurn(previousPlayer) {
        return {
            kind: "turn",
            playerId: this.nextPlayerAfter(previousPlayer),
            die: this.diceTower.throwDice(1, this.game.rules.dieSideCount)
        };
    }
    createState(state) {
        return {
            boardState: (0, $ecacab428e61e01a$export$89afb3b1226ef1c9)(this.game),
            state: state
        };
    }
}


class $e21924dae8dc3455$var$DefaultRules {
    boardSize = 3;
    dieSideCount = 6;
    numberOfPlayers = 2;
    evaluateGameEnd(game) {
        const boards = game.players.map((p)=>p.board);
        for(const key in boards){
            const board = boards[key];
            let isFull = true;
            for (const col of board)if (col.length != this.boardSize) {
                isFull = false;
                break;
            }
            if (isFull) return true;
        }
        return false;
    }
    calculateScore(board) {
        let score = 0;
        let occurrencesDict = {};
        for (const column of board){
            occurrencesDict = {};
            for (const num of column)occurrencesDict[num] = (occurrencesDict[num] ?? 0) + 1;
            for(const key in occurrencesDict){
                if (occurrencesDict[key] == 2) score = score + parseInt(key) * 4;
                else if (occurrencesDict[key] == 3) score = score + parseInt(key) * 7;
                else score += parseInt(key);
            }
        }
        return score;
    }
}
var $e21924dae8dc3455$export$2e2bcd8739ae039 = new $e21924dae8dc3455$var$DefaultRules();




class $c9b2dff07f2e6e1c$export$ddffd877baf3c775 {
    constructor(code){
        this.code = code;
        this.controller = new (0, $cbed54bc08405ed8$export$f3f3f6c0124f08de)((0, $e21924dae8dc3455$export$2e2bcd8739ae039));
        this.controller.gameStateCallback = (state)=>{
            this.handleGameStateChange(state);
        };
        this.spectators = [];
        this.players = [];
    }
    // enterGame(
    //   socket: IOSocket,
    //   nickname: string,
    //   existingId: string | undefined
    // ) {
    //   // If user already has an id, he's trying to reconnect.
    //   if (existingId) {
    //     this.handleReconnectRequest(socket, existingId);
    //     return;
    //   }
    //   // if room is full, throw error so router can close socket.
    //   if (this.controller.gameIsFull()) {
    //     this.emit(socket, { kind: "error", error: FullHouseError });
    //     socket.disconnect(true);
    //     return;
    //   }
    //   const id = randomUUID();
    //   const token = randomUUID();
    //   const client: GameRoomClient = { id, socket, token };
    //   this.emit(socket, { kind: "welcome", id, token });
    //   this.setupListeners(socket);
    //   // this.players.push(client);
    //   // this.controller.enterGame(nickname, id);
    // }
    playerConnect(socket, token) {
        const filteredPlayers = this.players.filter((player)=>player.token === token);
        if (filteredPlayers.length == 0) {
            this.emit(socket, {
                kind: "error",
                error: (0, $8925cb211138c4b2$export$31f1c7902a035837)
            });
            socket.disconnect(true);
        }
        filteredPlayers[0].socket = socket;
        this.setupListeners(socket);
    }
    registerPlayer(nickname) {
        if (this.controller.gameIsFull()) throw 0, $8925cb211138c4b2$export$31f1c7902a035837;
        const id = (0, $1FMIp$crypto.randomUUID)();
        const token = (0, $1FMIp$crypto.randomUUID)();
        console.log("will try to enter game");
        this.controller.enterGame(nickname, id);
        console.log("entered the game");
        const client = {
            id: id,
            token: token
        };
        console.log(`players: ${this.players}`);
        this.players.push(client);
        console.log(`client: ${client}`);
        return {
            id: id,
            token: token
        };
    }
    spectateGame(socket) {
        const id = (0, $1FMIp$crypto.randomUUID)();
        const token = (0, $1FMIp$crypto.randomUUID)();
        const client = {
            id: id,
            socket: socket,
            token: token
        };
        this.emit(socket, {
            kind: "welcome",
            id: id,
            token: token
        });
        this.spectators.push(client);
    }
    setupListeners(socket) {
        socket.on("game-event", (payload)=>{
            this.handlePlay(socket, payload);
        });
    }
    handlePlay(socket, payload) {
        const { column: column , token: token  } = payload;
        const player = this.players.filter((p)=>p.token == token)[0];
        if (column === undefined || !player) {
            this.emit(socket, {
                kind: "error",
                error: (0, $8925cb211138c4b2$export$18a9427d80c1a057)("Invalid or missing Column or token", payload)
            });
            return;
        }
        try {
            this.controller.play(column, player.id);
        } catch (error) {
            this.emit(socket, {
                kind: "error",
                error: error
            });
        }
    }
    handleReconnectRequest(socket, token) {
        const player = this.players.filter((p)=>p.token == token)[0];
        if (!player) {
            this.emit(socket, {
                kind: "reconnect",
                success: false,
                error: `No player with token "${token}" in this room.`
            });
            return;
        }
        // Replaces socket with new one.
        player.socket = socket;
        // Confirm reconnection.
        this.setupListeners(socket);
        this.emit(socket, {
            kind: "reconnect",
            success: true,
            id: player.id
        });
        this.emit(socket, {
            kind: "game-state-update",
            state: this.controller.gameStateSummary
        });
    }
    emit(socket, event) {
        socket.emit(event.kind, event);
    }
    handleGameStateChange(state) {
        for (const client of [
            ...this.players,
            ...this.spectators
        ])if (client.socket) this.emit(client.socket, {
            kind: "game-state-update",
            state: state
        });
    }
}



// const client = createClient({
//   url: "",
// });
// const RoomStateStream = (code: string) => `room-stream-state-${code}`;
// const StreamRoom = (code: string) => `room-stream-${code}`;
// const PubSubRoom = (code: string) => `room-pubsub-${code}`;
// Generates a RoomSummary cache key from a code.
// const RoomSummaryKey = (code: string) => `room-summary-${code}`;
// export interface RoomSummary {
//   stateSummary: GameStateSummary;
//   rules: "default";
//   code: string;
// }
// const StreamStartEvent = (code: string) => {
//   return `room ${code} created at ${new Date()}`;
// };
// const addStreamEntry = async (
//   entry: Record<string, string>,
//   streamId: string,
//   createOnMiss = false
// ) => {
//   return await client.xAdd(streamId, "*", entry, {
//     NOMKSTREAM: createOnMiss ? true : undefined,
//   });
// };
const $c57c9ea430dd510b$var$rooms = [];
const $c57c9ea430dd510b$export$ddb5e34974173ddf = async (code)=>{
    //   const streamId = RoomStateStream(code);
    //   if ((await client.exists(streamId)) !== 1) {
    //     throw "room not found";
    //   }
    const room = $c57c9ea430dd510b$var$rooms.filter((room)=>room.code === code)[0];
    if (!room) throw "room not found";
    return room;
};
const $c57c9ea430dd510b$export$4a6fbf23fa252689 = async ()=>{
    const code = (0, ($parcel$interopDefault($1FMIp$murmurhash))).v3((0, $1FMIp$crypto.randomUUID)());
    // const streamId = RoomStateStream(code);
    // const startEvent = { event: StreamStartEvent(code) };
    // await addStreamEntry(startEvent, streamId, true);
    const newRoom = new (0, $c9b2dff07f2e6e1c$export$ddffd877baf3c775)(`${code}`);
    $c57c9ea430dd510b$var$rooms.push(newRoom);
    return newRoom;
};
const $c57c9ea430dd510b$export$924ba676f7e3a2d = async (code, nickname)=>{
    const room = await $c57c9ea430dd510b$export$ddb5e34974173ddf(code);
    return room.registerPlayer(nickname);
};


const $3f204e84b16f54c0$export$5375cda95f0b0eb4 = (0, ($parcel$interopDefault($1FMIp$express))).Router();
$3f204e84b16f54c0$export$5375cda95f0b0eb4.post("/create-game", async (req, res)=>{
    const { nickname: nickname  } = req.body;
    if (!req.params || !nickname) {
        res.statusCode = 400;
        res.send({
            code: "Nope"
        });
        return;
    }
    let newRoom;
    let playerTicket;
    try {
        newRoom = await (0, $c57c9ea430dd510b$export$4a6fbf23fa252689)();
        playerTicket = await (0, $c57c9ea430dd510b$export$924ba676f7e3a2d)(newRoom.code, nickname);
    } catch (error) {
        res.statusCode = error.code ?? 500;
        res.send({
            error: error,
            code: error.code
        });
        return;
    }
    const response = {
        code: newRoom.code,
        ticket: playerTicket
    };
    res.statusCode = 200;
    res.send({
        data: response
    });
});
$3f204e84b16f54c0$export$5375cda95f0b0eb4.post("/join", async (req, res)=>{
    const { nickname: nickname , roomCode: roomCode  } = req.body;
    if (!req.params || !nickname) {
        res.statusCode = 400;
        res.send({
            code: "Nope"
        });
        return;
    }
    let room;
    let playerTicket;
    try {
        room = await (0, $c57c9ea430dd510b$export$ddb5e34974173ddf)(roomCode);
        playerTicket = await (0, $c57c9ea430dd510b$export$924ba676f7e3a2d)(room.code, nickname);
    } catch (error) {
        res.statusCode = error.code ?? 500;
        res.send({
            error: error,
            code: error.code
        });
        return;
    }
    const response = {
        code: roomCode,
        ticket: playerTicket
    };
    res.statusCode = 200;
    res.send({
        data: response
    });
});
// TODO: use dotenv
const $3f204e84b16f54c0$var$io = new (0, $1FMIp$socketio.Server)(4444, {
    cors: {
        origin: "http://localhost:3000"
    }
});
$3f204e84b16f54c0$var$io.of("/game/play").on("connection", async (socket)=>{
    const { roomCode: roomCode , nickname: nickname , token: token  } = socket.handshake.query;
    if (!roomCode || !nickname) {
        socket.emit("bye-bye", "Room code or nickname missing.");
        socket.disconnect(true);
        return;
    }
    try {
        const room = await (0, $c57c9ea430dd510b$export$ddb5e34974173ddf)(roomCode);
        room.playerConnect(socket, token);
    } catch (error) {
        socket.emit("bye-bye", `an error: ${error}`);
        socket.disconnect(true);
    }
});
$3f204e84b16f54c0$var$io.of("/game/watch").on("connection", async (socket)=>{
    const { roomCode: roomCode  } = socket.handshake.query;
    if (!roomCode) {
        socket.emit("bye-bye", "Room code or nickname missing.");
        socket.disconnect(true);
        return;
    }
    const room = await (0, $c57c9ea430dd510b$export$ddb5e34974173ddf)(roomCode);
    if (!room) {
        socket.emit("bye-bye", "No room with that code.");
        socket.disconnect(true);
        return;
    }
    room.spectateGame(socket);
});




const $9d7548254fcccc8a$var$app = (0, ($parcel$interopDefault($1FMIp$express)))();
$9d7548254fcccc8a$var$app.use((0, ($parcel$interopDefault($1FMIp$express))).json());
$9d7548254fcccc8a$var$app.use((0, ($parcel$interopDefault($1FMIp$cors)))({
    origin: [
        "http://localhost:3000"
    ]
}));
$9d7548254fcccc8a$var$app.use("/game", (0, $3f204e84b16f54c0$export$5375cda95f0b0eb4));
$9d7548254fcccc8a$var$app.listen(4000, ()=>{
    console.log(`⚡️[server]: Server is running at https://localhost:${4000}`);
});


//# sourceMappingURL=app.js.map
