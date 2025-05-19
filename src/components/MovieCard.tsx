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
} from "@mui/material";
import { Movie } from "../types";
import FavoriteButton from "./FavoriteButton";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const fallbackPosterUrl =
    "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <Card
      sx={{
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        },
        overflow: "hidden",
      }}
      onClick={onClick}
    >
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
          sx={{
            fontWeight: "medium",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
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
        <Box onClick={(e) => e.stopPropagation()}>
          <FavoriteButton movie={movie} />
        </Box>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
