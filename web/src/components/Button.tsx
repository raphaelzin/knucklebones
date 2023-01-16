import { FC } from "react"
import styled from "styled-components"

export interface ButtonProps {
  title: string
  onClick?: () => void
}

const StyledButton = styled.button`
  border-radius: 6px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  padding: 8px 12px;
  outline: none;
  border: none;
  background: transparent;
`

export const Button: FC<ButtonProps> = ({ title, onClick }) => {
  return (
    <StyledButton onClick={
      (event) => {
        event.preventDefault()
        if (onClick) onClick();
      }
    }>
      {title}
    </StyledButton>
  )
}