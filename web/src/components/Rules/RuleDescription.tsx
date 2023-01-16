import { FC, ReactNode } from "react"
import styled from "styled-components"

export interface RuleDescriptionProps {
  children: ReactNode
  className?: string
  title: string
  description: string
}

const RuleDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export const RuleDescription: FC<RuleDescriptionProps> = ({ children, title, description, className }) => {
  return (
    <RuleDescriptionContainer className={className}>
      {children}
      <h2>{title}</h2>
      <span>{description}</span>
    </RuleDescriptionContainer>
  )
}