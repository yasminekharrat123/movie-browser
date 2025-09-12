import type { MovieDetail } from '@/types/movie';
import { FloatingCard } from '@/components/ui/FloatingCard';
import { formatDate, hasItems } from '@/lib/utils';
import { MovieDetailSkeleton } from './ui/MovieDetailSkeleton';

interface Props {
  movie: MovieDetail | null;
  loading: boolean;
}

export function MovieDetailView({ movie, loading }: Props) {
  if (loading) {
    return <MovieDetailSkeleton />;
  }

  if (!movie) {
    return (
      <div className="flex items-center justify-center h-full font-extrabold">
        <span>Select a movie to see details</span>
      </div>
    );
  }
  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start font-sans">
      <div className="flex flex-col h-full">
        {/* Title + Release Date */}
        <div className="mb-6">
          {movie.title && (
            <h2 className="text-3xl font-extrabold mb-2 text-center lg:text-left">{movie.title}</h2>
          )}
          {movie.release_date && (
            <p className="text-sm text-gray-400 font-semibold text-center lg:text-left">
              <span className="font-extrabold">Release Date:</span> {formatDate(movie.release_date)}
            </p>
          )}
          {movie.tagline?.trim() && (
            <p className="italic text-gray-500 font-semibold mt-2 text-center lg:text-left">
              "{movie.tagline}"
            </p>
          )}
        </div>

        {/* Poster (moves under title on small screens, right column on lg+) */}
        <div className="flex justify-center mb-6 lg:hidden">
          <FloatingCard>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : '/No-Image-Placeholder.png'
              }
              alt={movie.poster_path ? movie.title : 'No poster available'}
              className="w-full h-auto object-cover rounded-2xl"
            />
          </FloatingCard>
        </div>

        {/* Details */}
        <div className="space-y-4 text-sm mt-auto">
          {movie.overview?.trim() && (
            <p className="text-gray-300 leading-relaxed font-semibold">{movie.overview}</p>
          )}

          <div className="space-y-1 text-gray-300 font-semibold">
            {movie.runtime ? (
              <p>
                <span className="font-extrabold">Runtime:</span> {movie.runtime} min
              </p>
            ) : null}

            {hasItems(movie.genres) && (
              <p>
                <span className="font-extrabold">Genres:</span>{' '}
                {movie.genres
                  .map((g) => g.name)
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}

            {movie.vote_average && movie.vote_count
              ? movie.vote_count > 0 && (
                  <p>
                    <span className="font-extrabold">Rating:</span> {movie.vote_average.toFixed(1)}{' '}
                    / 10 ({movie.vote_count} votes)
                  </p>
                )
              : null}

            {movie.status?.trim() && (
              <p>
                <span className="font-extrabold">Status:</span> {movie.status}
              </p>
            )}

            {movie.budget
              ? movie.budget > 0 && (
                  <p>
                    <span className="font-extrabold">Budget:</span> ${movie.budget.toLocaleString()}
                  </p>
                )
              : null}

            {movie.revenue
              ? movie.revenue > 0 && (
                  <p>
                    <span className="font-extrabold">Revenue:</span> $
                    {movie.revenue.toLocaleString()}
                  </p>
                )
              : null}

            {hasItems(movie.production_companies) && (
              <p>
                <span className="font-extrabold">Production:</span>{' '}
                {movie.production_companies
                  .map((c) => c.name)
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}

            {hasItems(movie.spoken_languages) && (
              <p>
                <span className="font-extrabold">Languages:</span>{' '}
                {movie.spoken_languages
                  .map((l) => l.english_name)
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
            {hasItems(movie.production_countries) && (
              <p>
                <span className="font-extrabold">Countries:</span>{' '}
                {movie.production_countries
                  .map((c) => c.name)
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
          </div>

          {movie.credits?.cast?.some((actor) => actor.name?.trim() && actor.character?.trim()) && (
            <div>
              <p className="font-extrabold text-gray-200">Top Cast:</p>
              <ul className="list-disc list-inside font-semibold">
                {movie.credits.cast
                  .filter((actor) => actor.name?.trim() && actor.character?.trim())
                  .slice(0, 5)
                  .map((actor) => (
                    <li key={actor.id}>
                      {actor.name.trim()} as {actor.character.trim()}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Trailer */}
          {hasItems(movie.videos?.results) && (
            <div>
              <p className="font-extrabold text-gray-200 mb-2">Trailer:</p>
              {movie.videos.results
                .filter((v) => v.type === 'Trailer' && v.site === 'YouTube' && v.key)
                .slice(0, 1)
                .map((trailer) => (
                  <iframe
                    key={trailer.id}
                    width="100%"
                    height="250"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={trailer.name}
                    allowFullScreen
                    className="rounded-xl"
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Poster (only visible on lg+) */}
      <div className="hidden lg:flex justify-end">
        <FloatingCard>
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/No-Image-Placeholder.png'
            }
            alt={movie.poster_path ? movie.title : 'No poster available'}
            className="w-full h-auto object-cover rounded-2xl"
          />
        </FloatingCard>
      </div>
    </div>
  );
}
