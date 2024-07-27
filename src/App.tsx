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
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;

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
  hover: { scale: 1.5, rotateZ: 90 },
  click: { scale: 1, borderRadius: "100px" },
  drag: { backgroundColor: "rgb(46, 204, 113)", transition: { duration: 10 } },
};

function App() {
  return (
    <Wrapper>
      {/* 상위 컴포넌트에 initial, animate를 지정하고 요소명이 같을 경우 하위가 상속받을 수 있다.  */}
      <Box
        variants={boxVariants}
        drag
        whileHover="hover"
        whileDrag="drag"
        whileTap="click"
      />
    </Wrapper>
  );
}

export default App;
