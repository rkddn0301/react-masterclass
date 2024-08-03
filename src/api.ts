// 영화 정보 API

const API_KEY = "4a8a7b33725ef5683a1085631fd77105";
const BASE_PATH = "https://api.themoviedb.org/3";

// IGetMoviesResult > results 내부 타입 지정
interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

interface IGenres {
  id: number;
  name: string;
}

// 영화 정보 API 타입 지정
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetMoviesPopular {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetMoviesUpcoming {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetMovies {
  genres: IGenres[]; // 장르
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string; // 제목
  overview: string; // 줄거리
  release_date: string; // 개봉일
  runtime: number; // 상영시간
}

// Movie Lists > Now Playing
export function getMoviesNowPlaying() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// Movie Lists > Popular
export function getMoviesPopular() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// Movie Lists > UpComing
export function getMoviesUpcoming() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// Movie > Details
export function getMovies(movieId: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
