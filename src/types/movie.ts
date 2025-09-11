export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

export interface MovieResponse {
  results: Movie[];
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
}
