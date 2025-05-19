import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import MovieCard from "../components/MovieCard";
import MovieDetail from "../components/MovieDetail";
import { getWatchlist, WatchlistItem } from "../services/movieService";
import SearchIcon from "@mui/icons-material/Search";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link as RouterLink } from "react-router-dom";

const WatchlistPage: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);
  const [filteredWatchlist, setFilteredWatchlist] = useState<WatchlistItem[]>(
    []
  );

  const loadWatchlist = useCallback(() => {
    const watchlistData = getWatchlist();
    setWatchlist(watchlistData);
  }, []);

  useEffect(() => {
    if (tabValue === 0) {
      setFilteredWatchlist(watchlist);
    } else if (tabValue === 1) {
      setFilteredWatchlist(watchlist.filter((item) => !item.watched));
    } else {
      setFilteredWatchlist(watchlist.filter((item) => item.watched));
    }
  }, [watchlist, tabValue]);

  useEffect(() => {
    loadWatchlist();

    const handleWatchlistUpdate = () => {
      loadWatchlist();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "movie-watchlist") {
        loadWatchlist();
      }
    };

    window.addEventListener("watchlistUpdated", handleWatchlistUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("watchlistUpdated", handleWatchlistUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadWatchlist]);

  const handleMovieClick = (movieId: string) => {
    setSelectedMovieId(movieId);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 3 }}
      >
        My Watchlist
      </Typography>

      {watchlist.length === 0 ? (
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
            Your watchlist is empty
          </Typography>
          <Typography color="text.secondary" paragraph>
            Search for movies and TV shows and click the clock icon to add them
            to your watchlist.
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
        <>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="watchlist tabs"
              centered
            >
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>All</span>
                    <Chip
                      label={watchlist.length}
                      size="small"
                      color="primary"
                      sx={{ height: 20 }}
                    />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WatchLaterIcon fontSize="small" />
                    <span>To Watch</span>
                    <Chip
                      label={watchlist.filter((item) => !item.watched).length}
                      size="small"
                      color="primary"
                      sx={{ height: 20 }}
                    />
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon fontSize="small" />
                    <span>Watched</span>
                    <Chip
                      label={watchlist.filter((item) => item.watched).length}
                      size="small"
                      color="success"
                      sx={{ height: 20 }}
                    />
                  </Box>
                }
              />
            </Tabs>
          </Box>

          {filteredWatchlist.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 5 }}>
              <Typography color="text.secondary">
                No movies in this category
              </Typography>
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
              {filteredWatchlist.map((movie) => (
                <Box key={movie.imdbID} sx={{ width: "100%" }}>
                  <MovieCard
                    movie={movie}
                    onClick={() => handleMovieClick(movie.imdbID)}
                  />
                </Box>
              ))}
            </Box>
          )}
        </>
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

export default WatchlistPage;
