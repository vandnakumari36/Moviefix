import React, { useState, useEffect } from 'react';
import './Body.css';
import MovieCard from './MovieCard';
import Shimmer from './Shimmer';

const Body = ({ activeGenre, searchQuery }) => {
  const [moviesByYear, setMoviesByYear] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMoviesByYear = async () => {
    setLoading(true);
    setError(null);

    try {
      const startYear = 2012;
      const endYear = 2024;
      const requests = [];

      for (let year = startYear; year <= endYear; year++) {
        requests.push(fetchMovies(year));
      }

      await Promise.all(requests);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setError("Failed to fetch movies. Please try again later.");
      setLoading(false);
    }
  };

  const fetchMovies = async (year) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=popularity.desc&primary_release_year=${year}&page=1&vote_count.gte=100`
      );
      const movieData = await res.json();
      const moviesWithDetails = await Promise.all(
        movieData.results.slice(0, 20).map(async (movie) => {
          const movieDetails = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=2dca580c2a14b55200e784d157207b4d&append_to_response=credits`
          );
          const details = await movieDetails.json();
          return {
            ...movie,
            genres: details.genres.map((g) => g.name),
            cast: details.credits.cast.slice(0, 5).map((c) => c.name),
            director: details.credits.crew.find((c) => c.job === 'Director')?.name,
          };
        })
      );

      setMoviesByYear((prev) => ({
        ...prev,
        [year]: moviesWithDetails,
      }));
    } catch (error) {
      console.error(`Failed to fetch movies for year ${year}:`, error);
    }
  };

  useEffect(() => {
    fetchMoviesByYear();
  }, []);

  const filteredMovies = Object.keys(moviesByYear).reduce((acc, year) => {
    const yearMovies = moviesByYear[year].filter(movie => {
      return (
        (activeGenre === 'All' || movie.genre_ids.includes(activeGenre)) &&
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    if (yearMovies.length > 0) acc[year] = yearMovies;
    return acc;
  }, {});

  if (loading) {
    return <Shimmer />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (Object.keys(filteredMovies).length === 0) {
    return (
      <div className="movie-body">
        <div className="no-results">
          <p>No movies found 😞</p>
        </div>
      </div>
    );  
  }

  return (
    <div className="movie-body">
      {Object.keys(filteredMovies).map((year) => (
        <div key={year} className="movie-year-section">
          <h2>{year}</h2>
          <div className="movie-cards">
            {filteredMovies[year].map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Body;
