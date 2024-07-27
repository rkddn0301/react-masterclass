import styled from "styled-components";
import { delay, motion, useMotionValue, useTransform } from "framer-motion";
import { start } from "repl";
import { useEffect, useRef } from "react";

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BiggerBox = styled(motion.div)`
  width: 600px;
  height: 600px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 40px;
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
  hover: { rotateZ: 90 },
  click: { borderRadius: "100px" },
  drag: { backgroundColor: "rgb(46, 204, 113)", transition: { duration: 10 } },
};

function App() {
  const x = useMotionValue(0);
  const potato = useTransform(x, [-800, 0, 800], [2, 1, 0.1]);

  useEffect(() => {
    potato.onChange(() => console.log(potato.get()));
  }, [x]);

  return (
    <Wrapper>
      {/* 상위 컴포넌트에 initial, animate를 지정하고 요소명이 같을 경우 하위가 상속받을 수 있다.  */}
      <Box style={{ x, scale: potato }} drag="x" dragSnapToOrigin />
    </Wrapper>
  );
}

export default App;
