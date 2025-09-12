import { BaseAxiosService } from '@/api/baseAxios';
import type { MovieDetail, MovieResponse } from '@/types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

console.log(import.meta.env.VITE_TMDB_API_KEY);

class TMDBService extends BaseAxiosService {
  constructor() {
    super(BASE_URL, { api_key: API_KEY });
  }

  getPopularMovies(): Promise<MovieResponse> {
    return this.get<MovieResponse>('/movie/popular');
  }

  searchMovies(query: string): Promise<MovieResponse> {
    return this.get<MovieResponse>('/search/movie', {
      params: { query },
    });
  }

  getMovieDetails(id: number): Promise<MovieDetail> {
    return this.get<MovieDetail>(`/movie/${id}`, {
      params: { append_to_response: 'credits,videos' },
    });
  }
}

export const tmdbService = new TMDBService();
