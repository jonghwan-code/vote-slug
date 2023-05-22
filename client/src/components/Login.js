import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAccessToken } from "../slice/accessTokenSlice";
import { loginHandler } from "../slice/isLoginSlice";

export default function Login() {
  const dispatch = useDispatch();
  // 이메일, 비밀번호 확인
  const history = useHistory();
  const isLogin = useSelector((state) => state.isLogin.value);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  // 오류 메시지 상태 저장
  const [emailMessage, setEmailMessage] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  // 유효성 검사
  const [isEmail, setIsEmail] = useState(false);

  useEffect(() => {
    if (isLogin) history.replace("/home");
  }, [isLogin]);

  const loginButtonClass = () => {
    if (userInfo.email.length && userInfo.password.length && isEmail)
      return "bg-VsGreen rounded-[24px] w-full h-11 text-xl cursor-pointer font-medium";
    else
      return "bg-VsGreenLight text-[#D3D3D3] rounded-[24px] w-full h-11 text-xl cursor-pointer font-medium";
  };

  const emailInputClass = () => {
    if (isEmail && userInfo.email.length)
      return "w-full h-[48px] rounded-[8px] border-2 border-VsGreen pl-4 text-sm font-normal focus:outline-none focus:border-2 focus:border-VsGreen";
    else if (!isEmail && userInfo.email.length)
      return "w-full h-[48px] rounded-[8px] border-2 border-VsRed pl-4 text-sm font-normal focus:outline-none focus:border-2";
    else if (!isEmail && !userInfo.email.length)
      return "w-full h-[48px] rounded-[8px] border border-[#D3D3D3] pl-4 text-sm font-normal focus:outline-none focus:border-2 focus:border-VsGreen";
    else
      return "w-full h-[48px] rounded-[8px] border border-[#D3D3D3] pl-4 text-sm font-normal focus:outline-none focus:border-2 focus:border-VsGreen";
  };

  const passwordInputClass = () => {
    if (loginErrorMessage === "비밀번호가 틀렸습니다.")
      return "w-full h-[48px] rounded-[8px] border border-VsRed pl-4 text-sm font-normal focus:border-2 focus:border-VsGreen focus:outline-none";
    else
      return "w-full h-[48px] rounded-[8px] border border-[#d3d3d3] pl-4 text-sm font-normal focus:border-VsGreen focus:border-2 focus:outline-none";
  };

  // const emailHandler = (e) => {
  //   const emailRegex =
  //     /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  //   setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  //   if (!emailRegex.test(userInfo.email)) {
  //     setEmailMessage("이메일 형식을 확인해주세요");
  //     setIsEmail(false);
  //   } else {
  //     setEmailMessage("올바른 이메일 형식입니다");
  //     setIsEmail(true);
  //   }
  // };

  const emailHandler = (e) => {
    const emailRegex =
      /([\w-.]+)@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.)|(([\w-]+.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$/;
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value.replace(/^\s+|\s+$/gm, ""),
    });
    if (!emailRegex.test(userInfo.email)) {
      setEmailMessage("이메일 형식을 확인해주세요");
      setIsEmail(false);
    } else {
      setEmailMessage("올바른 이메일 형식입니다");
      setIsEmail(true);
    }
  };

  const passwordHandler = (e) => {
    setLoginErrorMessage("");
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
        dispatch(loginHandler());
        dispatch(getAccessToken(res.data.accessToken));
        history.replace("/home");
      })
      .catch((err) => {
        console.log(err.response.data);
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
    <>
      <div className="pt-10 pb-[17px]">
        {/* <div className="w-full h-[120px] bg-[#8BCDFE] mb-10"></div> */}
        <div className="px-[55px] py-8 mb-10">
          <img
            className="w-full"
            src="/images/vslogo-new.png"
            alt="voteslug-logo"
          />
        </div>
        <div className="px-5 mb-4">
          <div className="flex flex-col pb-[18px] mb-2">
            <span className="pl-4 mb-2 text-base font-medium">이메일</span>
            <div className="relative">
              <input
                autoComplete="off"
                onChange={emailHandler}
                value={userInfo.email}
                name="email"
                type="text"
                className={emailInputClass()}
                placeholder="이메일을 입력하세요."
              ></input>
              {userInfo.email.length > 0 ? (
                <img
                  onClick={() => {
                    setUserInfo({ ...userInfo, email: "" });
                    setLoginErrorMessage("");
                  }}
                  className="cursor-pointer absolute right-3 top-3.5 z-10"
                  src="/images/delete.svg"
                  alt=""
                />
              ) : null}
              {loginErrorMessage ===
              "존재하지 않는 이메일입니다." ? null : userInfo.email.length ? (
                <span
                  className={
                    isEmail
                      ? "pl-2 text-sm text-VsGreen"
                      : "pl-2 text-sm text-VsRed"
                  }
                >
                  {emailMessage}
                </span>
              ) : null}
              {loginErrorMessage === "존재하지 않는 이메일입니다." ? (
                <div className="pt-1 pl-2 text-sm text-VsRed">
                  {loginErrorMessage}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col pb-[18px] mb-4">
            <span className="pl-4 mb-2 text-base font-medium">비밀번호</span>
            <div className="flex relative">
              <input
                autoComplete="off"
                onChange={passwordHandler}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    loginRequestHandler();
                  }
                }}
                value={userInfo.password}
                name="password"
                type="password"
                className={passwordInputClass()}
                placeholder="비밀번호를 입력하세요."
              ></input>
              {userInfo.password.length > 0 ? (
                <img
                  onClick={() => {
                    setUserInfo({ ...userInfo, password: "" });
                    setLoginErrorMessage("");
                  }}
                  className="cursor-pointer absolute right-3 top-3.5 z-10"
                  src="/images/delete.svg"
                  alt=""
                />
              ) : null}
            </div>
            {loginErrorMessage === "비밀번호가 틀렸습니다." ? (
              <div className="pt-2 pl-2 text-sm text-VsRed">
                {loginErrorMessage}
              </div>
            ) : null}
          </div>
          <button
            disabled={!(userInfo.email && userInfo.password)}
            // 로그인 버튼 비활성화 추가
            onClick={loginRequestHandler}
            className={loginButtonClass()}
          >
            로그인
          </button>
        </div>
        <div className="flex justify-center py-[11px] mb-[58px]">
          <button
            onClick={() => {
              history.push("/home");
            }}
            className="text-sm text-[#7A7A7A] font-medium"
          >
            로그인 없이 둘러보기
          </button>
        </div>
        <div className="flex justify-center py-[11px]">
          <span className="text-[#7a7a7a] font-normal text-sm">
            보트슬러그 계정이 없으신가요？
          </span>
          <button
            onClick={() => {
              history.push("/signup");
            }}
            className="text-[#7CE0AE] font-medium text-sm"
          >
            가입하기
          </button>
        </div>
      </div>
    </>
  );
}
