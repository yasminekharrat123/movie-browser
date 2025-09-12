import { useCallback, useEffect, useRef, useState } from 'react';
import { tmdbService } from '@/api/tmdb';
import type { Movie, MovieDetail } from '@/types/movie';

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const movieDetailsCache = useRef<Map<number, MovieDetail>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const MAX_CACHE_SIZE = 100;

  function setCacheItem<T>(cache: Map<number, T>, key: number, value: T) {
    if (cache.has(key)) {
      // Update position to mark as recently used
      cache.delete(key);
    } else if (cache.size >= MAX_CACHE_SIZE) {
      // Evict least recently used
      const firstKey = cache.keys().next().value;
      firstKey && cache.delete(firstKey);
    }
    cache.set(key, value);
  }
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

      setLoadingList(true);

      setError(null);

      try {
        let res;
        if (debouncedQuery.trim().length > 0) {
          res = await tmdbService.searchMovies(debouncedQuery);
        } else {
          res = await tmdbService.getPopularMovies();
        }
        if (!controller.signal.aborted) {
          setMovies(res.results || []);
          selectMovie(res.results[0]?.id);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('TMDB API error:', err);
          if (err instanceof Error && err.name === 'AbortError') {
            return;
          }
          setError('Failed to fetch movies. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingList(false);
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
      setCacheItem(movieDetailsCache.current, id, cachedMovie);

      setSelectedMovie(cachedMovie);
      setError(null);
      return;
    }

    setError(null);
    setLoadingDetail(true);

    try {
      const detail = await tmdbService.getMovieDetails(id);

      setCacheItem(movieDetailsCache.current, id, detail);

      setSelectedMovie(detail);
    } catch (err) {
      console.error('Failed to fetch movie details:', err);
      setError('Failed to fetch movie details. Please try again.');
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  return {
    movies,
    selectedMovie,
    query,
    setQuery,
    loadingList,
    loadingDetail,
    error,
    selectMovie,
  };
}
