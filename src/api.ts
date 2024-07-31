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

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
