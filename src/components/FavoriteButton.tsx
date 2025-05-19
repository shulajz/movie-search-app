import React, { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  addToFavorites,
  removeFromFavorites,
  isMovieFavorite,
} from "../services/movieService";
import { Movie } from "../types";

interface FavoriteButtonProps {
  movie: Movie;
  onToggle?: () => void;
  size?: "small" | "medium" | "large";
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  movie,
  onToggle,
  size = "medium",
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(isMovieFavorite(movie.imdbID));
  }, [movie.imdbID]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent component clicks

    if (isFavorite) {
      removeFromFavorites(movie.imdbID);
    } else {
      addToFavorites(movie);
    }

    setIsFavorite(!isFavorite);

    if (onToggle) {
      onToggle();
    }
  };

  return (
    <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
      <IconButton
        onClick={toggleFavorite}
        size={size}
        color={isFavorite ? "secondary" : "default"}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton;
