export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
}

export interface MovieDetail extends Movie {
  genres: string[];
  runtime: string;
  tagline: string;
}
