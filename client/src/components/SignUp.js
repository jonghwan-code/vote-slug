import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

axios.defaults.withCredentials = true;

export default function SignUp() {
  //이름, 이메일, 비밀번호, 비밀번호 확인
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  //오류메시지 상태저장
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");
  const [genderMessage, setGenderMessage] = useState("");
  const [dobMessage, setDobMessage] = useState();
  const [signupMessage, setSignupMessage] = useState("");

  // 유효성 검사
  const [isNickname, setIsNickname] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isGender, setIsGender] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [isDob, setIsDob] = useState(false);

  const history = useHistory();

  const onSubmit = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/user`,
        {
          email,
          password,
          nickname,
          gender,
          dob,
        },
        {
          "Content-Type": "application/json",
        }
      )
      .then((res) => {
        history.push("/");
      })
      .catch((err) => {
        console.log(err.response);
        if (err.response.message === "email overlap") {
          setSignupMessage("이미 가입된 이메일입니다");
        } else if (err.response.message === "nickname overlap") {
          setSignupMessage("이미 사용 중인 닉네임입니다");
        } else {
          console.log(err);
        }
      });
  };

  const onChangeNickname = (e) => {
    setNickname(e.target.value);

    if (nickname === undefined) {
      setNicknameMessage("닉네임을 입력해주세요");
      setIsNickname(false);
    } else {
      setNicknameMessage("닉네임을 입력하셨습니다");
      setIsNickname(true);
    }
  };

  const onChangeEmail = (e) => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailCurrent = e.target.value;
    setEmail(emailCurrent);

    if (!emailRegex.test(emailCurrent)) {
      setEmailMessage("이메일 형식이 틀렸습니다");
      setIsEmail(false);
    } else {
      setEmailMessage("올바른 이메일 형식입니다");
      setIsEmail(true);
    }
  };

  const onChangePassword = (e) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    const passwordCurrent = e.target.value;
    setPassword(passwordCurrent);

    if (!passwordRegex.test(passwordCurrent)) {
      setPasswordMessage(
        "숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요"
      );
      setIsPassword(false);
    } else {
      setPasswordMessage("안전한 비밀번호입니다");
      setIsPassword(true);
    }
  };

  const onChangePasswordConfirm = (e) => {
    const passwordConfirmCurrent = e.target.value;
    setPasswordConfirm(passwordConfirmCurrent);

    if (password === passwordConfirmCurrent) {
      setPasswordConfirmMessage("비밀번호가 일치합니다");
      setIsPasswordConfirm(true);
    } else {
      setPasswordConfirmMessage("비밀번호가 일치하지 않습니다");
      setIsPasswordConfirm(false);
    }
  };

  const onChangeGender = (e) => {
    const genderCurrent = e.target.value;
    setGender(genderCurrent);
    if (gender === null) {
      setGenderMessage("");
      setIsGender(false);
    } else {
      setGenderMessage("성별을 선택하셨습니다");
      setIsGender(true);
    }
  };

  const onChangeDob = (e) => {
    const dobCurrent = e.target.value;
    setDob(dobCurrent);
    if (dob === undefined) {
      setDobMessage("");
      setIsDob(false);
    } else {
      setDobMessage("생년월일을 선택하셨습니다");
      setIsDob(true);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="w-1/2 bg-white rounded shadow-2xl p-8 m-4">
        <h1 className="block w-full text-center text-gray-800 text-2xl font-bold mb-6">
          SignUp
        </h1>

        <div>
          <div className="flex flex-col mb-4">
            <label
              className="mb-2 font-bold text-lg text-gray-900"
              htmlFor="nickname"
            >
              Nickname
            </label>
            <input
              onChange={onChangeNickname}
              className="border py-2 px-3 text-grey-800"
              type="text"
              name="nickname"
            />
            {nickname.length > 0 && (
              <span className="text-sm text-indigo-500">{nicknameMessage}</span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label
              className="mb-2 font-bold text-lg text-gray-900"
              htmlFor="email"
            >
              e-mail
            </label>
            <input
              onChange={onChangeEmail}
              className="border py-2 px-3 text-grey-800"
              type="text"
              name="email"
            />
            {email.length > 0 && (
              <span
                className={
                  isEmail ? "text-sm text-indigo-500" : "text-sm text-red-400"
                }
              >
                {emailMessage}
              </span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label
              className="mb-2 font-bold text-lg text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <input
              onChange={onChangePassword}
              className="border py-2 px-3 text-grey-800"
              type="password"
              name="password1"
            />
            {password.length > 0 && (
              <span
                className={
                  isPassword
                    ? "text-sm text-indigo-500"
                    : "text-sm text-red-400"
                }
              >
                {passwordMessage}
              </span>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label
              className="mb-2 font-bold text-lg text-gray-900"
              htmlFor="password_confirm"
            >
              Password Confirm
            </label>
            <input
              onChange={onChangePasswordConfirm}
              className="border py-2 px-3 text-grey-800"
              type="password"
              name="password2"
            />
            {passwordConfirm.length > 0 && (
              <span
                className={
                  isPasswordConfirm
                    ? "text-sm text-indigo-500"
                    : "text-sm text-red-400"
                }
              >
                {passwordConfirmMessage}
              </span>
            )}
          </div>

          <div className="flex flex-col mb-4">
            <label
              className="mb-2 font-bold text-lg text-gray-900"
              htmlFor="gender"
            >
              Gender
            </label>
            <div className="relative">
              <select
                onChange={onChangeGender}
                className="block appearance-none w-full bg-white border border-gray-200 text-gray-900 py-2 px-3 focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option>{null}</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non binary</option>
              </select>
              {gender.length > 0 && (
                <span className="text-sm text-indigo-500">{genderMessage}</span>
              )}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <label
              className="mb-2 font-bold text-lg text-gray-900"
              htmlFor="dateOfBirth"
            >
              DOB
            </label>
            <input
              onChange={onChangeDob}
              className="border py-2 px-3 text-grey-800"
              type="date"
              name="dateOfBirth"
              placeholder="yyyymmdd"
            />
            {dob.length > 0 && (
              <span className="text-sm text-indigo-500">{dobMessage}</span>
            )}
          </div>
          <button
            disabled={
              !(
                isNickname &&
                isEmail &&
                isPassword &&
                isPasswordConfirm &&
                isGender &&
                isDob
              )
            }
            onClick={onSubmit}
            className="block bg-teal-400 hover:bg-teal-600 text-white uppercase text-lg mx-auto p-4 rounded"
          >
            Confirm
          </button>
          <div className="text-red">{signupMessage}</div>
        </div>
      </div>
    </div>
  );
}
