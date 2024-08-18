import styled from "styled-components";
import {
  getTvs,
  getTvsAiringToday,
  getTvsPopular,
  getTvsTopRated,
  IGetDatas,
  IGetResult,
} from "../api";
import { useQuery } from "react-query";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";
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

function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ seriesId: string }>(`/tv/:seriesId`); // :seriesId 받아오는 데이터를 string으로 지정
  const { scrollY } = useScroll();

  const { data: tvsAiringData, isLoading: tvsAiringLoad } =
    useQuery<IGetResult>(["tvs", "airingtoday"], getTvsAiringToday); // 금일 방송 일정 react-query
  const { data: tvsPopularData, isLoading: tvsPopularLoad } =
    useQuery<IGetResult>(["tvs", "popular"], getTvsPopular); // 인기 방송 react-query
  const { data: tvsTopRatedData, isLoading: tvsTopLoad } = useQuery<IGetResult>(
    ["tvs", "toprated"],
    getTvsTopRated
  ); // 최고 순위 react-query

  const { data: tvsData } = useQuery<IGetDatas>(
    ["tvs", bigTvMatch?.params.seriesId],
    () => getTvs(bigTvMatch?.params.seriesId + ""),
    {
      enabled: !!bigTvMatch?.params.seriesId, // seriesId가 있을 시에만 reactquery 실행
    }
  ); // TV 상세 데이터 가져오기

  const loading = tvsAiringLoad || tvsPopularLoad || tvsTopLoad; // 공통적으로 isLoading이 존재하는지의 여부를 확인할 때 사용

  const [clickedTvName, setClickedTvName] = useState(""); // slider layoutId 구분

  // TV 목록 클릭했을 때 동작
  const onOverlayClick = () => {
    history.push(`/tv`);
  };

  const clickedTv = bigTvMatch?.params.seriesId && tvsData; // TV detail별 데이터 가져오기

  return (
    <Wrapper>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              tvsAiringData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{tvsAiringData?.results[0].name}</Title>
            <Overview>{tvsAiringData?.results[0].overview}</Overview>
          </Banner>
          <SliderContainer>
            <SliderTitle>Airing Today &gt; </SliderTitle>
            <Slider
              data={tvsAiringData as IGetResult}
              clickedName={setClickedTvName}
              title="tvs_airing"
            />
            <SliderTitle>Popular &gt; </SliderTitle>
            <Slider
              data={tvsPopularData as IGetResult}
              clickedName={setClickedTvName}
              title="tvs_popular"
            />
            <SliderTitle>Top Rated &gt; </SliderTitle>
            <Slider
              data={tvsTopRatedData as IGetResult}
              clickedName={setClickedTvName}
              title="tvs_topRated"
            />
          </SliderContainer>

          {/* 내가 클릭한 박스의 id 경로가 bigTvMatch 있을 경우 추출 */}
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={`${clickedTvName}-${bigTvMatch.params.seriesId}`}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent) , url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigDetail>
                        장르 :
                        {clickedTv.genres.map((genres, index) =>
                          index !== clickedTv.genres.length - 1 ? (
                            <span> {genres.name},</span>
                          ) : (
                            <span> {genres.name}</span>
                          )
                        )}
                      </BigDetail>
                      <BigDetail>
                        시작&마지막 방영일 : {clickedTv.first_air_date} &{" "}
                        {clickedTv.last_air_date}
                      </BigDetail>
                      <BigDetail>
                        총 시즌&화수 : {clickedTv.number_of_seasons} &{" "}
                        {clickedTv.number_of_episodes}
                      </BigDetail>
                      <BigOverview>개요 : {clickedTv.overview}</BigOverview>
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

export default Tv;
