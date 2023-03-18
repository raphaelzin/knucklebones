import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { EndGameBanner, PlayerBoard, ScoreBoard } from "../../components/Board/Board";
import { PlayerBoardInfo } from "../../components/PlayerBoardInfo";
import { GameController, GameControllerInterface } from "./GameController";
import { GameStateSummary } from "@knucklebones/shared-models/src/RemoteState";

const GameContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 100px;
  height: 100%;
  margin-top: 40px;
`

const PlayerInfoContainer = styled.div<{ isOwnBoard: boolean }>`
  display: flex;
  flex-direction: column;
  align-self: center;
  ${(p) => p.isOwnBoard ? "padding-top" : "padding-bottom"}: 200px
`

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
`

const BoardContainer = styled.div`
  display: flex;
  gap: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export interface PlayerInfo {
  nickname: string;
  score: number;
  id: string;
  board: number[][];
}

export const GamePage = () => {
  const { roomCode } = useParams()
  let controller = useRef<GameControllerInterface>()
  const [gameStateSummary, setGameStateSummary] = useState<GameStateSummary | undefined>()
  const isSpectating = useLocation().state?.isSpectating ?? false

  useEffect(() => {
    controller.current = new GameController(roomCode ?? "0", "raph", isSpectating)
    controller.current.onStateUpdate = (state) => {
      setGameStateSummary(state);
    }
  }, [roomCode, isSpectating]);

  if (!gameStateSummary) return (<div>Loading...</div>)
  console.log(gameStateSummary)
  const boards = gameStateSummary.boardState.players
  const state = gameStateSummary.state



  const selfId = controller.current?.id ?? "";
  const playerInfos: PlayerInfo[] = Object.keys(boards).map((id, i) => {
    const board = boards[id]
    return {
      nickname: board.nickname,
      score: board.score,
      board: board.board,
      id: id
    }
  })

  const playerInfo = playerInfos.find((p, i) => {
    return isSpectating ? i === 0 : p.id === selfId;
  })
  const opponentInfo = playerInfos.find((p, i) => {
    return isSpectating ? i !== 0 : p.id !== selfId;
  })

  const onPlay = (column: number) => {
    if (controller.current) controller.current.play(column)
  };

  const boardSize = controller.current?.rules?.boardSize ?? 3;
  const isMyTurn = state?.kind === "turn" && state.playerId === selfId;
  const isGameFinished = state.kind === "win" || state.kind === "tie";

  return (
    <PageContainer>
      Room Code: <strong>{controller.current?.roomCode}</strong>

      {state.kind === "waiting-player" && (
        <>
          <h2>Waiting for another player...</h2>
          {state.playersPresent.length > 0 && <h3 style={{ margin: 0 }}>Players Present:</h3>}
          {state.playersPresent.map((p, i) => <p key={i} style={{ margin: 0 }}>{p.nickname}</p>)}
        </>
      )}

      {state.kind !== "waiting-player" && (
        <GameContainer>
          {!isGameFinished && (
            <PlayerInfoContainer isOwnBoard={!isSpectating}>
              <PlayerBoardInfo {...playerInfo} isTopBoard={false} die={state.kind === "turn" && state.playerId === playerInfo?.id ? state.die : undefined} />
            </PlayerInfoContainer>
          )}
          <BoardContainer>
            {opponentInfo && (
              <PlayerBoard
                grid={opponentInfo.board}
                size={boardSize} />
            )}
            {isGameFinished && (
              <>
                {isSpectating && (
                  <div>
                    <h1>{"Game Over!"}</h1>
                    <ScoreBoard firstPlayer={playerInfo!} secondPlayer={opponentInfo!} />
                  </div>
                )}
                {!isSpectating && (
                  <EndGameBanner
                    playerInfo={playerInfo!}
                    opponentInfo={opponentInfo!}
                    state={state}
                    userId={selfId}
                  />
                )}
              </>
            )}
            {playerInfo && (
              <PlayerBoard
                onPlay={onPlay}
                grid={playerInfo.board}
                size={boardSize}
                isActiveTurn={isMyTurn}
                isOwnBoard={!isSpectating} />
            )}
          </BoardContainer>
          {!isGameFinished && (
            <PlayerInfoContainer isOwnBoard={false}>
              <PlayerBoardInfo  {...opponentInfo} isTopBoard={true} die={state.kind === "turn" && state.playerId === opponentInfo?.id ? state.die : undefined} />
            </PlayerInfoContainer>
          )}
        </GameContainer >
      )}
    </ PageContainer>
  )
}