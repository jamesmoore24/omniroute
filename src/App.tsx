import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EdTechDemo from './pages/EdTechDemo';
import MarketResearchDemo from './pages/MarketResearchDemo';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/edtech" element={<EdTechDemo />} />
        <Route path="/market-research" element={<MarketResearchDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;