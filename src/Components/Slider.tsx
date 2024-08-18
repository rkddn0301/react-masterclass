import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import { IGetResult } from "../api";
import { makeImagePath } from "../utils";
import { useHistory } from "react-router-dom";

const SliderLine = styled.div`
  position: relative;
  margin-bottom: 15rem;
  &:hover .arrow {
    opacity: 1;
  }
`;

const SliderButton = styled.span<{
  isFirst?: boolean;
  isLast?: boolean;
}>`
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 25px;
  position: absolute;

  font-size: 50px;
  line-height: 40px;
  text-align: center;
  color: whitesmoke;

  z-index: 1;
  top: 75px;
  opacity: 0;
  transition: 0.2s ease-in-out;

  cursor: pointer;
  font-weight: 700;
  ${(props) => props.isFirst && "left: 0;"}
  ${(props) => props.isLast && "right: 0;"}


  &:hover {
    transition: 0.2s ease-in-out;
    background-color: rgba(0, 0, 0, 1);
  }
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
  background-image: ${(props) =>
    props.bgPhoto ? `url(${props.bgPhoto})` : "none"};
  background-color: black;
  height: 200px;
  background-size: cover;
  background-position: center center; // 배경 이미지 위치를 중앙에 배치
  font-size: 64px;
  span {
    font-size: 25px;
  }
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

// window.outerWidth : 브라우저 창의 전체 너비를 측정(창 테두리, 스크롤바 포함)
// window.innerWidth : 브라우저 창의 전체 너비를 측정(창 테두리, 스크롤바 제외)
const rowVariants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
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

interface SliderProps {
  data: IGetResult; // 총합 데이터
  clickedName: Dispatch<SetStateAction<string>>; // Overlay layoutId 구분
  title: string; // Movie, Tv 구분
}

const offset = 6; // slider에서 이미지 보여줄 개수
function Slider({ data, clickedName, title }: SliderProps) {
  const history = useHistory();
  const [isBack, setIsBack] = useState(false); // 슬라이드 반대 여부 스위칭
  const [index, setIndex] = useState(0); // 슬라이드
  const [leaving, setLeaving] = useState(false); // 슬라이드 증가/감소 부분 주석 참고
  const toggleLeaving = () => setLeaving((prev) => !prev); // AnimatePresence에서 추가 작업 방지용으로 사용.

  const slicedData = data?.results
    .slice(title === "movies_nowPlaying" || title === "tvs_airing" ? 1 : 0)
    .slice(offset * index, offset * index + offset);

  // 슬라이더 증가
  const increaseIndex = () => {
    if (data) {
      if (leaving) return; // 슬라이드를 2번 클릭하면 1번 클릭했을 때 새로 들어오는 슬라이드가 사라지려하여 방지하기 위함
      toggleLeaving();
      const totalDatas =
        title === "movies_nowPlaying" || title === "tvs_airing"
          ? data.results.length - 1
          : data.results.length - 2; // 영화 총 개수(-1 : 배경으로 사용된 영화 제외, -2 : 배경으로 미사용된 영화 제외)
      const maxIndex = Math.floor(totalDatas / offset) - 1; // 페이징 총 수(-1 : 페이징 배열은 0부터)
      setIsBack(false);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  // 슬라이더 감소
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return; // slider를 2번 클릭하면 1번 클릭했을 때 새로 들어오는 slider가 사라지려하여 방지하기 위함
      toggleLeaving();
      const totalDatas =
        title === "movies_nowPlaying" || title === "tvs_airing"
          ? data.results.length - 1
          : data.results.length - 2; // 이미지 총 개수(-1 : 배경으로 사용된 영화 제외)
      const maxIndex = Math.floor(totalDatas / offset) - 1; // 페이징 총 수(-1 : 페이징 배열은 0부터)
      setIsBack(true);
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const onBoxClicked = (id: number | undefined, name: string) => {
    clickedName(name);
    const split = name.split("_")[0];
    if (split === "movies") {
      history.push(`/movies/${id}`); // useHistory를 통해 경로 생성
    } else if (split === "tvs") {
      history.push(`/tv/${id}`);
    }
  };

  return (
    <SliderLine>
      <SliderButton className="arrow" onClick={decreaseIndex} isFirst={true}>
        &lt;
      </SliderButton>
      <SliderButton className="arrow" onClick={increaseIndex} isLast={true}>
        &gt;
      </SliderButton>
      {/* initial={false} : 페이지 첫 로드 할 때 slider 미적용 */}
      {/* onExitComplete : exit 작업 끝난 후 진행 시켜줌.   */}
      <AnimatePresence
        initial={false}
        custom={isBack}
        onExitComplete={toggleLeaving}
      >
        <Row
          variants={rowVariants}
          custom={isBack}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }} // tween은 중간 단계에서 부드럽게 변화하는 애니메이션을 적용한 것.
          key={index}
        >
          {/* slice를 2개 사용하게 되면, 첫 번째로 사용된 slice는 아예 제외하고 두 번째 slice부터 다시 계산한다. */}
          {/* 아래같이 작성한 이유는 1번째 영화는 배경으로 사용중이기 때문에 보여줄 필요가 없다. */}

          {slicedData.map((datas) => (
            <Box
              key={datas.id}
              variants={boxVariants}
              onClick={() => onBoxClicked(datas.id, title)}
              layoutId={`${title}-${datas.id}`}
              initial="normal"
              whileHover="hover"
              transition={{ type: "tween" }}
              bgPhoto={makeImagePath(datas.backdrop_path, "w500")}
            >
              <Info variants={infoVariants}>
                <h4>{datas.title ? datas.title : datas.name}</h4>
              </Info>
            </Box>
          ))}
        </Row>
      </AnimatePresence>
    </SliderLine>
  );
}
export default Slider;
