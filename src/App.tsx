import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";

// path가 /인 Route를 맨 아래에 두는 이유는 Link를 통해 경로에 접속할 때 /는 무조건 포함되기 때문에
// / 경로 컴포넌트가 먼저 접속되어 방지하기 위함이다.
function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Switch>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        {/* 배열을 통해 복수경로를 생성할 수 있다. */}
        <Route path={["/", "/movies/:movieId"]}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
