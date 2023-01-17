import { FC } from "react"
import { useNavigate } from "react-router-dom"
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
  const navigate = useNavigate();

  const handleRoomCreation = () => {
    requestRoomCreation().then((code) => {
      navigate(`/games/${code}`)
    }, (error) => {
      alert(`error: ${JSON.stringify(error)}`)
    })
  }

  const joinRoom = (code: string) => {
    // TODO: join room
    console.log(code)
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
          <Button title="Create game" onClick={handleRoomCreation} />
        </StyledHomeCard>
        <StyledHomeCard description="Join an existing game." emoji="🤝">
          <TextInput color="#0D6EFD" actionLabel="Join" submit={joinRoom} />
        </StyledHomeCard>
        <StyledHomeCard description="Spectate a game." emoji="👀">
        </StyledHomeCard>
      </HomeOptionsContainer>
    </HomeContainer >
  )
}