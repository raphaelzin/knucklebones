import { FC } from "react"
import { redirect } from "react-router-dom"
import styled from "styled-components"
import { Button } from "../../components/Button"
import { HomeCard } from "../../components/HomeCard"
import { RuleDescription } from "../../components/Rules/RuleDescription"
import { TextInput } from "../../components/TextInput"
import { requestRoomCreation } from "./HomeController"

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
`

const DefaultRulesContainer = styled.div`
  display: flex;
  gap: 80px;
  align-items: flex-end;
  justify-content: center;
  align-self: center;
  padding: 40px;
`

const StyledRuleDescription = styled(RuleDescription)`
  width: 310px;
`

const HomeOptionsContainer = styled.div`
  display: flex;
  gap: 20px;

`

const StyledHomeCard = styled(HomeCard)`
  width: 200px;
  height: 210px;
`

export const HomePage: FC = () => {
  const handleRoomCreation = () => {
    requestRoomCreation().then((code) => {
      console.log(`received: ${code}`)
      redirect(`localhost:3000/game/${code}`)
    }, (error) => {
      console.log(error)
      console.log(JSON.stringify(error))
      alert(`error: ${JSON.stringify(error)}`)
    })
  }

  return (
    <HomeContainer>
      <h2>How to play</h2>
      <DefaultRulesContainer>
        <>
          <StyledRuleDescription title={"Match dice"} description={"When dice of the same number are placed in the same column, multiply their value."}>
          </StyledRuleDescription>

          <StyledRuleDescription title={"Destroy Opponent"} description={"Destroy your opponents dice by matching yours to their."} >
          </StyledRuleDescription>
        </>
      </DefaultRulesContainer>

      <HomeOptionsContainer>
        <StyledHomeCard description="Create a game others can join." emoji="🎲">
          <form>
            <Button title="Create game" onClick={handleRoomCreation} />
          </form>
        </StyledHomeCard>
        <StyledHomeCard description="Join an existing game." emoji="🤝">
          <Button title="Join an existing game" />
        </StyledHomeCard>
        <StyledHomeCard description="Spectate a game." emoji="👀">
          <TextInput color="#0D6EFD" actionLabel="Join" />
        </StyledHomeCard>
      </HomeOptionsContainer>

    </HomeContainer >
  )
}