import { FC, ReactNode } from "react"
import styled from "styled-components"

export interface HomeCardProps {
  children: ReactNode
  className?: string
  description: string
  emoji: string
}

const StyledCard = styled.div`
  display: flex;
  gap: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
`

const StyledChildren = styled.div`
  margin-top: 10px;
`

const StyledEmoji = styled.div`
  font-size: 64px;
`

export const HomeCard: FC<HomeCardProps> = ({ description, emoji, children, className }) => {
  return (
    <StyledCard className={className}>
      <StyledEmoji>
        {emoji}
      </StyledEmoji>
      {description}
      <StyledChildren>
        {children}
      </StyledChildren>
    </StyledCard>
  )
}