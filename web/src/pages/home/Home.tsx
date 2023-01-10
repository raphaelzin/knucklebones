import { FC } from "react"
import styled from "styled-components"


const HomeContainer = styled.div`

`

const HomeOptionsContainer = styled.div`
  display: flex;
`

export const HomePage: FC = () => {

  return (
    <HomeContainer>
      <h1> Knucklebones </h1>
      <HomeOptionsContainer>

      </HomeOptionsContainer>
    </HomeContainer>
  )
}

