import { FC, ReactNode, useState } from "react";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, TextField } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";

export interface MainLayoutProps {
  children: ReactNode
}

const Header = styled.div`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 5px 6px #00000022;
`

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const NicknameContainer = styled.div`
  padding-right: 12px;
`

const NicknameEditor: FC = () => {
  const [cookie, setNicknameCookie] = useCookies(["nickname"])
  const [editNicknameOpen, setEditNicknameOpen] = useState(false);
  const [nickname, setNickname] = useState<string>(cookie.nickname ?? "")

  const onSave = () => {
    setEditNicknameOpen(false)
    setNicknameCookie("nickname", nickname)
    setNickname("")
  }

  const onClose = () => {
    setEditNicknameOpen(false)
    setNickname("")
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
  return (
    <LayoutContainer>
      <Header>
        <h1> Knucklebones </h1>
        <NicknameEditor />
      </Header>
      {children}
    </LayoutContainer>
  )
}