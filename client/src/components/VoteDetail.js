import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { displayModal } from "../slice/modalSlice";
import Modal from "./Modal";
import Comment from "./Comment";

axios.defaults.withCredentials = true;

export default function VoteDetail() {
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal.value);
  const [modalProps, setModalProps] = useState({
    title: "",
    left: "",
    right: "",
    type: "",
  });

  const isLogin = useSelector((state) => state.isLogin.value);
  const accessToken = useSelector((state) => state.accessToken.value);
  const voteFilter = useSelector((state) => state.voteFilter.value);

  const [deleteAction, setDeleteAction] = useState(false);
  const [voteData, setVoteData] = useState({});
  const [postData, setPostData] = useState({});
  const [participation, setParticipation] = useState(false);
  const [option1Percent, setOption1Percent] = useState(null);
  const [option2Percent, setOption2Percent] = useState(null);

  const history = useHistory();
  const { voteId } = useParams();

  useEffect(() => {
    // 로그인 된 유저가 자기가 생성한 투표의 삭제버튼을 누른 경우 경우 모달
    if (isLogin && deleteAction)
      setModalProps({
        ...modalProps,
        type: "delete",
        title: "정말 해당 투표를 삭제하시겠습니까?",
        left: "닫기",
      });
    // 로그인이 된 유저가 참여를 한 상태인데, 투표 항목을 선택할 경우 모달
    else if (isLogin && participation && !deleteAction)
      setModalProps({
        ...modalProps,
        type: "alreadyVote",
        title: "이미 참여한 투표입니다.",
        left: null,
        right: "확인",
      });
    // 로그인이 된 유저가 참여를 하지 않은 상태에서, 투표에 참여하고 싶은 경우
    else if (isLogin && !participation)
      setModalProps({
        ...modalProps,
        type: "participateVote",
        title: "해당 항목에 투표하시겠습니까?",
        left: "닫기",
        right: "확인",
      });
    // 로그인이 되지 않은 경우
    else if (!isLogin && !participation)
      setModalProps({
        ...modalProps,
        type: "login",
        title: "투표에 참여하려면 로그인이 필요합니다.",
        left: "닫기",
        right: "로그인",
      });
  }, [isLogin, participation, deleteAction]);

  const voteInfoHandler = async () => {
    if (isLogin) {
      await axios
        .get(`${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/vote/${voteId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((result) => {
          setVoteData(result.data.selectedVote);
          setParticipation(result.data.participation);
          if (
            result.data.voteOption1Count === 0 &&
            result.data.voteOption2Count === 0
          ) {
            setOption1Percent(0);
            setOption2Percent(0);
          } else {
            setOption1Percent(
              Math.round(
                (100 * result.data.selectedVote.voteOption1Count) /
                  (result.data.selectedVote.voteOption1Count +
                    result.data.selectedVote.voteOption2Count)
              )
            );
            setOption2Percent(
              Math.round(
                (100 * result.data.selectedVote.voteOption2Count) /
                  (result.data.selectedVote.voteOption1Count +
                    result.data.selectedVote.voteOption2Count)
              )
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      await axios
        .get(`${process.env.REACT_APP_SERVER_EC2_ENDPOINT}/vote/${voteId}`)
        .then((result) => {
          setVoteData(result.data.selectedVote);
          if (
            result.data.voteOption1Count === 0 &&
            result.data.voteOption2Count === 0
          ) {
            setOption1Percent(0);
            setOption2Percent(0);
          } else {
            setOption1Percent(
              Math.round(
                (100 * result.data.selectedVote.voteOption1Count) /
                  (result.data.selectedVote.voteOption1Count +
                    result.data.selectedVote.voteOption2Count)
              )
            );
            setOption2Percent(
              Math.round(
                (100 * result.data.selectedVote.voteOption2Count) /
                  (result.data.selectedVote.voteOption1Count +
                    result.data.selectedVote.voteOption2Count)
              )
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    voteInfoHandler();
  }, [participation, isLogin]);

  const postDataHandler = (key) => () => {
    setPostData({ voteId: voteId, [key]: true });
    dispatch(displayModal());
  };

  const winnerClass = (optionPercent, right) => {
    if (participation && right) {
      if (optionPercent > 50) {
        return "bg-VsGreenLight break-all h-[120px] flex justify-center items-center w-full p-2 border border-[#d3d3d3] rounded-[8px] relative cursor-pointer";
      } else if (optionPercent === 50) {
        return "bg-VsyellowLight break-all h-[120px] flex justify-center items-center w-full p-2 border border-[#d3d3d3] rounded-[8px] relative cursor-pointer";
      } else {
        return "break-all h-[120px] flex justify-center items-center w-full p-2 border border-[#d3d3d3] rounded-[8px] relative cursor-pointer";
      }
    }

    if (participation && !right) {
      if (optionPercent > 50) {
        return "bg-VsGreenLight break-all h-[120px] flex justify-center items-center w-full p-2 border border-[#d3d3d3] rounded-[8px] relative mr-4 cursor-pointer";
      } else if (optionPercent === 50) {
        return "bg-VsyellowLight break-all h-[120px] flex justify-center items-center w-full p-2 border border-[#d3d3d3] rounded-[8px] relative mr-4 cursor-pointer";
      } else {
        return "break-all h-[120px] flex justify-center items-center w-full p-2 border border-[#d3d3d3] rounded-[8px] relative mr-4 cursor-pointer";
      }
    }

    if (right)
      return "hover:border-2 hover:border-VsGreen break-all h-[120px] flex justify-center items-center w-full p-2 border border-[#d3d3d3] rounded-[8px] relative cursor-pointer";
    return "hover:border-2 hover:border-VsGreen break-all h-[120px] flex justify-center items-center w-full p-2 border border-[#d3d3d3] rounded-[8px] relative mr-4 cursor-pointer";
  };

  return (
    <>
      <div>
        <div className="flex py-[19px] px-5 border-b-[4px] border-[#f2f2f2]">
          <img
            onClick={() => {
              history.goBack();
            }}
            src="/images/go-back-arrow.svg"
            className="mr-2 cursor-pointer"
            alt="gobackarrow"
          ></img>
          <img
            className="w-[131.39px] h-5 mt-[0.5px]"
            src="/images/vslogo-new.png"
            alt="voteslug-logo"
            onClick={() => history.push("/home")}
          />
        </div>
        <div className="pt-6">
          <div className="flex items-center justify-between px-5 text-xl font-medium text-[#222222]">
            <div>투표상세보기</div>
            {voteFilter === "posted" ? (
              <div
                onClick={() => {
                  dispatch(displayModal());
                  setDeleteAction(true);
                }}
              >
                <img
                  className="w-6 cursor-pointer"
                  src="/images/delete-vote-icon.png"
                  alt=""
                />
              </div>
            ) : null}
          </div>
          <div className="pt-6 px-5 mb-2">
            <div className="py-4 px-4 border border-[#a7a7a7] rounded-[12px] bg-transparent">
              <div className="flex justify-between mb-4">
                <div className="text-graytypo text-[14px] font-normal flex">
                  {voteData.Category?.categoryTitle === "음식" && (
                    <div className="mr-3">🍔</div>
                  )}
                  {voteData.Category?.categoryTitle === "연애" && (
                    <div className="mr-3">💌</div>
                  )}
                  {voteData.Category?.categoryTitle === "여행" && (
                    <div className="mr-3">🛩</div>
                  )}
                  {voteData.Category?.categoryTitle === "일상" && (
                    <div className="mr-3">😌</div>
                  )}
                  {voteData.Category?.categoryTitle === "패션" && (
                    <div className="mr-3">👬</div>
                  )}
                  {voteData.Category?.categoryTitle === "etc" && (
                    <div className="mr-3">🎸</div>
                  )}
                  {voteData.Category?.categoryTitle}
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
                    {voteData.voteOption1Count + voteData.voteOption2Count}
                  </div>
                </div>
              </div>

              <div className="text-base font-normal text-black mb-4">
                {voteData.voteTitle}
              </div>

              <div className="flex justify-center z-20">
                <button
                  value={"voteOption1"}
                  onClick={postDataHandler("voteOption1")}
                  className={winnerClass(option1Percent)}
                >
                  <div className="flex flex-col items-center justify-center break-words">
                    <div className="mb-2">{voteData.voteOption1}</div>
                    {participation && <div>{option1Percent}%</div>}
                  </div>

                  <div className="absolute z-10 right-[-25px] top-[44px] rounded-full w-8 h-8 bg-VsRed flex justify-center items-center text-[14px] text-white font-normal border-[2px] border-white">
                    VS
                  </div>
                </button>
                <button
                  value={"voteOption2"}
                  onClick={postDataHandler("voteOption2")}
                  className={winnerClass(option2Percent, "right")}
                >
                  <div className="flex flex-col items-center justify-center break-words">
                    <div className="mb-2">{voteData.voteOption2}</div>
                    {participation && <div>{option2Percent}%</div>}
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end pr-5 font-medium text-xs text-[#a7a7a7] mb-10">
            항목 눌러서 투표에 참여
          </div>

          <Comment voteId={voteId} />
        </div>

        {modal && (
          <Modal
            type={modalProps.type}
            title={modalProps.title}
            left={modalProps.left}
            right={modalProps.right}
            postData={postData}
            setVoteData={setVoteData}
            setDeleteAction={setDeleteAction}
            setParticipation={setParticipation}
          />
        )}
      </div>
    </>
  );
}
