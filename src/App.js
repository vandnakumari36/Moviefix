import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './component/Header';
import Body from './component/Body';
import MovieDetails from './component/MovieDetails';

const App = () => {
  const [activeGenre, setActiveGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Router>
      <div>
        <Header activeGenre={activeGenre} setActiveGenre={setActiveGenre} setSearchQuery={setSearchQuery} />
        <Routes>
          <Route path="/" element={<Body activeGenre={activeGenre} searchQuery={searchQuery} />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
