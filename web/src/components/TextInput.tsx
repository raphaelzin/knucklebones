import { FC, useState } from "react"
import styled from "styled-components"

interface TextInputProps {
  color: string
  actionLabel: string
  submit: (input: string) => void
}

const InputContainer = styled.div`
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 6px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
`

const ActionButton = styled.button<{ color: string }>`
  background-color: ${(p) => p.color};
  border-radius: 0px 6px 6px 0px;
  border: none;
  color: white;
  padding: 0px 8px;
`

const TextInputStyle = styled.input`
  appearance: none;
  border: 0;
  margin: 8px 10px;
`

export const TextInput: FC<TextInputProps> = ({ color, actionLabel, submit }) => {
  const [input, setInput] = useState("");


  return (
    <InputContainer>
      <TextInputStyle placeholder="test" onChange={(event) => {
        event.preventDefault();
        setInput(event.target.value)
      }} />
      <ActionButton color={color} title={actionLabel} onClick={(event) => {
        event.preventDefault()
        submit(input)
      }}>
        {actionLabel}
      </ActionButton>
    </InputContainer>
  )
}