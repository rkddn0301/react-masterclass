import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { start } from "repl";
import { useEffect, useRef, useState } from "react";

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: linear-gradient(135deg, rgb(238, 0, 153), rgb(221, 0, 238));
`;

const Box = styled(motion.div)`
  width: 400px;
  height: 400px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

const Circle = styled(motion.div)`
  background-color: #00a5ff;
  height: 100px;
  width: 100px;

  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

function App() {
  const [clicked, setClicked] = useState(false);
  const toggleClicked = () => setClicked((prev) => !prev);
  return (
    <Wrapper onClick={toggleClicked}>
      {/* 상위 컴포넌트에 initial, animate를 지정하고 요소명이 같을 경우 하위가 상속받을 수 있다.  */}

      {/* layout : 컴포넌트 안에 넣는 prop으로 컴포넌트가 동작되는 기능을 애니메이션 효과로 넣어준다. */}
      {/* layoutId : 컴포넌트 안에 넣는 prop으로 id가 같으면 서로가 동작되는 기능을 애니메이션 효과로 넣어준다. */}
      <Box>
        {!clicked ? (
          <Circle layoutId="circle" style={{ borderRadius: "50px" }} />
        ) : null}
      </Box>
      <Box>
        {clicked ? (
          <Circle layoutId="circle" style={{ borderRadius: "0px" }} />
        ) : null}
      </Box>
    </Wrapper>
  );
}

export default App;
