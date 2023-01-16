import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import { MainLayout } from './layouts/MainLayout';
import { GamePage } from './pages/Game/GamePage';
import { HomePage } from './pages/home/Home';

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;