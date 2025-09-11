import { useCallback, useEffect, useRef, useState } from "react";
import { tmdbService } from "@/api/tmdb";
import type { Movie, MovieDetail } from "@/types/movie";

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  const movieDetailsCache = useRef<Map<number, MovieDetail>>(new Map());
  
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        let res;
        if (debouncedQuery.trim().length > 0) {
          res = await tmdbService.searchMovies(debouncedQuery);
          console.log("Search results:", res);
        } else {
          res = await tmdbService.getPopularMovies();
          console.log("Popular movies:", res);
        }
        if (!controller.signal.aborted) {
          setMovies(res.results || []);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("TMDB API error:", err);
          if (err instanceof Error && err.name === 'AbortError') {
            return;
          }
          setError("Failed to fetch movies. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery]);

  const selectMovie = useCallback(async (id: number) => {
    const cachedMovie = movieDetailsCache.current.get(id);
    if (cachedMovie) {
      console.log("Using cached movie details:", cachedMovie);
      setSelectedMovie(cachedMovie);
      setError(null);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const detail = await tmdbService.getMovieDetails(id);
      console.log("Fetched movie details:", detail);
      
      movieDetailsCache.current.set(id, detail);
      setSelectedMovie(detail);
    } catch (err) {
      console.error("Failed to fetch movie details:", err);
      setError("Failed to fetch movie details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);


  
  // Memoized function to clear errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoized function to clear cache (useful for debugging or memory management)
  const clearCache = useCallback(() => {
    movieDetailsCache.current.clear();
    console.log("Movie details cache cleared");
  }, []);

  return {
    movies,
    selectedMovie,
    query,
    setQuery,
    loading,
    error,
    selectMovie,
    clearError,
    clearCache,
  };
}