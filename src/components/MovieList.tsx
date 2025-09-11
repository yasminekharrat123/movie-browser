import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Alert,
} from "@mui/material";
import type { Movie } from "@/types/movie";
import { ScrollBox } from "@/components/ui/ScrollBar";

interface Props {
  movies: Movie[];
  onSelect: (id: number) => void;
  loading: boolean;
  error: string | null;
}

export function MovieList({ movies, onSelect, loading, error }: Props) {
  return (
    <ScrollBox px={2} pb={2}>
      {loading && (
        <List disablePadding>
          {Array.from({ length: 5 }).map((_, i) => (
            <ListItem key={i} disablePadding>
              <ListItemButton disabled>
                <Skeleton
                  variant="rectangular"
                  width={50}
                  height={75}
                  sx={{ borderRadius: 1, mr: 2, opacity: 0.8}}
                  
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
          {typeof error === "string" ? error : "Something went wrong"}
        </Alert>
      )}

      {!loading && !error && movies.length === 0 && (
        <Typography variant="body2" color="text.secondary" align="center" py={4}>
          No movies found.
        </Typography>
      )}

      {!loading && !error && movies.length > 0 && (
        <List disablePadding>
          {movies.map((movie) => (
            <ListItem key={movie.id} disablePadding>
              <ListItemButton onClick={() => onSelect(movie.id)}>
                <Box
                  component="img"
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : "/placeholder.png"
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
      )}
    </ScrollBox>
  );
}
