import { FC, ReactNode, useContext, useState } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Switch, TextField } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import { ThemeContext } from "../App";
import { Theme } from "../style/theme";

export interface MainLayoutProps {
  children: ReactNode
}

const Header = styled.div<{ theme: Theme }>`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 5px 6px #00000022;
  background-color: ${(p) => p.theme.backgroundColor};
  color: ${(p) => p.theme.textColor};
  padding: 0 16px;
`

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${(p) => p.theme.backgroundColor};
  color: ${(p) => p.theme.textColor};
`;

const NicknameContainer = styled.div`
  padding-right: 12px;
`

const TrailingItems = styled.div`
  display: flex;
  gap: 12px;
`

const NicknameEditor: FC = () => {
  const [cookie, setNicknameCookie] = useCookies(["nickname"])
  const [editNicknameOpen, setEditNicknameOpen] = useState(false);
  const [nickname, setNickname] = useState<string>(cookie.nickname ?? "")

  const onSave = () => {
    setEditNicknameOpen(false)
    setNicknameCookie("nickname", nickname)
  }

  const onClose = () => {
    setEditNicknameOpen(false)
    setNickname(cookie.nickname)
  }

  return (
    <NicknameContainer>
      <>
        {cookie.nickname && (
          <Button variant="outlined" onClick={() => setEditNicknameOpen(true)}>  {cookie.nickname}  &nbsp; <EditOutlined /> </Button>
        )}
        {!cookie.nickname && (
          <Button variant="outlined" onClick={() => setEditNicknameOpen(true)}> Set Username</Button>
        )}
        <Dialog open={editNicknameOpen} onClose={onClose}>
          <DialogTitle>Edit Nickname</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter your nickname.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="New nickname"
              fullWidth
              variant="standard"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value)
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onSave} >Save</Button>
          </DialogActions>
        </Dialog>
      </>
    </NicknameContainer>
  )
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <LayoutContainer theme={theme}>
      <Header>
        <h1> Knucklebones </h1>
        <TrailingItems>
          <Switch checked={theme.name === "dark"} onChange={toggleTheme} />
          <NicknameEditor />
        </TrailingItems>
      </Header>
      {children}
    </LayoutContainer>
  )
}