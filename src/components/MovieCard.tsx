// src/components/MovieCard.tsx

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Box,
  Chip,
  Stack,
} from "@mui/material";
import { Movie } from "../types";
import FavoriteButton from "./FavoriteButton";
import WatchlistButton from "./WatchlistButton";
import { getWatchedStatus, isInWatchlist } from "../services/movieService";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const fallbackPosterUrl =
    "https://via.placeholder.com/300x450?text=No+Poster";
  const isWatched = getWatchedStatus(movie.imdbID);
  const inWatchlist = isInWatchlist(movie.imdbID);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        },
        position: "relative",
      }}
      onClick={onClick}
    >
      {inWatchlist && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1,
            backgroundColor: isWatched ? "success.main" : "primary.main",
            color: "white",
            borderRadius: "4px",
            py: 0.5,
            px: 1,
            fontSize: "0.75rem",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {isWatched ? "Watched" : "To Watch"}
        </Box>
      )}

      <CardMedia
        component="img"
        height="280"
        image={movie.Poster !== "N/A" ? movie.Poster : fallbackPosterUrl}
        alt={`${movie.Title} poster`}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="subtitle1"
          component="div"
          noWrap
          title={movie.Title}
          sx={{ fontWeight: "medium" }}
        >
          {movie.Title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {movie.Year}
          </Typography>
          <Chip
            label={movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1)}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 1 }}>
        <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
          <FavoriteButton movie={movie} />
          <WatchlistButton movie={movie} showStatus={true} />
        </Stack>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
