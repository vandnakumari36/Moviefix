import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetails.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=2dca580c2a14b55200e784d157207b4d&append_to_response=credits`
        );
        const movieData = await res.json();
        setMovie(movieData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
        setError("Failed to fetch movie details. Please try again later.");
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!movie) {
    return <div className="error-message">Movie not found</div>;
  }

  return (
    <div className="movie-details-container">
      <button onClick={() => navigate(-1)} className="back-button">Back</button>
      <div className="movie-detail-card">
        <h1>{movie.title}</h1>
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
        <div className="movie-info">
          <p><strong>Genre:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
          <p><strong>Cast:</strong> {movie.credits.cast.slice(0, 5).map(cast => cast.name).join(', ')}</p>
          <p><strong>Director:</strong> {movie.credits.crew.find(member => member.job === 'Director')?.name}</p>
          <p><strong>Description:</strong> {movie.overview}</p>
          <p><strong>Rating:</strong> {movie.vote_average.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
