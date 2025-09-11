import { SearchBar } from '@/components/SearchBar';
import { MovieList } from '@/components/MovieList';
import { MovieDetailView } from '@/components/MovieDetail';
import { useMovies } from '@/hooks/useMovies';
import { WavyBackground } from '@/components/ui/WavyBackground';
import { Drawer } from '@mui/material';

export function MovieBrowser() {
  const { movies, selectedMovie, query, setQuery, loading, error, selectMovie } = useMovies();

  return (
    <WavyBackground
      containerClassName="min-h-screen w-full"
      className="w-screen h-screen max-w-none flex items-start justify-center pt-8"
    >
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <Drawer
            variant="permanent"
            sx={{
              width: 500, 
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 500,
                boxSizing: 'border-box',
                backgroundColor: 'transparent', 
                backdropFilter: 'blur(8px)', 
              },
            }}
          >
            <SearchBar query={query} onChange={setQuery} />
            <MovieList movies={movies} onSelect={selectMovie} loading={loading} error={error} />
          </Drawer>
        </div>

        <div className="flex-1 border-l border-gray-200 pl-4">
          {selectedMovie ? (
            <MovieDetailView movie={selectedMovie} />
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p>Select a movie to see details</p>
            </div>
          )}
        </div>
      </div>
    </WavyBackground>
  );
}
