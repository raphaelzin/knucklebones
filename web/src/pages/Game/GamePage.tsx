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
  margin-top: 40px;
`

const PlayerInfoContainer = styled.div<{ isOwnBoard: boolean }>`
  display: inline;
  align-self: center;
  ${(p) => p.isOwnBoard ? "padding-top" : "padding-bottom"}: 200px
`

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
`

export const GamePage = () => {
  const { roomCode } = useParams()
  let controller = useRef<GameControllerInterface>()

  useEffect(() => {
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
    <PageContainer>
      Room Code: <strong>{controller.current?.roomCode}</strong>
      < BoardContainer >
        <PlayerInfoContainer isOwnBoard={true}>
          <PlayerBoardInfo  {...playerInfo} />
        </PlayerInfoContainer>
        <Board boardSize={3} boards={boards} turn={turn ?? "opponent"} onPlay={(index) => {
          if (controller.current) controller.current.play(index);
        }} />
        <PlayerInfoContainer isOwnBoard={false}>
          <PlayerBoardInfo  {...opponentInfo} />
        </PlayerInfoContainer>
      </BoardContainer >
    </ PageContainer>
  )
}