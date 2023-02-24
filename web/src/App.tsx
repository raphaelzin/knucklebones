import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/system';
import { createContext, useState } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import { MainLayout } from './layouts/MainLayout';
import { GamePage } from './pages/Game/GamePage';
import { HomePage } from './pages/home/Home';
import getTheme, { Theme } from './style/theme'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: getTheme(false),
  toggleTheme: () => { },
});

const StyledApp = styled.div`
  text-align: center;
  height: 100%;
  background-color: ${(p) => p.theme.backgroundColor};
`

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const theme: Theme = getTheme(isDarkMode);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }} >
      <ThemeProvider theme={darkTheme}>
        <StyledApp>
          <Routes>
            <Route
              element={<MainLayout>
                <Outlet />
              </MainLayout>}
              path="/"
            >
              <Route path="/" element={<HomePage />} />
              <Route
                element={<GamePage />}
                path="/games/:roomCode"
              />
            </Route>
          </Routes>
        </StyledApp>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;