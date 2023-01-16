import { FC } from "react"
import styled from "styled-components"

interface TextInputProps {
  color: string
  actionLabel: string
}

const InputContainer = styled.div`
  border-radius: 6px;
  border: 1px rgba(0,0,0,0.05);
`

const ActionButton = styled.button`
  
`

const TextInputStyle = styled.input`
  
`

export const TextInput: FC<TextInputProps> = ({ color, actionLabel }) => {
  return (
    <InputContainer>

    </InputContainer>
  )
}