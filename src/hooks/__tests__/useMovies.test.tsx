import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMovies } from "../useMovies";
import { tmdbService } from "@/api/tmdb";

jest.mock("@/api/tmdb");

jest.setTimeout(10000);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useMovies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it(
    "fetches popular movies by default",
    async () => {
      (tmdbService.getPopularMovies as jest.Mock).mockResolvedValue({
        page: 1,
        total_pages: 1,
        results: [{ id: 1, title: "Inception", release_date: "2010-07-16" }],
      });

      const { result } = renderHook(() => useMovies(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.movies.length).toBe(1));

      expect(tmdbService.getPopularMovies).toHaveBeenCalledWith(1);
      expect(result.current.movies[0].title).toBe("Inception");
    },
    10000
  );

  it(
    "caches and returns movie details correctly",
    async () => {
      (tmdbService.getMovieDetails as jest.Mock).mockResolvedValue({
        id: 1,
        title: "Inception",
        overview: "A mind-bending movie",
        release_date: "2010-07-16",
        poster_path: "/test.jpg",
      });

      const { result } = renderHook(() => useMovies(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.selectMovie(1);
      });

      expect(tmdbService.getMovieDetails).toHaveBeenCalledWith(1);
      expect(result.current.selectedMovie?.title).toBe("Inception");

      await act(async () => {
        await result.current.selectMovie(1);
      });

      expect(tmdbService.getMovieDetails).toHaveBeenCalledTimes(1); 
    },
    10000
  );
});
