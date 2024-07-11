import styled, { keyframes } from "styled-components";

const Wrapper = styled.div`
  display: flex;
`;

const rotationAnimation = keyframes`
0% {
  transform:rotate(0deg);
  border-radius: 0px;
}
50% {
  transform:rotate(360deg);
  border-radius: 100px;
}

100% {
  transform:rotate(0deg);
  border-radius: 0px;
}
`;

// flex : 지정된 요소의 자식 요소들을 flex로 만듦.
// justify-content : flex 안에서 자식 요소들을 가로축 방향으로 정렬한다.
// align-items : flex 안에서 자식 요소들을 세로축 방향으로 정렬한다.

// linear : 애니메이션 속도가 일정하게 유지되도록 설정.
// infinite : 애니메이션이 무한반복되도록 설정.
const Box = styled.div`
  height: 200px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: tomato;
  animation: ${rotationAnimation} 1s linear infinite;

  /* 여기서 '&'는 부모 요소를 의미함. 따라서 span:hover와 동일 */
  span {
    font-size: 36px;
    &:hover {
      font-size: 50px;
    }
    &:active {
      opacity: 0;
    }
  }
`;

function App() {
  return (
    <Wrapper>
      <Box>
        <span>😀</span>
      </Box>
    </Wrapper>
  );
}

export default App;
