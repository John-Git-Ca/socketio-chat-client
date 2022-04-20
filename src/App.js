import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import Join from './components/Join';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/chat/:name/:room" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;
