import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { MovieList } from '@/components/MovieList';
import { MovieDetailView } from '@/components/MovieDetail';
import { useMovies } from '@/hooks/useMovies';
import { WavyBackground } from '@/components/ui/WavyBackground';

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

  console.log('test monitoring with sample log from frontend stdout');
  return (
    <WavyBackground className="flex size-full flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className=" flex items-center justify-between p-4 font-sans backdrop-blur-md lg:hidden">
        <button className="font-bold text-gray-700" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {!sidebarOpen && 'Menu'}
        </button>
        <h1 className="text-lg font-semibold ">Movies</h1>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 flex h-full w-3/4 
          flex-col p-4
          transition-transform duration-300 lg:relative
          lg:h-auto lg:w-1/5
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-50
          lg:translate-x-0
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
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="ml-0 h-full flex-1 overflow-auto p-4 lg:ml-0 lg:p-6">
        <MovieDetailView movie={selectedMovie} loading={loadingDetail} />
      </div>
    </WavyBackground>
  );
}
