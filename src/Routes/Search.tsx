import { useLocation } from "react-router-dom";
import { getSearch, IGetSearchs } from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion } from "framer-motion";

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

const Tester = styled.div<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  padding: 60px;
  width: 200px;
  height: 200px;
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

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword"); // URL Query에서 가져옴

  const { data, isLoading } = useQuery<IGetSearchs>(["searchs", keyword], () =>
    getSearch(keyword + "")
  );

  console.log(data);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <SliderContainer>
          {data?.results.map((search) => (
            <Tester
              key={search.id}
              bgPhoto={makeImagePath(search.backdrop_path, "w500")}
            />
          ))}
        </SliderContainer>
      )}
    </Wrapper>
  );
}

export default Search;
