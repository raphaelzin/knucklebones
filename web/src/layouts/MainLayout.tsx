import { FC, ReactNode } from "react";
import styled from "styled-components";

export interface MainLayoutProps {
  children: ReactNode
}

const Header = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 6px #00000022;
`

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header>
        <h1> Knucklebones </h1>
      </Header>
      {children}
    </LayoutContainer>
  )
}