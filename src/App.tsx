import React from 'react';
import { Header } from './components/Header';
import { Mission } from './components/Mission';
import { Team } from './components/Team';
import { Contact } from './components/Contact';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Mission />
      <Team />
      <Contact />
    </div>
  );
}

export default App;