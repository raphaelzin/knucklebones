import { FC, ReactNode } from "react"
import styled from "styled-components"

interface TopBarProps {
  leading: ReactNode
  trailing: ReactNode
  title: string
}

const StyledTopBar = styled.div`
  height: 60px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 5px 6px #00000022;
`

const StyledTitle = styled.div`
  align-self: center;
`

export const TopBar: FC<TopBarProps> = ({ leading, trailing, title }) => {

  return (
    <StyledTopBar>
      <StyledTitle>{title}</StyledTitle>
    </StyledTopBar>
  )
}