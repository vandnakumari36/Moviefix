import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleCardClick}>
      <div className="movie-image">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        <div className="movie-overlay">
          <h3>{movie.title}</h3>
          <div className="movie-details">
            <div>
              <p>Rating: {movie.vote_average.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
