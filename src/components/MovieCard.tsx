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
  Paper,
} from "@mui/material";
import { Movie } from "../types";
import FavoriteButton from "./FavoriteButton";
import WatchlistButton from "./WatchlistButton";
import { getWatchedStatus, isInWatchlist } from "../services/movieService";
import MovieIcon from "@mui/icons-material/Movie";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const isWatched = getWatchedStatus(movie.imdbID);
  const inWatchlist = isInWatchlist(movie.imdbID);

  const renderPoster = () => {
    if (movie.Poster && movie.Poster !== "N/A") {
      return (
        <CardMedia
          component="img"
          height="280"
          image={movie.Poster}
          alt={`${movie.Title} poster`}
          sx={{ objectFit: "cover" }}
        />
      );
    } else {
      // Fallback poster design
      return (
        <Box
          sx={{
            height: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(30, 30, 30, 0.8)",
            color: "grey.400",
            p: 2,
            textAlign: "center",
          }}
        >
          <LocalMoviesIcon sx={{ fontSize: 80, mb: 2, opacity: 0.7 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
            {movie.Title}
          </Typography>
          <Typography variant="body2">No Poster Available</Typography>
        </Box>
      );
    }
  };

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

      {renderPoster()}

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
