import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Board, PlayerBoardState, Turn } from "../../components/Board/Board";
import { PlayerBoardInfo, PlayerBoardInfoProps } from "../../components/PlayerBoardInfo";
import { GameController, GameControllerInterface } from "./GameController";

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 100px;
  height: 100%;
`

const PlayerInfoContainer = styled.div<{ isOwnBoard: boolean }>`
  display: inline;
  align-self: center;
  ${(p) => p.isOwnBoard ? "padding-top" : "padding-bottom"}: 200px
`

export const GamePage = () => {
  const { roomCode } = useParams()
  let controller = useRef<GameControllerInterface>()

  useEffect(() => {
    // Run! Like go get some data from an API.
    controller.current = new GameController(roomCode ?? "0", "raph")
    controller.current.onStateUpdate = (state) => {
      setTurn(state.turn)
      setBoards(state.boards)

      setOpponentInfo(state.opponentInfo)
      setPlayerInfo(state.playerInfo)
    }
  }, [roomCode]);

  const [opponentInfo, setOpponentInfo] = useState<PlayerBoardInfoProps>()
  const [playerInfo, setPlayerInfo] = useState<PlayerBoardInfoProps>()

  const [turn, setTurn] = useState<Turn>()
  const [boards, setBoards] = useState<PlayerBoardState[]>([])

  return (
    <BoardContainer>
      <PlayerInfoContainer isOwnBoard={true}>
        <PlayerBoardInfo  {...playerInfo} />
      </PlayerInfoContainer>
      <Board boardSize={3} boards={boards} turn={turn ?? "opponent"} onPlay={(index) => {
        console.log(controller.current)
        if (controller.current) controller.current.play(index);
      }} />
      <PlayerInfoContainer isOwnBoard={false}>
        <PlayerBoardInfo  {...opponentInfo} />
      </PlayerInfoContainer>
    </BoardContainer>
  )
}