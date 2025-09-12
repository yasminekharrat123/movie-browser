import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { MovieList } from '@/components/MovieList';
import { MovieDetailView } from '@/components/MovieDetail';
import { useMovies } from '@/hooks/useMovies';
import { WavyBackground } from '@/components/ui/WavyBackground';
import { ScrollBar } from '@/components/ui/ScrollBar';

export function MovieBrowser() {
  const {
    movies,
    selectedMovie,
    query,
    setQuery,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loadingList,
    loadingDetail,
    listError,
    selectMovie,
  } = useMovies();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ScrollBar>
      <WavyBackground className="w-full h-full flex flex-col lg:flex-row">
        {/* Mobile Header */}
        <div className=" font-sans lg:hidden flex items-center justify-between p-4 backdrop-blur-md">
          <button className="text-gray-700 font-bold" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {!sidebarOpen && 'Menu'}
          </button>
          <h1 className="text-lg font-semibold ">Movies</h1>
        </div>

        {/* Sidebar */}
        <div
          className={`
          fixed lg:relative top-0 left-0 h-full lg:h-auto 
          w-3/4 lg:w-1/5
          p-4 flex flex-col
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          z-50
          ${sidebarOpen ? 'bg-gray-900 text-white' : ''}
        `}
        >
          <SearchBar query={query} onChange={setQuery} />
          <MovieList
            movies={movies}
            onSelect={selectMovie}
            loading={loadingList}
            error={listError}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 h-full p-4 lg:p-6 overflow-auto ml-0 lg:ml-0">
          <MovieDetailView movie={selectedMovie} loading={loadingDetail} />
        </div>
      </WavyBackground>
    </ScrollBar>
  );
}
