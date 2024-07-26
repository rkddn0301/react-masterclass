import styled from "styled-components";
import { delay, motion } from "framer-motion";
import { start } from "repl";

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 40px;
  display: grid;
  grid-template-columns: repeat(
    2,
    1fr
  ); // 내부 요소를 2열로 나눠 1fr씩 균등하게 공간을 차지한다는 뜻
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

const Circle = styled(motion.div)`
  background-color: white;
  height: 70px;
  width: 70px;
  place-self: center; // 요소 가운데 정렬
  border-radius: 35px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

const boxVariants = {
  start: { opacity: 0, scale: 0.5 },
  end: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.5,
      staggerChildren: 0.2, // children(자식variant)에 있는 요소를 각각 따로 실행
    },
  },
};

const circleVariants = {
  start: { opacity: 0, y: 10 },
  end: {
    opacity: 1,
    y: 0,
  },
};

function App() {
  return (
    <Wrapper>
      {/* 상위 컴포넌트에 initial, animate를 지정하고 요소명이 같을 경우 하위가 상속받을 수 있다.  */}
      <Box variants={boxVariants} initial="start" animate="end">
        <Circle variants={circleVariants} />
        <Circle variants={circleVariants} />
        <Circle variants={circleVariants} />
        <Circle variants={circleVariants} />
      </Box>
    </Wrapper>
  );
}

export default App;
