import styled from "styled-components";

const Father = styled.div`
  display: flex;
`;

// props를 생성하여 배경색 지정을 return에서 할 수 있게 전달할 수 있다.
const Box = styled.div`
  background-color: ${(props) => props.bgcolor};
  width: 100px;
  height: 100px;
`;

// Box styled를 그대로 가져와 원형이라는 추가 속성만 만들 수 있다.
const Circle = styled(Box)`
  border-radius: 50px;
`;

function App() {
  return (
    <Father>
      <Box bgcolor="teal" />
      <Circle bgcolor="tomato" />
    </Father>
  );
}

export default App;
