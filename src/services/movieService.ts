import axios from "axios";
import { Movie, MovieDetail, SearchResponse } from "../types";

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const API_URL = "https://www.omdbapi.com/";

export const searchMovies = async (
  searchTerm: string,
  page: number = 1
): Promise<SearchResponse> => {
  console.log("API_KEY--", API_KEY);

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
