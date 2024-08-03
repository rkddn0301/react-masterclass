import { useQuery } from "react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import {
  getMovies,
  getMoviesNowPlaying,
  getMoviesPopular,
  getMoviesUpcoming,
  IGetMovies,
  IGetMoviesPopular,
  IGetMoviesResult,
  IGetMoviesUpcoming,
} from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

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
  font-size: 30px;
  width: 50%;
`;
const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Slider = styled.div`
  position: relative;
  margin-bottom: 15rem;
  span:nth-child(1) {
    left: 0;
  }
  span:nth-child(2) {
    right: 0;
  }
`;

const SliderTitle = styled.p`
  font-size: 25px;
  position: absolute;
  top: -40px;
  left: 10px;
`;

/* const SliderButton = styled.span`
  font-size: 50px;
  position: absolute;
  z-index: 1;
  top: 75px;
  cursor: pointer;
  font-weight: 700;
`; */

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(
    6,
    1fr
  ); // grid를 열 기준으로 6개씩 균등하게 나눈다는 의미.
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center; // 배경 이미지 위치를 중앙에 배치
  font-size: 64px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left; // 왼쪽 중앙에 변형이 생겨 오른쪽이 튀어나오는 효과를 보여줌
  }
  &:last-child {
    transform-origin: center right; // 오른쪽 중앙에 변형이 생겨 왼쪽이 튀어나오는 효과를 보여줌
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
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
  padding: 10px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigDetail = styled.p`
  position: relative;
  padding: 15px;
  color: ${(props) => props.theme.white.lighter};
  top: -50px;
`;

const BigOverview = styled.p`
  position: relative;
  padding: 15px;
  color: ${(props) => props.theme.white.lighter};
  top: -50px;
`;

// window.outerWidth : 브라우저 창의 전체 너비를 측정(창 테두리, 스크롤바 포함)
// window.innerWidth : 브라우저 창의 전체 너비를 측정(창 테두리, 스크롤바 제외)
const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6; // slider에서 영화를 보여줄 개수

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId"); // :movieId로 받아오는 데이터를 string으로 지정
  const { scrollY } = useScroll();
  const { data: moviesNowData, isLoading: moviesNowLoad } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMoviesNowPlaying); // 현재 상영중인 영화 데이터 react-query

  const { data: moviesPopularData, isLoading: moviesPopularLoad } =
    useQuery<IGetMoviesPopular>(["movies", "popular"], getMoviesPopular); // 인기 영화 react-query

  const { data: moviesUpcomingData, isLoading: moviesUpcomingLoad } =
    useQuery<IGetMoviesUpcoming>(["movies", "upcoming"], getMoviesUpcoming); // 상영 예정 영화 react-query

  const { data: moviesData, isLoading: moviesLoad } = useQuery<IGetMovies>(
    ["movies", bigMovieMatch?.params.movieId],
    () => getMovies(bigMovieMatch?.params.movieId + "")
  ); // 영화 상세 데이터 가져오기

  const loading = moviesNowLoad || moviesPopularLoad || moviesUpcomingLoad; // 공통적으로 isLoading이 존재하는지의 여부를 확인할 때 사용

  const [nowPlayingIndex, setNowPlayingIndex] = useState(0); // nowPlaying slider 페이지 구분
  const [popularIndex, setPopularIndex] = useState(0); // popular slider 페이지 구분
  const [upcomingIndex, setUpcomingIndex] = useState(0); // upcoming slider 페이지 구분

  const [leaving, setLeaving] = useState(false);

  const [clickedMovieName, setClickedMovieName] = useState(""); // slider layoutId 구분

  const incraseIndex = () => {
    if (moviesNowData) {
      if (leaving) return; // slider를 2번 클릭하면 1번 클릭했을 때 새로 들어오는 slider가 사라지려하여 방지하기 위함
      toggleLeaving();
      const totalMovies = moviesNowData.results.length - 1; // 영화 총 개수(-1 : 배경으로 사용된 영화 제외)
      const maxIndex = Math.floor(totalMovies / offset) - 1; // 페이징 총 수(-1 : 페이징 배열은 0부터)
      setNowPlayingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }

    if (moviesPopularData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = moviesPopularData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1; // 페이징 총 수(-1 : 페이징 배열은 0부터)
      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }

    if (moviesUpcomingData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = moviesUpcomingData.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1; // 페이징 총 수(-1 : 페이징 배열은 0부터)
      setUpcomingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number, clickedMovieName: string) => {
    setClickedMovieName(clickedMovieName);
    history.push(`/movies/${movieId}`); // useHistory를 통해 경로 생성
  };

  // 10초마다 자동 슬라이드 동작
  useEffect(() => {
    const interval = setInterval(() => {
      incraseIndex();
    }, 10000);

    return () => clearInterval(interval);
  }, [moviesNowData, moviesPopularData, moviesUpcomingData]);

  // 영화 목록 클릭했을 때 동작
  const onOverlayClick = () => {
    history.push("/");
  };
  const clickedMovie = bigMovieMatch?.params.movieId && moviesData; // 영화 detail별 데이터 가져오기
  /* nowPlaying만 있는 데이터
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    moviesNowData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    ); */

  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={incraseIndex}
            bgPhoto={makeImagePath(
              moviesNowData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{moviesNowData?.results[0].title}</Title>
            <Overview>{moviesNowData?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            <Slider>
              {/* Now Playing */}
              <SliderTitle>Now Playing &gt; </SliderTitle>

              {/* initial={false} : 페이지 첫 로드 할 때 slider 미적용 */}
              {/* onExitComplete : exit 작업 끝난 후 진행 시켜줌.   */}
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }} // tween은 중간 단계에서 부드럽게 변화하는 애니메이션을 적용한 것.
                  key={nowPlayingIndex}
                >
                  {/* slice를 2개 사용하게 되면, 첫 번째로 사용된 slice는 아예 제외하고 두 번째 slice부터 다시 계산한다. */}
                  {/* 아래같이 작성한 이유는 1번째 영화는 배경으로 사용중이기 때문에 보여줄 필요가 없다. */}
                  {moviesNowData?.results
                    .slice(1)
                    .slice(
                      offset * nowPlayingIndex,
                      offset * nowPlayingIndex + offset
                    )
                    .map((movie) => (
                      <Box
                        key={movie.id}
                        variants={boxVariants}
                        onClick={() => onBoxClicked(movie.id, "nowPlaying")}
                        layoutId={`nowPlaying-${movie.id}`}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <Slider>
              {/* Popular */}
              <SliderTitle>Popular &gt; </SliderTitle>
              {/* initial={false} : 페이지 첫 로드 할 때 slider 미적용 */}
              {/* onExitComplete : exit 작업 끝난 후 진행 시켜줌. */}
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }} // tween은 중간 단계에서 부드럽게 변화하는 애니메이션을 적용한 것.
                  key={popularIndex}
                >
                  {/* slice를 2개 사용하게 되면, 첫 번째로 사용된 slice는 아예 제외하고 두 번째 slice부터 다시 계산한다. */}
                  {/* 아래같이 작성한 이유는 1번째 영화는 배경으로 사용중이기 때문에 보여줄 필요가 없다. */}
                  {moviesPopularData?.results
                    .slice(
                      offset * popularIndex,
                      offset * popularIndex + offset
                    )
                    .map((movie) => (
                      <Box
                        key={movie.id}
                        variants={boxVariants}
                        onClick={() => onBoxClicked(movie.id, "popular")}
                        layoutId={`popular-${movie.id}`}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <Slider>
              {/* Upcoming */}
              <SliderTitle>Upcomming &gt; </SliderTitle>
              {/* initial={false} : 페이지 첫 로드 할 때 slider 미적용 */}
              {/* onExitComplete : exit 작업 끝난 후 진행 시켜줌. */}
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }} // tween은 중간 단계에서 부드럽게 변화하는 애니메이션을 적용한 것.
                  key={upcomingIndex}
                >
                  {/* slice를 2개 사용하게 되면, 첫 번째로 사용된 slice는 아예 제외하고 두 번째 slice부터 다시 계산한다. */}
                  {/* 아래같이 작성한 이유는 1번째 영화는 배경으로 사용중이기 때문에 보여줄 필요가 없다. */}
                  {moviesUpcomingData?.results
                    .slice(
                      offset * upcomingIndex,
                      offset * upcomingIndex + offset
                    )
                    .map((movie) => (
                      <Box
                        key={movie.id}
                        variants={boxVariants}
                        onClick={() => onBoxClicked(movie.id, "upcoming")}
                        layoutId={`upcoming-${movie.id}`}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
          </SliderContainer>

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
                        Genres :
                        {clickedMovie.genres.map((genres) => (
                          <span>{` ${genres.name}`}</span>
                        ))}
                      </BigDetail>
                      <BigDetail>
                        Release : {clickedMovie.release_date}
                      </BigDetail>
                      <BigDetail>
                        Runtime :{" "}
                        {clickedMovie.runtime > 60
                          ? `${Math.floor(clickedMovie.runtime / 60)}h ${
                              clickedMovie.runtime % 60
                            }m`
                          : `${clickedMovie.runtime}m`}
                      </BigDetail>
                      <BigOverview>
                        OverView : {clickedMovie.overview}
                      </BigOverview>
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
