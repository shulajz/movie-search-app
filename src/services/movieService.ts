import axios from "axios";
import { Movie, MovieDetail, SearchResponse } from "../types";

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const API_URL = "https://www.omdbapi.com/";

export const searchMovies = async (
  searchTerm: string,
  page: number = 1
): Promise<SearchResponse> => {
  try {
    const response = await axios.get<SearchResponse>(API_URL, {
      params: {
        apikey: API_KEY,
        s: searchTerm,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    return {
      Search: [],
      totalResults: "0",
      Response: "False",
      Error: "Failed to fetch movies",
    };
  }
};

export const getMovieDetails = async (
  movieId: string
): Promise<MovieDetail | null> => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        apikey: API_KEY,
        i: movieId,
        plot: "full",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

// Favorites functionality using localStorage
const FAVORITES_KEY = "movie-favorites";

export const getFavorites = (): Movie[] => {
  const favoritesString = localStorage.getItem(FAVORITES_KEY);
  return favoritesString ? JSON.parse(favoritesString) : [];
};

export const addToFavorites = (movie: Movie): void => {
  const favorites = getFavorites();

  // Check if the movie is already in favorites
  if (!favorites.some((favorite) => favorite.imdbID === movie.imdbID)) {
    favorites.push(movie);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFromFavorites = (movieId: string): void => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(
    (movie) => movie.imdbID !== movieId
  );
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
};

export const isMovieFavorite = (movieId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some((movie) => movie.imdbID === movieId);
};

// Watchlist functionality using localStorage
const WATCHLIST_KEY = "movie-watchlist";

export interface WatchlistItem extends Movie {
  addedAt: string;
  watched: boolean;
}

export const getWatchlist = (): WatchlistItem[] => {
  try {
    const watchlistString = localStorage.getItem(WATCHLIST_KEY);
    return watchlistString ? JSON.parse(watchlistString) : [];
  } catch (error) {
    console.error("Error getting watchlist:", error);
    return [];
  }
};

export const addToWatchlist = (
  movie: Movie,
  watched: boolean = false
): void => {
  try {
    const watchlist = getWatchlist();

    // Check if the movie is already in watchlist
    if (!watchlist.some((item) => item.imdbID === movie.imdbID)) {
      const watchlistItem: WatchlistItem = {
        ...movie,
        addedAt: new Date().toISOString(),
        watched,
      };
      watchlist.push(watchlistItem);
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));

      window.dispatchEvent(new Event("watchlistUpdated"));
    }
  } catch (error) {
    console.error("Error adding to watchlist:", error);
  }
};

export const removeFromWatchlist = (movieId: string): void => {
  try {
    const watchlist = getWatchlist();
    const updatedWatchlist = watchlist.filter(
      (movie) => movie.imdbID !== movieId
    );
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));

    window.dispatchEvent(new Event("watchlistUpdated"));
  } catch (error) {
    console.error("Error removing from watchlist:", error);
  }
};

export const isInWatchlist = (movieId: string): boolean => {
  try {
    const watchlist = getWatchlist();
    return watchlist.some((movie) => movie.imdbID === movieId);
  } catch (error) {
    console.error("Error checking watchlist:", error);
    return false;
  }
};

export const toggleWatchedStatus = (movieId: string): void => {
  try {
    const watchlist = getWatchlist();
    const updatedWatchlist = watchlist.map((movie) => {
      if (movie.imdbID === movieId) {
        return { ...movie, watched: !movie.watched };
      }
      return movie;
    });

    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));

    window.dispatchEvent(new Event("watchlistUpdated"));
  } catch (error) {
    console.error("Error toggling watched status:", error);
  }
};

export const getWatchedStatus = (movieId: string): boolean => {
  try {
    const watchlist = getWatchlist();
    const movie = watchlist.find((movie) => movie.imdbID === movieId);
    return movie ? movie.watched : false;
  } catch (error) {
    console.error("Error getting watched status:", error);
    return false;
  }
};
