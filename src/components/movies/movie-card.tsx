import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  
  return (
    <article className="movie-card">
      <div className="overflow-hidden rounded-[10px] relative aspect-[2/3] bg-[var(--surface)]">
        <Link 
          to="/movies/$movieId" 
          params={{ movieId: String(movie.id) }}
          className ="block width-[100%] height=[100#]"
        >
          <img src={movie.posterPath} alt={`${movie.title} 포스터`} className = "block w-full h-full object-cover"/>
        </Link>
        <BookmarkButton movieId={movie.id} />
        
      </div>
      <Link 
          to="/movies/$movieId" 
          params={{ movieId: String(movie.id) }}
          className ="text-inherit no-underline">
          <h3 className="mt-3 text-base font-bold truncate">{movie.title}</h3>
      </Link>
      
      <p className="mt-1 text-sm text-[color:var(--text-sub)]">{movie.releaseDate}</p>
    </article>
  );
}
