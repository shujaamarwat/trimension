import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Room from './components/Room';

function App() {
  return (
    <div className="pt-[4vh]">
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room" element={<Room/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
