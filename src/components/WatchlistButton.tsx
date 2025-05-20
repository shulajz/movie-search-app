import React, { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Movie } from "../types";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  toggleWatchedStatus,
  getWatchedStatus,
} from "../services/movieService";

interface WatchlistButtonProps {
  movie: Movie;
  size?: "small" | "medium" | "large";
  onToggle?: () => void;
  showStatus?: boolean;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  movie,
  size = "medium",
  onToggle,
  showStatus = true,
}) => {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      setInWatchlist(isInWatchlist(movie.imdbID));
      setWatched(getWatchedStatus(movie.imdbID));
    };

    checkStatus();

    window.addEventListener("watchlistUpdated", checkStatus);

    return () => {
      window.removeEventListener("watchlistUpdated", checkStatus);
    };
  }, [movie.imdbID]);

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (inWatchlist) {
      removeFromWatchlist(movie.imdbID);
      setInWatchlist(false);
    } else {
      addToWatchlist(movie);
      setInWatchlist(true);
      setWatched(false);
    }

    window.dispatchEvent(new Event("watchlistUpdated"));

    if (onToggle) {
      onToggle();
    }
  };

  const handleWatchedToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    toggleWatchedStatus(movie.imdbID);
    setWatched(!watched);

    window.dispatchEvent(new Event("watchlistUpdated"));

    if (onToggle) {
      onToggle();
    }
  };

  return (
    <>
      <Tooltip
        title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      >
        <IconButton
          onClick={handleWatchlistToggle}
          size={size}
          color={inWatchlist ? "primary" : "default"}
          aria-label={
            inWatchlist ? "Remove from watchlist" : "Add to watchlist"
          }
        >
          <WatchLaterIcon />
        </IconButton>
      </Tooltip>

      {showStatus && inWatchlist && (
        <Tooltip title={watched ? "Mark as unwatched" : "Mark as watched"}>
          <IconButton
            onClick={handleWatchedToggle}
            size={size}
            color={watched ? "success" : "default"}
            aria-label={watched ? "Mark as unwatched" : "Mark as watched"}
          >
            <CheckCircleIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default WatchlistButton;
