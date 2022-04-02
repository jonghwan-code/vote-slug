import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Home({ categoryList, accessToken, handleLogout }) {
  const [voteInfo, setVoteInfo] = useState([]);

  const voteListHandler = async () => {
    await axios
      .get(`${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/vote`, {
        header: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setVoteInfo(res.data);
      });
  };

  useEffect(() => {
    voteListHandler();
  }, []);

  const history = useHistory();
  const categoryHandler = async (e) => {
    const queryString = e.target.value;
    console.log(queryString);
    await axios
      .get(
        `${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/vote`,
        {
          params: { category: queryString },
        },
        {
          header: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        setVoteInfo(res.data);
      })
      .catch((err) => {
        if (err.response.status === 403 || err.response.status === 404) {
          history.push("/login");
        } else {
          console.log(err);
        }
      });
  };

  const voteUserMadeHandler = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/user/vote`,
        {
          params: { type: "posted" },
        },
        {
          header: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        setVoteInfo(res.data);
      })
      .catch((err) => {
        if (err.response.status === 403 || err.response.status === 404) {
          history.push("/login");
        } else {
          console.log(err);
        }
      });
  };

  const voteUserPartHandler = async () => {
    await axios
      .get(
        `${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/user/vote`,
        {
          params: { type: "participated" },
        },
        {
          header: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        setVoteInfo(res.data);
      })
      .catch((err) => {
        if (err.response.status === 403 || err.response.status === 404) {
          history.push("/login");
        } else {
          console.log(err);
        }
      });
  };

  return (
    <div>
      <div className="p-3">
        <div>Category</div>
        <div className="grid grid-cols-3">
          {categoryList.map((category) => (
            <button
              key={category.id}
              value={category.title}
              onClick={categoryHandler}
              className="m-1 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
            >
              {category.title}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2">
          <button
            onClick={voteUserMadeHandler}
            className="m-1 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
          >
            내가 게시한 투표
          </button>
          <button
            onClick={voteUserPartHandler}
            className="m-1 bg-transparent hover:bg-blue-500 text-blue-700 hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
          >
            내가 참여한 투표
          </button>
        </div>
      </div>
      <div className="p-3">
        {voteInfo
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((voteInfo) => (
            // onclick 이벤트로 해당 voteInfo.id에 해당하는 투표를 투표 상세페이지에서 보여준다
            <Link
              to={{
                pathname: `/vote/${voteInfo.id}`,
                state: { voteInfo: voteInfo },
              }}
              key={voteInfo.id}
              className="transition-all"
              // voteInfo={voteInfo}
            >
              <div className="my-4 border-solid border-2 border-red-700">
                <div>
                  <div>{voteInfo.Category.categoryTitle}</div>
                  <div className="text-right">
                    {voteInfo.voteOption1Count + voteInfo.voteOption2Count}
                  </div>
                </div>
                <div>
                  {voteInfo.voteTite}
                  <div>
                    <button className="m-1 p-1 border-solid border-2 border-yellow-400">
                      {voteInfo.voteOption1}
                    </button>
                    <span>vs</span>
                    <button className="m-1 p-1 border-solid border-2 border-yellow-400">
                      {voteInfo.voteOption2}
                    </button>
                  </div>
                  <div>{voteInfo.User.nickname}</div>
                </div>
              </div>
            </Link>
          ))}
      </div>
      <div>
        <menu>
          <div className="grid grid-cols-3 gap-2">
            <Link to={`/mypage`} className="bg-green-300 m-1 p-1 text-center">
              <button>프로필 보기</button>
            </Link>
            <Link
              to={`/votepost`}
              className="bg-yellow-200 m-1 p-1 text-center"
            >
              <button>투표 게시하기</button>
            </Link>
            <button
              onClick={handleLogout}
              type="button"
              className="bg-blue-300 m-1 p-1"
            >
              로그아웃
            </button>
          </div>
        </menu>
      </div>
    </div>
  );
}
