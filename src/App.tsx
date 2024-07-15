import styled, { keyframes } from "styled-components";
import Circle from "./Circle";

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.backgroundColor};
`;

const Title = styled.h1`
  color: ${(props) => props.theme.textColor};
`;

function App() {
  return (
    <div>
      <Circle bgcolor="teal" bordercolor="black" />
      <Circle bgcolor="tomato" text="yes I can!" />
    </div>
  );
}

export default App;
