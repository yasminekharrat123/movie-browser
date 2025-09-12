import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MovieList } from '../MovieList';
import type { Movie } from '@/types/movie';

const sampleMovies: Movie[] = [
  {
    id: 1,
    title: 'Movie One',
    release_date: '2024-01-01',
    poster_path: '/test1.jpg',
    overview: '',
  },
  {
    id: 2,
    title: 'Movie Two',
    release_date: '2024-02-01',
    poster_path: null,
    overview: '',
  },
];

describe('MovieList', () => {
  it('renders skeletons while loading', () => {
    render(
      <MovieList
        movies={[]}
        onSelect={jest.fn()}
        loading={true}
        error={null}
        fetchNextPage={jest.fn()}
      />,
    );

    expect(screen.getAllByTestId('skeleton')).toHaveLength(5);
  });

  it('shows error message when error is provided', () => {
    render(
      <MovieList
        movies={[]}
        onSelect={jest.fn()}
        loading={false}
        error="Something went wrong"
        fetchNextPage={jest.fn()}
      />,
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('shows empty state when no movies', () => {
    render(
      <MovieList
        movies={[]}
        onSelect={jest.fn()}
        loading={false}
        error={null}
        fetchNextPage={jest.fn()}
      />,
    );

    expect(screen.getByText(/No movies found/i)).toBeInTheDocument();
  });

  it('renders movies with title and release date', () => {
    render(
      <MovieList
        movies={sampleMovies}
        onSelect={jest.fn()}
        loading={false}
        error={null}
        fetchNextPage={jest.fn()}
      />,
    );

    expect(screen.getByText('Movie One')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('Movie Two')).toBeInTheDocument();
  });

  it('calls onSelect when a movie is clicked', () => {
    const onSelect = jest.fn();

    render(
      <MovieList
        movies={sampleMovies}
        onSelect={onSelect}
        loading={false}
        error={null}
        fetchNextPage={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByText('Movie One'));
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
