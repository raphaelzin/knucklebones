import { FC } from "react";
import styled from "styled-components";
import Die from "./Die/Die";

export interface PlayerBoardInfoProps {
  isTopBoard: boolean
  nickname?: string
  score?: number
  die?: number
}

const InfoContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
`

export const PlayerBoardInfo: FC<PlayerBoardInfoProps> = ({ nickname, score, die, isTopBoard }) => {
  return (
    <InfoContainer>
      {isTopBoard && <DiceBox die={die} />}
      <div>{nickname ?? "<Not Available>"}</div>
      <div>{score ?? 0}</div>
      {!isTopBoard && <DiceBox die={die} />}
    </InfoContainer>
  )
}

interface DiceBoxProps {
  die?: number;
}

const DiceBoxContainer = styled.div`
  border-width: 3px;
  border-style: solid;
  border-color: #0f0f0f;
  border-radius: 6px;
  display: flex;
  height: 100px;
  width: 120px;
  justify-content: center;
  align-items: center;
`

const DiceBox: FC<DiceBoxProps> = ({ die }) => {
  return (
    <DiceBoxContainer>
      {die && <Die value={die} />}
    </DiceBoxContainer>
  )
}