// 영화 정보 API

const API_KEY = "4a8a7b33725ef5683a1085631fd77105";
const BASE_PATH = "https://api.themoviedb.org/3";
const LANGUAGE = "ko-KO";
const REGION = "kr";

// results 내부 타입 지정
export interface IDatas {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  overview: string;
}

// Movie, Tv 기본 데이터 타입 지정
export interface IGetResult {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IDatas[];
  total_pages: number;
  total_results: number;
}

// IGetMovies, IGetTvs > genres 내부 타입 지정
interface IGenres {
  id: number;
  name: string;
}

// Movie 혹은 TV Detail 타입 지정
export interface IGetDatas {
  // total
  id: number;
  backdrop_path: string;
  poster_path: string;
  genres: IGenres[];
  overview: string;

  // Movie
  title?: string;
  release_date?: string; // 개봉일
  runtime?: number; // 상영시간

  // TV
  name?: string;
  first_air_date?: string; // 첫 상영일
  last_air_date?: string; // 마지막 상영일
  number_of_episodes?: number; // 총 화수
  number_of_seasons?: number; // 총 시즌 수
}

// IGetSearchs > results 내부 타입 지정
interface ISearch {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name?: string;
  title?: string;
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
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`
  ).then((response) => response.json());
}

// Movie Lists > top_rated
export function getMoviesTopRated() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`
  ).then((response) => response.json());
}

// Movie Lists > UpComing
export function getMoviesUpcoming() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`
  ).then((response) => response.json());
}

// Movie > Details
export function getMovies(movieId?: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`
  ).then((response) => response.json());
}

// TV Series Lists > Airing Today
export function getTvsAiringToday() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`
  ).then((response) => response.json());
}

// TV Series Lists > Popular
export function getTvsPopular() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`
  ).then((response) => response.json());
}
// TV Series Lists > Top Rated
export function getTvsTopRated() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`
  ).then((response) => response.json());
}

// TV Series > Details
export function getTvs(seriesId: string) {
  return fetch(
    `${BASE_PATH}/tv/${seriesId}?api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`
  ).then((response) => response.json());
}

// Search > Multi
export function getSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}&language=${LANGUAGE}&region=${REGION}`
  ).then((response) => response.json());
}
