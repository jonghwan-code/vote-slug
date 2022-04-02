import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login({ loginHandler, getAccessToken }) {
  // 이메일, 비밀번호 확인
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  console.log(userInfo);
  // 오류 메시지 상태 저장
  const [emailMessage, setEmailMessage] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  // 유효성 검사
  const [isEmail, setIsEmail] = useState(false);

  const emailHandler = (e) => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    if (!emailRegex.test(userInfo.email)) {
      setEmailMessage("이메일 형식이 틀렸습니다");
      setIsEmail(false);
    } else {
      setEmailMessage("올바른 이메일 형식입니다");
      setIsEmail(true);
    }
  };

  const passwordHandler = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const loginRequestHandler = async () => {
    const { email, password } = userInfo;
    await axios
      .post(
        `${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/user/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((res) => {
        loginHandler();
        getAccessToken(res.data.accessToken);
      })
      .catch((err) => {
        if (err.response.data.message === "wrong email") {
          setLoginErrorMessage("존재하지 않는 이메일입니다.");
        } else if (err.response.data.message === "wrong password") {
          setLoginErrorMessage("비밀번호가 틀렸습니다.");
        } else {
          console.log("Error", err.message);
        }
      });
  };

  return (
    <div>
      <h1>login</h1>
      <div>
        <form className="p-1 w-full max-w-xl">
          <div className="flex items-center border-b border-teal-500 py-2">
            <div className="flex-shrink-0 border-teal-500 text-sm border-2 text-indigo-500 py-1 px-2 rounded">
              e-mail
            </div>
            <input
              className="border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight"
              type="text"
              placeholder="이메일을　입력해주세요"
              name="email"
              value={userInfo.email}
              onChange={emailHandler}
            />
            {userInfo.email.length > 0 && (
              <span
                className={
                  isEmail ? "text-sm text-indigo-500" : "text-sm text-red-400"
                }
              >
                {emailMessage}
              </span>
            )}
          </div>
        </form>
      </div>
      <div>
        <form className="p-1 w-full max-w-xl">
          <div className="flex items-center border-b border-teal-500 py-2">
            <div className="flex-shrink-0 border-teal-500 text-sm border-2 text-indigo-500 py-1 px-2 rounded">
              password
            </div>
            <input
              className="border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight"
              type="password"
              placeholder="비밀번호을　입력해주세요"
              name="password"
              value={userInfo.password}
              onChange={passwordHandler}
            />
          </div>
        </form>
      </div>
      <div>
        <button
          className="block bg-teal-400 hover:bg-teal-600 text-white uppercase text-m mx-auto p-4 rounded"
          onClick={loginRequestHandler}
        >
          Log in
        </button>
      </div>
      <div>
        <button>Tour</button>
      </div>
      <div>
        <Link to="/signup">Sign up</Link>
      </div>
      <div className="text-sm text-red-400">{loginErrorMessage}</div>
    </div>
  );
}
