import { FC, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { HomeCard } from "../../components/HomeCard"
import { RuleDescription } from "../../components/Rules/RuleDescription"
import { requestRoomCreation, requestRoomPlayerSeat } from "./HomeController"
import { useCookies } from "react-cookie";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material"
import { Theme } from "../../style/theme"
import { ThemeContext } from "../../App"

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
  gap: 24px;
  background-color: ${(p) => p.theme.backgroundColor};
  color: ${(p) => p.theme.textColor};
`

const DefaultRulesContainer = styled.div<{ theme: Theme }>`
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
  const [, setIdCookie] = useCookies(["id"])
  const [tokenCookie, setTokenCookie] = useCookies(["token"])
  const [nicknameCookie,] = useCookies(["nickname"])
  const { theme } = useContext(ThemeContext)

  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("")


  const handleRoomCreation = () => {
    requestRoomCreation(nicknameCookie.nickname ?? "").then((response) => {
      setIdCookie("id", response.ticket.id)
      setTokenCookie("token", response.ticket.token)

      navigate(`/games/${response.code}`)
    }, (error) => {
      alert(`error: ${JSON.stringify(error)}`)
    })
  }

  const joinRoom = (code: string) => {
    requestRoomPlayerSeat(code, tokenCookie.token, nicknameCookie.nickname ?? "").then((response) => {
      setIdCookie("id", response.ticket.id)
      setTokenCookie("token", response.ticket.token)

      navigate(`/games/${response.code}`)
    }, (error) => {
      alert(`error: ${JSON.stringify(error)}`)
    })
  }

  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [spectateDialogOpen, setSpectateDialogOpen] = useState(false);

  return (
    <HomeContainer theme={theme}>
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
          <Button variant="contained" onClick={handleRoomCreation}>Create game</Button>
        </StyledHomeCard>
        <StyledHomeCard description="Join an existing game." emoji="🤝">
          <Button variant="contained" color="success" onClick={() => setJoinDialogOpen(true)}>Join Game</Button>
          <Dialog open={joinDialogOpen} onClose={() => setJoinDialogOpen(false)}>
            <DialogTitle>Join Game</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the ID of the room. You're gonna take a player seat if one is available.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Room ID"
                fullWidth
                variant="standard"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value)
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => joinRoom(roomCode)} >Join</Button>
            </DialogActions>
          </Dialog>
        </StyledHomeCard>
        <StyledHomeCard description="Spectate a game." emoji="👀">
          <Button onClick={() => setSpectateDialogOpen(true)} variant="contained" color="warning">Spectate a game</Button>
          <Dialog open={spectateDialogOpen} onClose={() => setSpectateDialogOpen(false)}>
            <DialogTitle>Spectate Game</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the ID of the room. You'll be placed in the room as a spectator.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Room ID"
                fullWidth
                variant="standard"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value)
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSpectateDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => console.log("To do")} >Join</Button>
            </DialogActions>
          </Dialog>
        </StyledHomeCard>
      </HomeOptionsContainer>
    </HomeContainer >
  )
}