import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

axios.defaults.withCredentials = true;

export default function VotePost({ accessToken }) {
  const [votePostinfo, setVotePostinfo] = useState({
    voteTitle: "",
    category: "",
    voteOption1: "",
    voteOption2: "",
  });

  const votePostinputHandler = (key) => (e) => {
    setVotePostinfo({ ...votePostinfo, [key]: e.target.value });
  };

  const history = useHistory();

  const votePostHandler = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/vote`,
        {
          voteTitle: votePostinfo.voteTitle,
          category: votePostinfo.category,
          voteOption1: votePostinfo.voteOption1,
          voteOption2: votePostinfo.voteOption2,
        },
        {
          header: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        {
          "Content-Type": "application/json",
        }
      )
      .then((res) => {
        history.push("/home");
      })
      .catch((err) => {
        if (err.status === 404 || err.status === 403) {
          history.push("/login");
        } else {
          console.log(err);
        }
      });
  };
  return (
    <div className="p-4">
      <div className="text-2xl">투표 게시하기</div>
      <form className="p-1 w-full max-w-xl">
        <div className="flex items-center border-b border-teal-500 py-2">
          <div className="flex-shrink-0 bg-teal-500 border-teal-500 text-sm border-4 text-white py-1 px-2 rounded">
            질문을 입력해 주세요
          </div>
          <input
            onChange={votePostinputHandler("voteTitle")}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="오늘 뭐 먹지?"
          />
        </div>
      </form>
      <form className="p-1 w-full max-w-xl">
        <span className="bg-teal-500 border-teal-500 text-sm border-4 text-white py-1 px-2 rounded">
          옵션을 입력해 주세요
        </span>
        <div className="flex items-center border-b border-teal-500 py-2">
          <input
            onChange={votePostinputHandler("voteOption1")}
            className=" boappearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="짜장면"
          />
        </div>
        <div className="flex items-center border-b border-teal-500 py-2">
          <input
            onChange={votePostinputHandler("voteOption2")}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="짬뽕"
          />
        </div>
      </form>
      <div className="py-3">
        <span className="bg-teal-500 border-teal-500 text-sm border-4 text-white py-1 px-2 rounded">
          카테고리을 선택해 주세요
        </span>
        <div className="flex items-center border-teal-500 py-3">
          <button
            onClick={votePostinputHandler("category")}
            value="일상"
            className="flex-shrink-0 hover:bg-teal-500 border-teal-500 hover:border-teal-500 hover:text-white text-sm border-4 py-1 px-2 rounded"
            type="button"
          >
            일상
          </button>
          <button
            onClick={votePostinputHandler("category")}
            value="연애"
            className="m-1 flex-shrink-0 hover:bg-teal-500 border-teal-500 hover:border-teal-500 hover:text-white text-sm border-4 py-1 px-2 rounded"
            type="button"
          >
            연애
          </button>
          <button
            onClick={votePostinputHandler("category")}
            value="음식"
            className="m-1 flex-shrink-0 hover:bg-teal-500 border-teal-500 hover:border-teal-500 hover:text-white text-sm border-4 py-1 px-2 rounded"
            type="button"
          >
            음식
          </button>
          <button
            onClick={votePostinputHandler("category")}
            value="여행"
            className="m-1 flex-shrink-0 hover:bg-teal-500 border-teal-500 hover:border-teal-500 hover:text-white text-sm border-4 py-1 px-2 rounded"
            type="button"
          >
            여행
          </button>
          <button
            onClick={votePostinputHandler("category")}
            value="패션"
            className="m-1 flex-shrink-0 hover:bg-teal-500 border-teal-500 hover:border-teal-500 hover:text-white text-sm border-4 py-1 px-2 rounded"
            type="button"
          >
            패션
          </button>
          <button
            onClick={votePostinputHandler("category")}
            value="기타"
            className="m-1 flex-shrink-0 hover:bg-teal-500 border-teal-500 hover:border-teal-500 hover:text-white text-sm border-4 py-1 px-2 rounded"
            type="button"
          >
            기타
          </button>
        </div>
      </div>
      <div>
        <span className="pr-10">
          <button
            onClick={() => history.goBack()}
            className="flex-shrink-0 hover:bg-teal-500 bg-teal-500 border-teal-500 hover:border-teal-500 hover:text-black text-white text-sm border-4 py-1 px-2 rounded"
            type="button"
          >
            취소하기
          </button>
        </span>
        <span className="pl-10">
          <button
            onClick={votePostHandler}
            className="flex-shrink-0 hover:bg-teal-500 bg-teal-500 border-teal-500 hover:border-teal-500 hover:text-black text-white text-sm border-4 py-1 px-2 rounded"
            type="button"
          >
            게시하기
          </button>
        </span>
      </div>
    </div>
  );
}
