import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import { getMovieDetails } from "../services/movieService";
import { MovieDetail as MovieDetailType } from "../types";
import FavoriteButton from "./FavoriteButton";

interface MovieDetailProps {
  movieId: string;
  open: boolean;
  onClose: () => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({
  movieId,
  open,
  onClose,
}) => {
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (open && movieId) {
        setLoading(true);
        const details = await getMovieDetails(movieId);
        setMovie(details);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, open]);

  const fallbackPosterUrl =
    "https://via.placeholder.com/300x450?text=No+Poster";

  const renderDetailItem = (label: string, value: string) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      maxWidth="md"
      fullWidth
      aria-labelledby="movie-detail-title"
    >
      <DialogTitle
        id="movie-detail-title"
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {movie && (
          <Typography variant="h5" component="div">
            {movie.Title}{" "}
            <Typography component="span" variant="h6" color="text.secondary">
              ({movie.Year})
            </Typography>
          </Typography>
        )}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : movie ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: "33.333%" } }}>
              <Box sx={{ position: "relative" }}>
                <img
                  src={
                    movie.Poster !== "N/A" ? movie.Poster : fallbackPosterUrl
                  }
                  alt={`${movie.Title} poster`}
                  style={{
                    width: "100%",
                    borderRadius: "4px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                />
                <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                  <FavoriteButton movie={movie} size="large" />
                </Box>
              </Box>

              <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <StarIcon sx={{ color: "gold", mr: 1 }} />
                  <Typography variant="h6" component="div">
                    {movie.imdbRating}/10
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  IMDb Rating
                </Typography>
              </Paper>
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "66.666%" } }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {movie.Genre.split(", ").map((genre, index) => (
                    <Chip
                      key={index}
                      label={genre}
                      size="small"
                      color="primary"
                    />
                  ))}
                </Box>
                <Typography variant="body2" gutterBottom>
                  {movie.Runtime} • Released: {movie.Released}
                </Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Plot
              </Typography>
              <Typography variant="body1" paragraph>
                {movie.Plot}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                }}
              >
                <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                  {renderDetailItem("Director", movie.Director)}
                </Box>
                <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
                  {renderDetailItem("Actors", movie.Actors)}
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ py: 3, textAlign: "center" }}>
            <Typography color="error">
              Failed to load movie details. Please try again.
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetail;
