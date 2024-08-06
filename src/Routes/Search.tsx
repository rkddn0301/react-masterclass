import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { getSearch, IGetSearchs } from "../api";
import { useQuery } from "react-query";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";

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

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 100px;
`;

const SearchResult = styled.h2`
  font-size: 35px;
  span {
    font-weight: 700;
  }
`;

const TypeTitle = styled.h3`
  font-size: 25px;
  border-bottom: 1px solid ${(props) => props.theme.white.lighter};
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(
    6,
    1fr
  ); // grid를 열 기준으로 6개씩 균등하게 나눈다는 의미.
  width: 100%;
  position: relative;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-image: ${(props) =>
    props.bgPhoto ? `url(${props.bgPhoto})` : "none"};
  background-color: black;
  background-size: cover;
  background-position: center center;

  width: 100%;
  height: 200px;

  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 25px;
  }
  // nth-child에 n을 넣으면 분단된 열에서 n번째에 해당되는 열에 기능을 적용시킬 수 있음.
  &:nth-child(6n + 1) {
    transform-origin: center left; // 왼쪽 중앙에 변형이 생겨 오른쪽이 튀어나오는 효과를 보여줌
  }
  &:nth-child(6n) {
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

  display: flex;
  justify-content: center;
  align-items: center;

  span {
    font-size: 45px;
  }
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

// !! staggerChildren을 쓸 때 자식 컴포넌트(Box)에 whileHover를 이용하면 동작하지 않는다.
const rowVariants = {
  start: {
    opacity: 0,
  },
  end: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const boxVariants = {
  start: {
    opacity: 0,
  },
  end: {
    opacity: 1,
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

function Search() {
  const history = useHistory();
  const { scrollY } = useScroll();

  const location = useLocation();

  const keyword = new URLSearchParams(location.search).get("keyword"); // URL Query에서 가져옴
  const bigSearchMatch = useRouteMatch<{ searchId: string }>(
    `/search/:searchId`
  );
  const { data, isLoading } = useQuery<IGetSearchs>(["searchs", keyword], () =>
    getSearch(keyword + "")
  );

  const onBoxClicked = (searchId: number) => {
    history.push(`/search/${searchId}?keyword=${keyword}`);
  };

  // 검색 목록 클릭했을 때 동작
  const onOverlayClick = () => history.push(`/search?keyword=${keyword}`);
  const clickedSearch =
    bigSearchMatch?.params.searchId &&
    data?.results.find(
      (search) => String(search.id) === bigSearchMatch.params.searchId
    );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <SearchContainer>
            <SearchResult>
              "<span>{keyword}</span>"로 검색한 결과 입니다.
            </SearchResult>
            <br />
            {["movie", "tv"].map((type) => (
              <div key={type}>
                {/* 
               - chatAt(0).toUpperCase() : 첫 번째 문자만 가져와 대문자로 변환 
               - type.slice(1) : 두 번째 문자열부터 끝까지 가져옴
              */}
                <TypeTitle>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </TypeTitle>

                <Row variants={rowVariants} initial="start" animate="end">
                  {data?.results
                    .filter((search) => search.media_type === type)
                    .map((search) => (
                      <Box
                        key={search.id}
                        bgPhoto={
                          search.backdrop_path
                            ? makeImagePath(search.backdrop_path, "w500")
                            : "No Image"
                        }
                        variants={boxVariants}
                        transition={{ type: "tween" }} // 작성한 이유는 whileHover 에만 tween이 동작하기 때문
                        whileHover={{
                          scale: 1.3,
                          y: -50,
                          transition: {
                            delay: 0.5,
                            duration: 0.1,
                            type: "tween",
                          },
                        }}
                        onClick={() => onBoxClicked(search.id)}
                        layoutId={search.id + ""}
                      >
                        {/* 이미지가 없을 시 글 형식으로 별도 안내 */}
                        {!search.backdrop_path && <span>Sorry, No Image</span>}
                        <Info
                          variants={infoVariants}
                          whileHover={{
                            opacity: 1,
                            transition: {
                              delay: 0.5,
                              duration: 0.1,
                              type: "tween",
                            },
                          }}
                        >
                          <h4>{search.name ? search.name : search.title}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>

                <hr />
              </div>
            ))}
          </SearchContainer>

          <AnimatePresence>
            {bigSearchMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigSearchMatch.params.searchId}
                >
                  {clickedSearch && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent) , url(${makeImagePath(
                            clickedSearch.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      >
                        {/* 이미지가 없을 시 글 형식으로 별도 안내 */}
                        {!clickedSearch.backdrop_path && (
                          <span>Sorry, No Image</span>
                        )}
                      </BigCover>
                      <BigTitle>
                        {clickedSearch.name
                          ? clickedSearch.name
                          : clickedSearch.title}
                      </BigTitle>

                      <BigOverview>
                        OverView : {clickedSearch.overview}
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

export default Search;
