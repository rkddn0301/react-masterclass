import { useQuery } from "react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getMovies, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { useState } from "react";

const Wrapper = styled.div`
  background: black;
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

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

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

const offset = 6; // slider에서 영화를 보여줄 개수

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  ); // 영화 데이터 react-query
  const [index, setIndex] = useState(0); // slider 페이지 구분
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (data) {
      if (leaving) return; // slider를 2번 클릭하면 1번 클릭했을 때 새로 들어오는 slider가 사라지려하여 방지하기 위함
      toggleLeaving();
      const totalMovies = data.results.length - 1; // 영화 총 개수(-1 : 배경으로 사용된 영화 제외)
      const maxIndex = Math.floor(totalMovies / offset) - 1; // 페이징 총 수(-1 : 페이징 배열은 0부터)
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={incraseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            {/* initial={false} : 페이지 첫 로드 할 때 slider 미적용 */}
            {/* onExitComplete : exit 작업 끝난 후 진행 시켜줌. */}
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }} // tween은 중간 단계에서 부드럽게 변화하는 애니메이션을 적용한 것.
                key={index}
              >
                {/* slice를 2개 사용하게 되면, 첫 번째로 사용된 slice는 아예 제외하고 두 번째 slice부터 다시 계산한다. */}
                {/* 아래같이 작성한 이유는 1번째 영화는 배경으로 사용중이기 때문에 보여줄 필요가 없다. */}
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    ></Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
