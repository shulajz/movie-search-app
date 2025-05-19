import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import MovieCard from "../components/MovieCard";
import MovieDetail from "../components/MovieDetail";
import { getFavorites } from "../services/movieService";
import { Movie } from "../types";
import SearchIcon from "@mui/icons-material/Search";
import { Link as RouterLink } from "react-router-dom";

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // Load favorites from localStorage
  const loadFavorites = useCallback(() => {
    const favoritesData = getFavorites();
    setFavorites(favoritesData);
  }, []);

  useEffect(() => {
    loadFavorites();

    // Create a custom event for favorites updates
    const handleStorageChange = () => {
      loadFavorites();
    };

    // Add event listener for the custom event
    window.addEventListener("favoritesUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("favoritesUpdated", handleStorageChange);
    };
  }, [loadFavorites]);

  // For UI updates when removing favorites
  useEffect(() => {
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key, value) {
      const event = new Event("favoritesUpdated");
      originalSetItem.apply(this, [key, value]);
      window.dispatchEvent(event);
    };

    return () => {
      localStorage.setItem = originalSetItem;
    };
  }, []);

  const handleMovieClick = (movieId: string) => {
    setSelectedMovieId(movieId);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        My Favorites
      </Typography>

      {favorites.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Typography variant="h6" color="text.secondary" paragraph>
            You haven't added any favorites yet.
          </Typography>
          <Typography color="text.secondary" paragraph>
            Search for movies and TV shows and click the heart icon to add them
            to your favorites.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/"
            startIcon={<SearchIcon />}
          >
            Search Movies
          </Button>
        </Box>
      ) : (
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
          {favorites.map((movie) => (
            <Box key={movie.imdbID} sx={{ width: "100%" }}>
              <MovieCard
                movie={movie}
                onClick={() => handleMovieClick(movie.imdbID)}
              />
            </Box>
          ))}
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

export default FavoritesPage;
