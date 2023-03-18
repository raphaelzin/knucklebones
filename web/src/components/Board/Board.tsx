import { FinishedState } from "@knucklebones/shared-models/src/RemoteState";
import { FC } from "react";
import styled from "styled-components";
import { BoardColumn } from "./Column";
import { GameState } from "@knucklebones/shared-models/src/RemoteState";
import { PlayerInfo } from "../../pages/Game/GamePage";

export type BoardOwner = "self" | "opponent"
export type Turn = "self" | "opponent"

export interface PlayerBoardState {
  grid: number[][];
  score: number;
  playerId: string;
}

export interface BoardProps {
  state: GameState
  userId: string
  boards: PlayerBoardState[]
  boardSize: number;
  turn: Turn;
  onPlay: (column: number) => void
}

export interface PlayerBoardProps {
  isOwnBoard?: boolean
  isActiveTurn?: boolean
  size: number
  grid: number[][]
  onPlay?: (column: number) => void
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

export const PlayerBoard: FC<PlayerBoardProps> = ({ size, grid, isOwnBoard = false, isActiveTurn = false, onPlay }) => {
  let columns = []

  const onColSelection = (index: number) => {
    if (isActiveTurn) onPlay?.(index);
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

const sarcasticWinningMessages: string[] = [
  "Congratulations, you've achieved the bare minimum.",
  "Great job, you won a game that even a toddler could play.",
  "Congratulations, you've won the game of doing the bare minimum.",
  "Good for you, you won a game that no one else cared about.",
  "Congratulations on your epic victory...not.",
  "You won fair and square, but let's not pretend it was impressive.",
  "Wow, I'm so impressed you won a game by dumb luck.",
  "Impressive, you won a meaningless game. What's next, the Olympics?",
  "Congrats, you've accomplished something that won't matter in five minutes."
];

const lossingMessages: string[] = [
  "Better luck next time, I'm sure you'll need it.",
  "Looks like you're not quite as skilled as you thought you were.",
  "Don't worry, losing isn't the end of the world...or is it?",
  "Well, that didn't go as planned. Maybe you should stick to something you're actually good at.",
  "Don't worry, losing builds character. Or in your case, a lot of character.",
  "Looks like you forgot to read the rulebook. Winning is supposed to be the objective, not losing.",
  "Better luck next time, or maybe you should just give up now and save yourself the embarrassment.",
  "Congrats on losing! You'll always be a winner in our hearts... too bad I don't have one.",
  "Great job losing! I'm sure you'll go far in life with those skills."
];

const tieingMessages: string[] = [
  "Looks like you're both equally bad at this game.",
  "Great job tying! I'm sure the trophy for 'Most Average' is on its way.",
  "Congratulations on achieving the ultimate goal of mediocrity.",
  "Congrats on your tie, you've officially accomplished nothing.",
  "Well, that was a waste of time. At least now we know that neither of you are winners.",
  "Ties are like participation trophies...they mean nothing, but at least you get something for showing up.",
  "Well, you both managed to not lose, which is kind of impressive in a sad way."
]

const StyledEndGameBanner = styled.div`
  max-width: 400px;
`

interface EndGameBannerProps {
  state: FinishedState
  userId: string
  playerInfo: PlayerInfo,
  opponentInfo: PlayerInfo
}

export const EndGameBanner: FC<EndGameBannerProps> = ({ state, userId, playerInfo, opponentInfo }) => {
  let title = ""
  let message = ""
  if (state.kind === "win") {
    if (state.winnerId === userId) {
      title = "You won!"
      message = sarcasticWinningMessages[Math.floor(Math.random() * sarcasticWinningMessages.length)];
    } else {
      title = "You lost!"
      message = lossingMessages[Math.floor(Math.random() * lossingMessages.length)];
    }
  } else {
    title = "It's a tie!"
    message = tieingMessages[Math.floor(Math.random() * tieingMessages.length)];
  }

  return (
    <StyledEndGameBanner>
      <h1 style={{ marginBottom: 0 }}>{title}</h1>
      <ScoreBoard firstPlayer={playerInfo} secondPlayer={opponentInfo} />
      <h2>{message}</h2>
    </StyledEndGameBanner>
  )
}

const StyledScoreBoard = styled.h4`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
  
  > * {
    margin: auto 0;
  }
`
const StyledScore = styled.span`
  font-size: 1.8em;
`

const StyledNickname = styled.div`
  display: inline;
  font-size: 1.2em;
`

export const ScoreBoard: FC<{ firstPlayer: PlayerInfo, secondPlayer: PlayerInfo }> = ({ firstPlayer, secondPlayer }) => {
  return (
    <div>
      <StyledScoreBoard>
        <StyledScore>{firstPlayer.score}</StyledScore>
        <StyledNickname>{firstPlayer.nickname}</StyledNickname>
        <span>|</span>
        <StyledNickname>{secondPlayer.nickname}</StyledNickname>
        <StyledScore>{secondPlayer.score}</StyledScore>
      </StyledScoreBoard>
    </div>
  )
}