import { FC } from "react";
import styled from "styled-components";
import { BoardColumn } from "./Column";

export type BoardOwner = "self" | "opponent"
export type Turn = "self" | "opponent"

const BoardContainer = styled.div`
  display: flex;
  gap: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export interface PlayerBoardState {
  grid: number[][];
  score: number;
  owner: BoardOwner;
}

export interface BoardProps {
  boards: PlayerBoardState[]
  boardSize: number;
  turn: Turn;
  onPlay: (column: number) => void
}

export const Board: FC<BoardProps> = ({ boards, boardSize, turn, onPlay }) => {
  let playerBoards = []

  for (let i = 0; i < boards.length; i++) {
    const p = boards[i]
    playerBoards.push(
      <PlayerBoard
        key={i}
        onPlay={onPlay}
        grid={p.grid}
        size={boardSize}
        isActiveTurn={turn === "self"}
        isOwnBoard={p.owner === "self"} />)
  }

  return (
    <BoardContainer>
      <>
        {playerBoards}
      </>
    </BoardContainer>
  )
}

export interface PlayerBoardProps {
  isOwnBoard: boolean
  isActiveTurn: boolean
  size: number
  grid: number[][]
  onPlay: (column: number) => void
}

const PlayerBoardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
`

const ColumnButton = styled.button`
  background-color: transparent;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  overflow: hidden;
  outline: none;
`

export const PlayerBoard: FC<PlayerBoardProps> = ({ size, grid, isOwnBoard, isActiveTurn, onPlay }) => {
  let columns = []

  const onColSelection = (index: number) => {
    if (isActiveTurn) onPlay(index);
  }

  for (let i = 0; i < size; i++) {
    columns.push(
      <ColumnButton key={i} onClick={() => onColSelection(i)}>
        <BoardColumn key={i} isOwnBoard={isOwnBoard} isActiveTurn={isActiveTurn} size={size} dice={grid[i] ?? []} />
      </ColumnButton>
    )
  }

  return (
    <PlayerBoardContainer>
      <> {columns} </>
    </PlayerBoardContainer>
  )
}