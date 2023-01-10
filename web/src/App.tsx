import { Route, Routes } from 'react-router-dom';
import './App.css';
import { GamePage } from './pages/Game/GamePage';
import { HomePage } from './pages/home/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          element={<GamePage />}
          path="/games/:roomCode"
        />
      </Routes>
    </div>
  );
}

export default App;