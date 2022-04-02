import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  useHistory,
  Redirect,
} from "react-router-dom";
import Home from "./components/Home";
import VotePost from "./components/VotePost";
import Login from "./components/Login";
import VoteDetail from "./components/VoteDetail";
import SignUp from "./components/SignUp";
import Mypage from "./components/Mypage";
import axios from "axios";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [accessToken, setAccessToken] = useState("");

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
  const categoryList = [
    {
      title: "sample",
      id: "1",
    },
    {
      title: "love",
      id: "2",
    },
    {
      title: "food",
      id: "3",
    },
    {
      title: "fashion",
      id: "4",
    },
    {
      title: "trip",
      id: "5",
    },
    {
      title: "other",
      id: "6",
    },
  ];

  const history = useHistory();

  const accessTokenHandler = (token) => {
    setAccessToken(token);
  };

  const handleLogout = async () => {
    await axios
      .post(`${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/user/logout`)
      .then((res) => {
        setAccessToken("");
        setIsLogin(false);
        history.push("/login");
      });
  };

  const loginHandler = () => {
    setIsLogin(true);
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {/* <Home /> */}
          {isLogin ? <Redirect to="/home" /> : <Redirect to="/login" />}
        </Route>
        <Route path="/home">
          <Home
            categoryList={categoryList}
            handleLogout={handleLogout}
            accessToken={accessToken}
          />
        </Route>
        <Route
          path="/vote/:id"
          render={() => <VoteDetail dummyData={dummyData} />}
        />
        <Route path="/votepost">
          <VotePost accessToken={accessToken} />
        </Route>
        <Route path="/login">
          <Login
            getAccessToken={accessTokenHandler}
            loginHandler={loginHandler}
          />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/mypage">
          <Mypage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
