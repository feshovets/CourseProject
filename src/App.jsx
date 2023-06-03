import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Play from './components/Play';
import About from './components/About';
import Home from './components/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <main>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App
