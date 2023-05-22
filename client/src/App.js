import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home";
import VotePost from "./components/VotePost";
import Login from "./components/Login";
import VoteDetail from "./components/VoteDetail";
import SignUp from "./components/SignUp";
import Mypage from "./components/Mypage";
import Nickname from "./components/Nickname";
import Password from "./components/Password";
import CommentPost from "./components/CommentPost";
import Welcome from "./components/Welcome";
import { useSelector } from "react-redux";
import Token from "./components/Token";

function App() {
  const category = [
    { title: "전체", id: 1 },
    { title: "연애", id: 2 },
    { title: "음식", id: 3 },
    { title: "여행", id: 4 },
    { title: "일상", id: 5 },
    { title: "패션", id: 6 },
    { title: "etc", id: 7 },
  ];

  const isLogin = useSelector((state) => state.isLogin.value);
  return (
    <>
      <BrowserRouter>
        <Token />
        <Switch>
          <Route exact path="/">
            {isLogin ? <Redirect to="/home" /> : <Redirect to="/login" />}
          </Route>
          <Route path="/home">
            <Home category={category} />
          </Route>
          <Route path="/vote/:voteId">
            <VoteDetail />
          </Route>
          <Route path="/votepost">
            <VotePost />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/mypage">
            <Mypage />
          </Route>
          <Route path="/nickname">
            <Nickname />
          </Route>
          <Route path="/password">
            <Password />
          </Route>
          <Route path="/welcome">
            <Welcome />
          </Route>
          <Route path="/comment/:voteId">
            <CommentPost />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
