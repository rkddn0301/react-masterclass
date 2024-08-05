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

// IGetMovies, IGetTvs > genres 내부 타입 지정
interface IGenres {
  id: number;
  name: string;
}

// 영화 정보 API 타입 지정
export interface IGetMoviesNowPlaying {
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

// IGetTvsAiringToday > results 내부 타입 지정
interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  popularity: number;
  first_air_date: string;
}

// TV 정보 API 타입 지정
export interface IGetTvsAiringToday {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}
export interface IGetTvsPopular {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}
export interface IGetTvsTopRated {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}
export interface IGetTvs {
  id: number;
  backdrop_path: string;
  poster_path: string;
  genres: IGenres[];
  name: string;
  overview: string;
  popularity: number;
  first_air_date: string; // 첫 상영일
  last_air_date: string; // 마지막 상영일
  number_of_episodes: number; // 총 화수
  number_of_seasons: number; // 총 시즌 수
}

// IGetSearchs > results 내부 타입 지정
interface ISearch {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  media_type: string; // 미디어 종류
}

// Search 정보 API 타입 지정
export interface IGetSearchs {
  page: number;
  results: ISearch[];
  total_pages: number;
  total_results: number;
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
export function getMovies(movieId?: string) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// TV Series Lists > Airing Today
export function getTvsAiringToday() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// TV Series Lists > Popular
export function getTvsPopular() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}
// TV Series Lists > Top Rated
export function getTvsTopRated() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// TV Series > Details
export function getTvs(seriesId: string) {
  return fetch(`${BASE_PATH}/tv/${seriesId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// Search > Multi
export function getSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}
