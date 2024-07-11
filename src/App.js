import styled from "styled-components";

const Father = styled.div`
  display: flex;
`;

const Box = styled.div`
  background-color: teal;
  width: 100;
  height: 100;
`;

function App() {
  return (
    <Father>
      <Box />
      <Box />
    </Father>
  );
}

export default App;
