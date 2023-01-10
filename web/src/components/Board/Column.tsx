import { FC } from "react";
import styled from "styled-components";
import Die from "../Die/Die";
import { BoardCell } from "./Cell";

const BoardColumnContainer = styled.div<{ isOwnBoard: boolean, isActiveTurn: boolean }>`
  display: flex;
  flex-direction: ${(p) => !p.isOwnBoard ? "column-reverse" : "column"};
  gap: 10px;

  ${(p) => p.isActiveTurn && p.isOwnBoard ? `:hover ${BoardCell} {
    border-color: blue;
    border-style: dashed;
    }` : ""}
`

interface BoardColumnProps {
  size: number;
  dice: number[];
  isOwnBoard: boolean;
  isActiveTurn: boolean;
}

export const BoardColumn: FC<BoardColumnProps> = ({ size, dice, isActiveTurn, isOwnBoard }) => {
  let cells = []

  for (let i = 0; i < size; i++) {
    cells.push(
      <BoardCell key={i}>
        {dice.length > i && <Die value={dice[i]} />}
      </BoardCell>
    )
  }

  return (
    <BoardColumnContainer isActiveTurn={isActiveTurn} isOwnBoard={isOwnBoard}>
      <> {cells} </>
    </BoardColumnContainer>
  )
}