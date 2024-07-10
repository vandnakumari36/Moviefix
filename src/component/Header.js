import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ activeGenre, setActiveGenre, setSearchQuery }) => {
  const [genres, setGenres] = useState([]);
  const [activeButton, setActiveButton] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=2dca580c2a14b55200e784d157207b4d&language=en-US'
      );
      const genreData = await res.json();
      setGenres(genreData.genres);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSearchResults([]);
        setNoResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    // Hide search and buttons when on movie detail page
    const hideHeaderItems = location.pathname.startsWith('/movie/');
    if (hideHeaderItems) {
      setSearchTerm('');
      setSearchResults([]);
      setNoResults(false);
    }
  }, [location]);

  const handleButtonClick = (genreId, genreName) => {
    setActiveButton(genreName);
    setActiveGenre(genreId);
    setSearchQuery('');
    setSearchTerm('');
    setSearchResults([]);
    setNoResults(false);
  };

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.length > 2) {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=2dca580c2a14b55200e784d157207b4d&query=${query}`
      );
      const data = await res.json();
      setSearchResults(data.results.slice(0, 10));
      setNoResults(data.results.length === 0);
    } else {
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleSearchClick = () => {
    setSearchQuery(searchTerm);
    setSearchResults([]);
    setNoResults(false);
  };

  const handleResultClick = (title) => {
    setSearchTerm(title);
    setSearchResults([]);
    setNoResults(false);
    setSearchQuery(title);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSearchQuery(searchTerm);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  return (
    <nav className="navbar sticky-top">
      <div className="container-fluid d-flex flex-column flex-md-row align-items-center">
        <Link className="navbar-brand me-auto" to="/">MOVIEFIX</Link>
        {!location.pathname.startsWith('/movie/') && (
          <div className="search-container" ref={dropdownRef}>
            <input
              type="text"
              className="form-control search-input mx-2 my-1"
              placeholder="Search for a movie..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <button className="btn search-button mx-2 my-1" onClick={handleSearchClick}>Search</button>
            {searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map((movie) => (
                  <div key={movie.id} className="search-result-item" onClick={() => handleResultClick(movie.title)}>
                    {movie.title}
                  </div>
                ))}
              </div>
            )}
            {noResults && (
              <div className="search-dropdown no-results">
                No movies found
              </div>
            )}
          </div>
        )}
        {!location.pathname.startsWith('/movie/') && (
          <div className="d-flex flex-nowrap overflow-auto">
            <a
              className={`btn ${activeButton === 'All' ? 'btn-danger' : 'btn-dark'} text-white mx-2 my-1`}
              href="#"
              onClick={() => handleButtonClick('All', 'All')}
            >
              All
            </a>
            {genres.map((genre) => (
              <a
                key={genre.id}
                className={`btn ${activeButton === genre.name ? 'btn-danger' : 'btn-dark'} text-white mx-2 my-1`}
                href="#"
                onClick={() => handleButtonClick(genre.id, genre.name)}
              >
                {genre.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
