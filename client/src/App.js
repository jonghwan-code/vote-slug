import { useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home";
import VotePost from "./components/VotePost";
import Login from "./components/Login";
import VoteDetail from "./components/VoteDetail";

function App() {
  const dummyData = [
    {
      id: 1,
      voteTite: "코로나 끝나면 당장 어디로",
      voteOption1: "푸켓",
      voteOption2: "런던",
      voteOption1Count: 131,
      voteOption2Count: 100,
      nickname: "peter",
      category: "여행",
      createdAt: 2000,
    },
    {
      id: 2,
      voteTite: "오늘 점심?",
      voteOption1: "샌드위치",
      voteOption2: "쌀국수",
      voteOption1Count: 131,
      voteOption2Count: 100,
      nickname: "wanda",
      category: "일상",
      createdAt: 2002,
    },
  ];
  const [isLogin, setIsLogin] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  const accessTokenHandler = (token) => {
    setAccessToken(token);
  };

  const loginHandler = () => {
    setIsLogin(true);
  };
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {isLogin ? <Redirect to="/home" /> : <Redirect to="/login" />}
        </Route>
        <Route path="/home">
          <Home dummyData={dummyData} accessToken={accessToken} />
        </Route>
        <Route path="/votepost">
          <VotePost accessToken={accessToken} />
        </Route>
        <Route path="/login">
          <Login
            getAccessToken={accessTokenHandler}
            loginHandler={loginHandler}
          />
        </Route>
        <Route path="/votedetail">
          <VoteDetail accessToken={accessToken} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
