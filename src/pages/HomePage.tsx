import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Fade,
} from "@mui/material";
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import MovieDetail from "../components/MovieDetail";
import { searchMovies } from "../services/movieService";
import { Movie } from "../types";

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const fetchMovies = useCallback(async (term: string, pageNum: number) => {
    if (!term) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchMovies(term, pageNum);

      if (response.Response === "False") {
        setError(response.Error || "No results found");
        setMovies([]);
        setTotalResults(0);
      } else {
        if (pageNum === 1) {
          setMovies(response.Search);
        } else {
          setMovies((prevMovies) => [...prevMovies, ...response.Search]);
        }
        setTotalResults(parseInt(response.totalResults, 10));
      }
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial search on component mount with "Marvel" as example
  useEffect(() => {
    fetchMovies("Marvel", 1);
    setSearchTerm("Marvel");
  }, [fetchMovies]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
    fetchMovies(term, 1);
    window.scrollTo(0, 0);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(searchTerm, nextPage);
  };

  const handleMovieClick = (movieId: string) => {
    setSelectedMovieId(movieId);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SearchBar onSearch={handleSearch} initialValue={searchTerm} />

      {error ? (
        <Fade in={!!error}>
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        </Fade>
      ) : null}

      {!error && movies.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {totalResults} results for "{searchTerm}"
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 3,
        }}
      >
        {movies.map((movie) => (
          <Box key={movie.imdbID} sx={{ width: "100%" }}>
            <MovieCard
              movie={movie}
              onClick={() => handleMovieClick(movie.imdbID)}
            />
          </Box>
        ))}
      </Box>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && movies.length > 0 && movies.length < totalResults && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button variant="contained" color="primary" onClick={loadMore}>
            Load More
          </Button>
        </Box>
      )}

      {!isLoading && movies.length === 0 && !error && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography color="text.secondary">
            No movies found. Try a different search term.
          </Typography>
        </Box>
      )}

      {selectedMovieId && (
        <MovieDetail
          movieId={selectedMovieId}
          open={isDetailOpen}
          onClose={handleCloseDetail}
        />
      )}
    </Container>
  );
};

export default HomePage;
