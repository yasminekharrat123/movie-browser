import { useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { tmdbService } from '@/api/tmdb';
import type { Movie, MovieDetail, MovieResponse } from '@/types/movie';

export function useMovies() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // detail state + cache map
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const movieDetailsCache = useRef<Map<number, MovieDetail>>(new Map());
  const MAX_CACHE_SIZE = 100;

  function setCacheItem<T>(cache: Map<number, T>, key: number, value: T) {
    if (cache.has(key)) {
      cache.delete(key);
    } else if (cache.size >= MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
      }
    }
    cache.set(key, value);
  }

  const queryClient = useQueryClient();

  // useInfiniteQuery for both popular (debouncedQuery === '') and search
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isListLoading,
    isError: isListError,
    error: listErrorObj,
    refetch: refetchList,
  } = useInfiniteQuery<
    MovieResponse,
    Error,
    InfiniteData<MovieResponse>,
    [string, string?],
    number
  >({
    queryKey: ['movies', debouncedQuery],
    queryFn: async ({ pageParam = 1 }) => {
      if (debouncedQuery.trim().length > 0) {
        return tmdbService.searchMovies(debouncedQuery, pageParam);
      }
      return tmdbService.getPopularMovies(pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) return lastPage.page + 1;
      return undefined;
    },
    staleTime: 1000 * 60 * 2,
  });

  // When the debouncedQuery changes, we're clearing the `['movies']` cache so previous queries/pages are removed.
  // This ensures fresh pagination start.
  useEffect(() => {
    queryClient.removeQueries({ queryKey: ['movies'], exact: true });
    setSelectedMovie(null);
    refetchList();
  }, [debouncedQuery]);

  const movies: Movie[] = data?.pages.flatMap((p) => p.results) ?? [];

  // Auto-select first movie when new list arrives and nothing is selected
  useEffect(() => {
    if (movies.length > 0 && !selectedMovie) {
      selectMovie(movies[0].id);
    }
  }, [movies]);

  const selectMovie = useCallback(async (id: number) => {
    const cached = movieDetailsCache.current.get(id);
    if (cached) {
      setCacheItem(movieDetailsCache.current, id, cached); // refresh LRU order
      setSelectedMovie(cached);
      setErrorDetail(null);
      return;
    }

    setErrorDetail(null);
    setLoadingDetail(true);

    try {
      const detail = await tmdbService.getMovieDetails(id);
      setCacheItem(movieDetailsCache.current, id, detail);
      setSelectedMovie(detail);
    } catch (err) {
      console.error('Failed to fetch movie details:', err);
      setErrorDetail('Failed to fetch movie details. Please try again.');
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const listError = isListError
    ? ((listErrorObj as Error)?.message ?? 'Failed to fetch movies')
    : null;

  return {
    movies,
    query,
    setQuery,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loadingList: isListLoading,
    listError,
    refetchList,

    selectedMovie,
    selectMovie,
    loadingDetail,
    errorDetail,
  };
}
