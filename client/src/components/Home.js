import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setVoteFilter } from "../slice/voteFilterSlice";
import { displayModal } from "../slice/modalSlice";
import Modal from "./Modal";

axios.defaults.withCredentials = true;

export default function Home({ category }) {
  const dispatch = useDispatch();

  const modal = useSelector((state) => state.modal.value);
  const accessToken = useSelector((state) => state.accessToken.value);
  const isLogin = useSelector((state) => state.isLogin.value);
  const postModal = useSelector((state) => state.postModal.value);
  const [voteInfo, setVoteInfo] = useState([]);
  const voteFilter = useSelector((state) => state.voteFilter.value);
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [categoryId, setCategoryId] = useState(1);

  const voteFilterClass = (filter) => {
    if (voteFilter === "participated" && filter === "latest" && !isLogin)
      return "cursor-pointer py-4 font-medium text-[#222222] border-b-[2px] border-VsGreen";
    else if (voteFilter === "posted" && filter === "latest" && !isLogin)
      return "cursor-pointer py-4 font-medium text-[#222222] border-b-[2px] border-VsGreen";
    else if (
      voteFilter === "participated" &&
      filter === "participated" &&
      !isLogin
    )
      return "cursor-pointer py-4 font-medium text-graytypo";
    else if (voteFilter === "posted" && filter === "posted" && !isLogin)
      return "cursor-pointer py-4 font-medium text-graytypo";
    else if (voteFilter === filter)
      return "cursor-pointer py-4 font-medium text-[#222222] border-b-[2px] border-VsGreen";
    return "py-4 font-medium text-graytypo cursor-pointer";
  };
  const categoryFilterClass = (filter) => {
    if (categoryFilter === filter)
      return "shrink-0 px-3 rounded-[19px] mr-[11px] bg-VSYellow h-8 text-center text-[14px] text-black";
    return "shrink-0 px-3 border rounded-[19px] border-[#A7A7A7] mr-[11px] h-8 text-center text-[14px] text-graytypo";
  };

  const history = useHistory();

  const voteListHandler = async () => {
    // CASE1 전체 리스트 불러오기 (categoryId: "1", voteFilter: "latest")
    if (categoryId === 1 && voteFilter === "latest") {
      await axios
        .get(`${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/vote`, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => setVoteInfo(res.data))
        .catch(console.log);
    }
    // CASE2 카테고리만 필터했을 경우 (categoryId: "${id}", voteFilter: "latest")
    else if (categoryId !== 1 && voteFilter === "latest") {
      await axios
        .get(
          `${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/vote?categoryId=${categoryId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => setVoteInfo(res.data))
        .catch(console.log);
    }

    // CASE3 내가 참여한 투표이면서 전체인 경우 (type: "participated") participatedVoteList
    else if (categoryId === 1 && voteFilter === "participated") {
      await axios
        .get(
          `${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/user/vote?type=participated`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .then((res) => setVoteInfo(res.data.participatedVoteList))
        .catch((err) => {
          console.log(err);
          if (err.response.status === 403 || err.response.status === 404) {
            dispatch(displayModal());
            dispatch(setVoteFilter("latest"));
          } else if (err.response.status === 401) {
            history.push("/login");
          } else {
            console.log(err);
          }
        });
    }

    // CASE4 내가 참여한 투표이면서 카테고리가 있는 경우 (type: "participated", categoryId=${categoryId} )
    else if (categoryId !== 1 && voteFilter === "participated") {
      await axios
        .get(
          `${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/user/vote?type=participated&categoryId=${categoryId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .then((res) => setVoteInfo(res.data.participatedVoteList))
        .catch((err) => {
          if (err.response.status === 403 || err.response.status === 404) {
            dispatch(displayModal());
            dispatch(setVoteFilter("latest"));
          } else if (err.response.status === 401) {
            history.push("/login");
          } else {
            console.log(err);
          }
        });
    }

    // CASE5 내가 만든 투표이면서 전체인 경우 (type: "posted", categoryId x )
    else if (categoryId === 1 && voteFilter === "posted") {
      await axios
        .get(
          `${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/user/vote?type=posted`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .then((res) => setVoteInfo(res.data.createdVoteList))
        .catch((err) => {
          if (err.response.status === 403 || err.response.status === 404) {
            dispatch(displayModal());
            dispatch(setVoteFilter("latest"));
          } else if (err.response.status === 401) {
            history.push("/login");
          } else {
            console.log(err);
          }
        });
    }

    // CASE6 내가 만든 투표이면서 카테고리가 있는 경우 (type: "posted", categoryId=%{categoryId})
    else if (categoryId !== 1 && voteFilter === "posted") {
      await axios
        .get(
          `${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/user/vote?type=posted&categoryId=${categoryId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .then((res) => {
          setVoteInfo(res.data.createdVoteList);
        })
        .catch((err) => {
          if (err.response.status === 403 || err.response.status === 404) {
            dispatch(displayModal());
            dispatch(setVoteFilter("latest"));
          } else if (err.response.status === 401) {
            history.push("/login");
          } else {
            console.log(err);
          }
        });
    }
  };

  useEffect(() => {
    voteListHandler();
  }, [categoryId, voteFilter]);

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => {
          if (isLogin) history.push("/votepost");
          else dispatch(displayModal());
        }}
        className="sticky z-50 top-[86%] ml-[77.5%] md:top-[90%] md:ml-[82%] h-0 cursor-pointer"
      >
        <div className="shadow-3xl bg-VsGreen w-[60px] h-[60px] rounded-full flex items-center justify-center">
          <img className="w-8 h-8" src="/images/add-icon.png" alt="" />
        </div>
      </div>

      <div className="relative">
        <div className="sticky top-0 bg-white z-30">
          <div className="bg-white z-20 flex py-[19px] px-5 justify-between border-b-[1px] border-[#f2f2f2]">
            <img
              className="w-[131.39px] h-5 mt-[0.5px]"
              src="/images/vslogo-new.png"
              alt="voteslug-logo"
            />
            <img
              className="cursor-pointer"
              onClick={() => {
                if (isLogin) history.push("/mypage");
                else dispatch(displayModal());
              }}
              src="/images/mypage.svg"
              alt="mypage"
            />
          </div>
          <div className="sticky  pl-5 pr-[14px] py-2">
            <div className="font-normal text-[14px] text-black mb-2">
              카테고리를 선택하세요
            </div>
            <div className="flex flex-nowrap overflow-x-auto no-scrollbar">
              {category.map((ct) => {
                return (
                  <button
                    onClick={() => {
                      setCategoryFilter(ct.title);
                      setCategoryId(ct.id);
                    }}
                    className={categoryFilterClass(ct.title)}
                    key={ct.id}
                    value={ct.title}
                  >
                    {ct.title}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="h-1 w-full bg-[#f2f2f2]"></div>
          <div>
            <div className="grid grid-cols-3">
              <button
                onClick={() => {
                  dispatch(setVoteFilter("latest"));
                }}
                className={voteFilterClass("latest")}
              >
                최신 투표
              </button>
              <button
                onClick={() => {
                  dispatch(setVoteFilter("participated"));
                }}
                className={voteFilterClass("participated")}
              >
                내가 참여한 투표
              </button>
              <button
                onClick={() => dispatch(setVoteFilter("posted"))}
                className={voteFilterClass("posted")}
              >
                내가 만든 투표
              </button>
            </div>
          </div>
        </div>

        {/* Post Modal */}
        <div
          className={
            postModal
              ? "px-[10px] sticky z-50 top-[85%] h-0 cursor-pointer transition-all duration-[3000ms] translate-y-0"
              : "px-[10px] sticky z-50 top-[85%] h-0 cursor-pointer duration-1000 translate-y-16 opacity-0"
          }
        >
          <div className="bg-VSYellow w-full h-12 rounded-[8px] justify-between flex items-center text-base font-bold text-[#222222] shadow-3xl">
            <div className="w-full text-center">투표가 생성되었습니다!</div>
          </div>
        </div>
        {/* Post Modal */}

        {/* <div
          onClick={() => {
            if (isLogin) history.push("/votepost");
            else dispatch(displayModal());
          }}
          className="sticky z-50 top-[90%] ml-[80%] h-0 cursor-pointer"
        >
          <div className="shadow-3xl bg-VsGreen w-[50px] h-[50px] rounded-full flex items-center justify-center">
            <img className="w-8 h-8" src="/images/add-icon.png" alt="" />
          </div>
        </div> */}

        {voteFilter === "latest" ? (
          <div className="text-center text-[14px] pt-6 font-normal">
            Tip : 투표에 참여하면 결과를 확인할 수 있어요!
          </div>
        ) : null}
        {voteInfo ? (
          <div className="pt-6 px-5 pb-10">
            {voteInfo
              .sort((a, b) => b.id - a.id)
              .map((vote, idx) => (
                <div
                  onClick={() => history.push(`/vote/${vote.id}`)}
                  key={idx}
                  className="cursor-pointer hover:border-2 hover:border-VsGreen py-4 px-4 border border-[#a7a7a7] rounded-[12px] bg-transparent overflow-x-auto mb-10 last:mb-0"
                >
                  <div className="flex justify-between mb-4">
                    <div className="flex text-graytypo text-[14px] font-normal">
                      {vote.Category?.categoryTitle === "음식" && (
                        <div className="mr-3">🍔</div>
                      )}
                      {vote.Category?.categoryTitle === "연애" && (
                        <div className="mr-3">💌</div>
                      )}
                      {vote.Category?.categoryTitle === "여행" && (
                        <div className="mr-3">🛩</div>
                      )}
                      {vote.Category?.categoryTitle === "일상" && (
                        <div className="mr-3">😌</div>
                      )}
                      {vote.Category?.categoryTitle === "패션" && (
                        <div className="mr-3">👬</div>
                      )}
                      {vote.Category?.categoryTitle === "etc" && (
                        <div className="mr-3">🎸</div>
                      )}
                      {vote.Category?.categoryTitle}
                    </div>
                    <div className="flex items-center">
                      <div className="pb-[0.5px]">
                        <img
                          className="w-4 h-4 mr-[5px] opacity-50"
                          src="/images/view-icon.png"
                          alt=""
                        />
                      </div>

                      <div className="text-graytypo text-[14px] font-normal">
                        {vote.voteOption1Count + vote.voteOption2Count}
                      </div>
                    </div>
                  </div>
                  <div className="text-base font-normal text-black mb-4">
                    {vote.voteTitle}
                  </div>
                  <div className="flex justify-center z-20">
                    <div className="break-words text-center h-[120px] flex justify-center items-center w-full p-2 border border-[#d3d3d3] rounded-[8px] relative mr-4">
                      {vote.voteOption1}
                      <div className="absolute z-10 right-[-25px] top-[44px] rounded-full w-8 h-8 bg-VsRed flex justify-center items-center text-[14px] text-white font-normal border-[2px] border-white">
                        VS
                      </div>
                    </div>
                    <div className="break-words text-center h-[120px] flex justify-center items-center w-full p-2 border border-[#d3d3d3] rounded-[8px] z-0">
                      {vote.voteOption2}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="pt-[180%]"></div>
        )}

        {modal && (
          <Modal
            type="login"
            title="로그인이 필요합니다."
            left="닫기"
            right="로그인"
          />
        )}
      </div>
    </>
  );
}
