import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Alert,
} from '@mui/material';
import type { Movie } from '@/types/movie';
import { useEffect, useRef } from 'react';
import { ScrollBar } from '@/components/ui/ScrollBar';

interface Props {
  movies: Movie[];
  onSelect: (id: number) => void;
  loading: boolean; // for initial loading
  error: string | null;
  fetchNextPage: () => void;
  hasNextPage?: boolean | null;
  isFetchingNextPage?: boolean | null;
}

export function MovieList({
  movies,
  onSelect,
  loading,
  error,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const rootEl = scrollContainerRef.current;
    if (!sentinel || !rootEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        });
      },
      {
        root: rootEl, // using the ScrollBar as the root
        rootMargin: '200px', // the observer will trigger when the sentinel is within 200px of the ScrollBar's bottom ( allows for prefetching)
        threshold: 0.1, // 10% is the proportion of the sentinel that must be visible before triggering the callback
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <ScrollBar ref={scrollContainerRef} px={2} pb={2}>
      {loading && (
        <List disablePadding>
          {Array.from({ length: 5 }).map((_, i) => (
            <ListItem key={i} disablePadding>
              <ListItemButton disabled>
                <Skeleton
                  variant="rectangular"
                  width={50}
                  height={75}
                  sx={{ borderRadius: 1, mr: 2, opacity: 0.8 }}
                />
                <Box flex={1}>
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : 'Something went wrong'}
        </Alert>
      )}

      {!loading && !error && movies.length === 0 && (
        <Typography variant="body2" color="text.secondary" align="center" py={4}>
          No movies found.
        </Typography>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <List disablePadding>
            {movies.map((movie) => (
              <ListItem key={movie.id} disablePadding>
                <ListItemButton onClick={() => onSelect(movie.id)}>
                  <Box
                    component="img"
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : '/No-Image-Placeholder.png'
                    }
                    alt={movie.title}
                    sx={{
                      width: 50,
                      height: 75,
                      borderRadius: 1,
                      mr: 2,
                    }}
                  />
                  <ListItemText
                    primary={
                      <Typography variant="body1" noWrap>
                        {movie.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {movie.release_date}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <div ref={sentinelRef} style={{ height: 1 }} />

          {isFetchingNextPage && (
            <Box textAlign="center" py={2}>
              <Typography variant="body2">Loading more…</Typography>
            </Box>
          )}
        </>
      )}
    </ScrollBar>
  );
}
