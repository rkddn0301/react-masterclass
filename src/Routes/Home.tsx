import { useQuery } from "react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  getMovies,
  getMoviesNowPlaying,
  getMoviesTopRated,
  getMoviesUpcoming,
  IGetDatas,
  IGetResult,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  overflow-x: hidden; // 가로 스크롤바 가리기
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto}); // 그라디언트와 이미지 색상을 이용하여 시각적 효과를 높일 수 있음.
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
`;

const Overview = styled.p`
  font-size: 25px;
  width: 50%;
  margin-top: 50px;
  line-height: 35px;
`;
const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SliderTitle = styled.p`
  font-size: 25px;
  top: -40px;
  left: 10px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px 0px 5px 20px;
  font-size: 35px;
  position: relative;
  top: -80px;
`;

const BigDetail = styled.p`
  position: relative;
  padding: 15px 0px 5px 15px;
  font-size: 18px;
  color: ${(props) => props.theme.white.lighter};
  top: -50px;
`;

const BigOverview = styled.p`
  position: relative;
  padding: 15px 15px 0px 15px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 18px;
  top: -50px;
  line-height: 20px; // 글 위아래 간격

  overflow: hidden; // display 내용이 박스 경계를 넘어설 경우 숨김
  text-overflow: ellipsis; // 글 마지막에 ... 넣기
  display: -webkit-box; // 줄 지정을 위한 display
  -webkit-line-clamp: 8; // 지정한 줄 수만큼 자르고 그 이후를 생략함
  -webkit-box-orient: vertical; // 글 수직방향으로 배치
`;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(`/movies/:movieId`); // :movieId로 받아오는 데이터를 string으로 지정
  const { scrollY } = useScroll();

  const { data: moviesNowData, isLoading: moviesNowLoad } =
    useQuery<IGetResult>(["movies", "nowPlaying"], getMoviesNowPlaying); // 현재 상영중인 영화 데이터 react-query

  const { data: moviesTopRatedData, isLoading: moviesTopRatedLoad } =
    useQuery<IGetResult>(["movies", "topRated"], getMoviesTopRated); // 인기 영화 react-query

  const { data: moviesUpcomingData, isLoading: moviesUpcomingLoad } =
    useQuery<IGetResult>(["movies", "upcoming"], getMoviesUpcoming); // 상영 예정 영화 react-query

  const { data: moviesData } = useQuery<IGetDatas>(
    ["movies", bigMovieMatch?.params.movieId],
    () => getMovies(bigMovieMatch?.params.movieId + ""),
    {
      enabled: !!bigMovieMatch?.params.movieId, // movieId가 있을 시에만 reactquery 실행
    }
  ); // 영화 상세 데이터 가져오기

  const loading = moviesNowLoad || moviesTopRatedLoad || moviesUpcomingLoad; // 공통적으로 isLoading이 존재하는지의 여부를 확인할 때 사용

  const [clickedMovieName, setClickedMovieName] = useState(""); // slider layoutId 구분

  // 영화 목록 클릭했을 때 동작
  const onOverlayClick = () => {
    history.push(`/`);
  };
  const clickedMovie = bigMovieMatch?.params.movieId && moviesData; // 영화 detail별 데이터 가져오기
  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              moviesNowData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{moviesNowData?.results[0].title}</Title>
            <Overview>{moviesNowData?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            <SliderTitle>Now Playing &gt; </SliderTitle>
            <Slider
              data={moviesNowData as IGetResult}
              clickedName={setClickedMovieName}
              title="movies_nowPlaying"
            />
            <SliderTitle>Top Rated &gt; </SliderTitle>
            <Slider
              data={moviesTopRatedData as IGetResult}
              clickedName={setClickedMovieName}
              title="movies_topRated"
            />
            <SliderTitle>Upcoming &gt; </SliderTitle>
            <Slider
              data={moviesUpcomingData as IGetResult}
              clickedName={setClickedMovieName}
              title="movies_upcoming"
            />
          </SliderContainer>

          {/* 내가 클릭한 박스의 id 경로가 bigMovieMatch 있을 경우 추출 */}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={`${clickedMovieName}-${bigMovieMatch.params.movieId}`}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent) , url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigDetail>
                        장르 :
                        {clickedMovie.genres.map((genres, index) =>
                          index !== clickedMovie.genres.length - 1 ? (
                            <span> {genres.name},</span>
                          ) : (
                            <span> {genres.name}</span>
                          )
                        )}
                      </BigDetail>
                      <BigDetail>
                        개봉일 : {clickedMovie.release_date}
                      </BigDetail>
                      <BigDetail>
                        방영시간 :{" "}
                        {clickedMovie.runtime && clickedMovie?.runtime > 60
                          ? `${Math.floor(clickedMovie?.runtime / 60)}시간 ${
                              clickedMovie?.runtime % 60
                            }분`
                          : `${clickedMovie.runtime}분`}
                      </BigDetail>
                      <BigOverview>개요 : {clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
