import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Peer from "peerjs";
import Draggable from "react-draggable";
import {
  ChevronLeft,
  BookOpen,
  UserPlus,
  Code2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Star,
  Send,
  CheckCircle2,
} from "lucide-react";

import { VideoPanel } from "./VideoPanel";
import { ChatPanel } from "./ChatPanel";
import { CodeEditorArea } from "./CodeEditorArea";
import { QuestionLibrary } from "./QuestionLibrary";

const StarRating = ({ label, value, onChange }) => (
  <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700 mb-3">
    <span className="font-medium text-slate-300">{label}</span>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className={`hover:scale-110 transition-transform focus:outline-none ${star <= value ? "text-yellow-400" : "text-slate-600 hover:text-slate-500"}`}
        >
          <Star size={24} fill={star <= value ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  </div>
);

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const peerInstance = useRef(null);
  const draggableRef = useRef(null);
  const myStreamRef = useRef(null);

  const storedUsername = localStorage.getItem("username");
  const storedRole = localStorage.getItem("role");
  const [needsIdentity, setNeedsIdentity] = useState(
    !storedUsername || !storedRole,
  );
  const [tempName, setTempName] = useState("");
  const [tempRole, setTempRole] = useState("Candidate");

  const [interviewPhase, setInterviewPhase] = useState("greeting");
  const [roomData, setRoomData] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("Ready...");
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(!needsIdentity);

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const [feedback, setFeedback] = useState({
    problemSolving: 0,
    codeQuality: 0,
    communication: 0,
    overall: 0,
    notes: "",
  });

  const [isWaitingForApproval, setIsWaitingForApproval] = useState(
    storedRole === "Candidate",
  );
  const [waitingCandidate, setWaitingCandidate] = useState(null);
  const [isOtherPersonHere, setIsOtherPersonHere] = useState(false);

  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [remoteCameraOn, setRemoteCameraOn] = useState(true);

  const containerRef = useRef(null);
  const [questionWidth, setQuestionWidth] = useState(300);
  const [chatWidth, setChatWidth] = useState(320);
  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);

  const username = storedUsername;
  const userRole = storedRole;

  const syncStateRef = useRef({});
  useEffect(() => {
    syncStateRef.current = {
      phase: interviewPhase,
      question: activeQuestion,
      code,
      language,
      remoteCameraOn: isCameraOn,
      output,
      testResults,
    };
  }, [
    interviewPhase,
    activeQuestion,
    code,
    language,
    isCameraOn,
    output,
    testResults,
  ]);

  const stopMediaTracks = () => {
    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }
    if (peerInstance.current) {
      peerInstance.current.destroy();
    }
  };

  useEffect(() => {
    if (needsIdentity) return;

    if (socketRef.current) return;

    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });
    socketRef.current = socket;
    const load = async () => {
      try {
        const res = await axios.get(`/api/v1/interviews/${roomId}`, {
          withCredentials: true,
        });
        setRoomData(res.data.data);
        if (res.data.data.questions?.length > 0) {
          setActiveQuestion(res.data.data.questions[0]);
          setCode(
            res.data.data.questions[0].startingCode || "// Start coding...",
          );
        }
        if (userRole === "Interviewer") {
          const qRes = await axios.get("/api/v1/questions", {
            withCredentials: true,
          });
          setAllQuestions(qRes.data.data);
        }
      } catch (e) {
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [roomId, needsIdentity]);

  useEffect(() => {
    if (needsIdentity) return;
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      if (userRole === "Candidate")
        socket.emit("request-join", { roomId, username });
    });
    socket.on("join-request", (data) => {
      if (userRole === "Interviewer") setWaitingCandidate(data);
    });
    socket.on("join-granted", () => setIsWaitingForApproval(false));
    socket.on("receive-code", (c) => setCode(c));
    socket.on("receive-chat", (m) => setChatHistory((p) => [...p, m]));
    socket.on("phase-changed", (p) => setInterviewPhase(p));
    socket.on("remote-hardware-toggled", ({ type, isOn }) => {
      if (type === "camera") setRemoteCameraOn(isOn);
    });
    socket.on("language-changed", (l) => setLanguage(l));

    socket.on("code-running", () =>
      setOutput("⏳ Code is executing in the cloud..."),
    );
    socket.on("receive-output", (newOutput) => setOutput(newOutput));
    socket.on("receive-test-results", (results) => setTestResults(results));
    socket.on("interview-ended", () => {
      stopMediaTracks();
      if (userRole === "Interviewer") setInterviewPhase("feedback");
      else setInterviewPhase("thankyou");
    });

    socket.on("user-disconnected", () => {
      setIsOtherPersonHere(false);
      setRemoteStream(null);
      if (peerInstance.current?.connections) {
        Object.values(peerInstance.current.connections).forEach((cArr) =>
          cArr.forEach((c) => c.close()),
        );
      }
    });

    socket.on("receive-sync", (data) => {
      setIsOtherPersonHere(true);
      if (data.phase) {
        setInterviewPhase((prev) => {
          if (prev === "coding" && data.phase === "greeting") return "coding";
          return data.phase;
        });
      }
      if (data.question) setActiveQuestion(data.question);
      if (data.code) setCode(data.code);
      if (data.language) setLanguage(data.language);
      if (data.output) setOutput(data.output);
      if (data.testResults) setTestResults(data.testResults);
      if (data.remoteCameraOn !== undefined)
        setRemoteCameraOn(data.remoteCameraOn);
    });

    socket.on("question-changed", (q) => {
      setActiveQuestion(q);
      setCode(q.startingCode || "// Start...");
    });

    return () => socket.disconnect();
  }, [roomId, needsIdentity]);

  useEffect(() => {
    let knockInterval;
    if (isWaitingForApproval && socketRef.current && userRole === "Candidate") {
      knockInterval = setInterval(() => {
        socketRef.current.emit("request-join", { roomId, username });
      }, 2000);
    }
    return () => {
      if (knockInterval) clearInterval(knockInterval);
    };
  }, [isWaitingForApproval, roomId, username, userRole]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      if (isDraggingLeft.current) {
        const newWidth = e.clientX - containerRect.left;
        if (newWidth > 200 && newWidth < containerRect.width * 0.4)
          setQuestionWidth(newWidth);
      } else if (isDraggingRight.current) {
        const newWidth = containerRect.right - e.clientX;
        if (newWidth > 250 && newWidth < containerRect.width * 0.4)
          setChatWidth(newWidth);
      }
    };
    const handleMouseUp = () => {
      if (isDraggingLeft.current || isDraggingRight.current) {
        isDraggingLeft.current = false;
        isDraggingRight.current = false;
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const getSafeStream = () => {
    const safeStream = new MediaStream();
    const currentVideo = myStreamRef.current?.getVideoTracks()[0];
    if (currentVideo && currentVideo.readyState === "live") {
      safeStream.addTrack(currentVideo);
    } else {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      safeStream.addTrack(canvas.captureStream(1).getVideoTracks()[0]);
    }
    const currentAudio = myStreamRef.current?.getAudioTracks()[0];
    if (currentAudio && currentAudio.readyState === "live") {
      safeStream.addTrack(currentAudio);
    } else {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        safeStream.addTrack(
          ctx.createMediaStreamDestination().stream.getAudioTracks()[0],
        );
      } catch (e) {
        console.warn("Audio dummy block");
      }
    }
    return safeStream;
  };

  useEffect(() => {
    if (needsIdentity || isWaitingForApproval) return;
    let localStream = null;
    let actualCameraState = true;

    const initPeer = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMyStream(localStream);
        myStreamRef.current = localStream;
      } catch {
        setIsCameraOn(false);
        setIsMicOn(false);
        actualCameraState = false;
      }
      const peer = new Peer({
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
            { urls: "stun:stun.cloudflare.com:3478" },
          ],
        },
      });
      peerInstance.current = peer;

      peer.on("open", (id) => {
        socketRef.current.emit("join-room", { roomId, peerId: id });
        socketRef.current.emit("sync-state", {
          roomId,
          remoteCameraOn: actualCameraState,
        });
      });
      peer.on("call", (call) => {
        call.answer(getSafeStream());
        call.on("stream", (s) => setRemoteStream(s));
      });
    };

    initPeer();

    const handleConn = (pid) => {
      setIsOtherPersonHere(true);
      socketRef.current.emit("sync-state", { roomId, ...syncStateRef.current });
      if (peerInstance.current?.connections) {
        Object.keys(peerInstance.current.connections).forEach((key) => {
          if (key !== pid) {
            peerInstance.current.connections[key].forEach((c) => c.close());
            delete peerInstance.current.connections[key];
          }
        });
      }
      if (peerInstance.current) {
        const call = peerInstance.current.call(pid, getSafeStream());
        call?.on("stream", (s) => setRemoteStream(s));
      }
    };

    socketRef.current.on("user-connected", handleConn);

    return () => {
      stopMediaTracks();
      socketRef.current?.off("user-connected", handleConn);
    };
  }, [isWaitingForApproval]);

  const handleSetCode = (val) => {
    setCode(val);
    socketRef.current.emit("code-change", { roomId, code: val });
  };
  const handleSendChat = (message) => {
    const msgData = { sender: username, message };
    setChatHistory((p) => [...p, msgData]);
    socketRef.current.emit("send-chat", { roomId, ...msgData });
  };

  const replaceMediaTrack = (kind, newTrack) => {
    if (!peerInstance.current?.connections) return;
    Object.values(peerInstance.current.connections).forEach((conns) => {
      conns.forEach((conn) => {
        if (conn.peerConnection) {
          const sender = conn.peerConnection
            .getSenders()
            .find((s) => s.track?.kind === kind);
          if (sender)
            sender
              .replaceTrack(newTrack)
              .catch((e) => console.log("Track swap ignored"));
        }
      });
    });
  };

  const toggleCamera = async () => {
    if (!myStream) return;
    if (isCameraOn) {
      myStream.getVideoTracks().forEach((t) => t.stop());
      setIsCameraOn(false);
      socketRef.current.emit("toggle-hardware", {
        roomId,
        type: "camera",
        isOn: false,
      });
    } else {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        const track = s.getVideoTracks()[0];
        const newStream = new MediaStream([
          ...myStream.getAudioTracks(),
          track,
        ]);
        setMyStream(newStream);
        myStreamRef.current = newStream;
        replaceMediaTrack("video", track);
        setIsCameraOn(true);
        socketRef.current.emit("toggle-hardware", {
          roomId,
          type: "camera",
          isOn: true,
        });
      } catch {
        alert("Camera permission denied.");
      }
    }
  };

  const toggleMic = async () => {
    if (!myStream) return;
    if (isMicOn) {
      myStream.getAudioTracks().forEach((t) => t.stop());
      setIsMicOn(false);
    } else {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        const track = s.getAudioTracks()[0];
        const newStream = new MediaStream([
          ...myStream.getVideoTracks(),
          track,
        ]);
        setMyStream(newStream);
        myStreamRef.current = newStream;
        replaceMediaTrack("audio", track);
        setIsMicOn(true);
      } catch {
        alert("Mic permission denied.");
      }
    }
  };

  if (needsIdentity)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-96 border border-slate-700">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
            Join Room
          </h2>
          <div className="space-y-4">
            <input
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 outline-none focus:border-blue-500"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Your Name"
            />
            <select
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 outline-none focus:border-blue-500 cursor-pointer"
              value={tempRole}
              onChange={(e) => setTempRole(e.target.value)}
            >
              <option value="Candidate">I am the Candidate</option>
              <option value="Interviewer">I am the Interviewer</option>
            </select>
            <button
              className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold transition shadow-lg mt-4"
              onClick={() => {
                if (!tempName) return;
                localStorage.setItem("username", tempName);
                localStorage.setItem("role", tempRole);
                window.location.reload();
              }}
            >
              Enter Session
            </button>
          </div>
        </div>
      </div>
    );

  if (isWaitingForApproval)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-bold mb-2">Knocking on the door...</h2>
          <p className="text-slate-400 text-sm">
            Please wait for the interviewer to admit you.
          </p>
        </div>
      </div>
    );

  if (isLoading || !roomData)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-blue-500 font-bold">
        Loading Interview Data...
      </div>
    );

  if (interviewPhase === "thankyou")
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-900">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Thank You!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Your interview has successfully concluded and your code has been
            submitted. We appreciate your time and effort today.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition active:scale-95"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );

  if (interviewPhase === "feedback")
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans text-slate-100">
        <div className="max-w-xl w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8 animate-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-white mb-2">
            Interview Completed
          </h2>
          <p className="text-slate-400 mb-8">
            Please provide your evaluation for {roomData.candidateName}.
          </p>
          <div className="space-y-4 mb-8">
            <StarRating
              label="Problem Solving"
              value={feedback.problemSolving}
              onChange={(v) =>
                setFeedback((f) => ({ ...f, problemSolving: v }))
              }
            />
            <StarRating
              label="Code Quality"
              value={feedback.codeQuality}
              onChange={(v) => setFeedback((f) => ({ ...f, codeQuality: v }))}
            />
            <StarRating
              label="Communication"
              value={feedback.communication}
              onChange={(v) => setFeedback((f) => ({ ...f, communication: v }))}
            />
            <StarRating
              label="Overall Rating"
              value={feedback.overall}
              onChange={(v) => setFeedback((f) => ({ ...f, overall: v }))}
            />
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Detailed Notes
              </label>
              <textarea
                value={feedback.notes}
                onChange={(e) =>
                  setFeedback((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Provide specific feedback on the candidate's performance..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-200 outline-none focus:border-blue-500 min-h-[120px] resize-y"
              />
            </div>
          </div>
          <button
            onClick={async () => {
              try {
                await axios.patch(
                  `/api/v1/interviews/${roomId}/feedback`,
                  feedback,
                  { withCredentials: true },
                );
                navigate("/dashboard");
              } catch {
                alert("Failed to submit feedback.");
              }
            }}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition active:scale-95"
          >
            <Send size={18} /> Submit Evaluation
          </button>
        </div>
      </div>
    );

  return (
    <div
      className={`flex h-screen flex-col ${interviewPhase === "greeting" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {userRole === "Interviewer" && waitingCandidate && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md border border-blue-500/50 p-4 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.3)] flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <UserPlus className="text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium leading-none mb-1">
                  Candidate waiting
                </p>
                <p className="text-lg font-bold text-white leading-none">
                  {waitingCandidate.username}
                </p>
              </div>
            </div>
            <button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95 whitespace-nowrap"
              onClick={() => {
                socketRef.current.emit("grant-join", {
                  targetSocketId: waitingCandidate.socketId,
                  username: waitingCandidate.username,
                  roomId,
                });
                setWaitingCandidate(null);
              }}
            >
              Admit Now
            </button>
          </div>
        </div>
      )}

      <header
        className={`flex h-16 items-center justify-between px-6 border-b ${interviewPhase === "greeting" ? "border-slate-800" : "bg-white border-slate-200"}`}
      >
        <div className="flex items-center gap-4">
          <ChevronLeft
            className="cursor-pointer hover:opacity-70 transition"
            onClick={() => navigate("/dashboard")}
          />
          <h1 className="font-bold">Interview with {roomData.candidateName}</h1>
        </div>
        <div className="flex items-center gap-4">
          {userRole === "Interviewer" && (
            <button
              onClick={() => setIsLibraryOpen(true)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition px-3 py-1.5 rounded-lg text-slate-700 border font-medium text-sm"
            >
              <BookOpen size={16} /> Question Bank
            </button>
          )}
          <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-slate-100 border text-slate-600 font-medium">
            <div
              className={`h-2 w-2 rounded-full ${isOtherPersonHere ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
            />
            {isOtherPersonHere ? "Live Session" : "Waiting..."}
          </div>
        </div>
      </header>

      {interviewPhase === "greeting" ? (
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <VideoPanel
            myStream={myStream}
            remoteStream={remoteStream}
            isCameraOn={isCameraOn}
            isMicOn={isMicOn}
            remoteCameraOn={remoteCameraOn}
            isOtherPersonHere={isOtherPersonHere}
            userRole={userRole}
            toggleMic={toggleMic}
            toggleCamera={toggleCamera}
          />
          <div className="w-full max-w-6xl bg-slate-800/80 p-6 rounded-2xl flex justify-between items-center border border-slate-700 shadow-2xl backdrop-blur-sm">
            <div className="flex gap-4">
              <button
                onClick={toggleMic}
                className={`p-4 rounded-full transition ${isMicOn ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-500 text-white hover:bg-red-600"}`}
              >
                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button
                onClick={toggleCamera}
                className={`p-4 rounded-full transition ${isCameraOn ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-500 text-white hover:bg-red-600"}`}
              >
                {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
            </div>
            {userRole === "Interviewer" ? (
              <button
                onClick={() => {
                  setInterviewPhase("coding");
                  socketRef.current.emit("change-phase", {
                    roomId,
                    phase: "coding",
                  });
                }}
                className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-bold flex gap-2 transition shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                <Code2 /> Start Technical Assessment
              </button>
            ) : (
              <div className="text-slate-400 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>{" "}
                Waiting for Interviewer to start...
              </div>
            )}
          </div>
        </main>
      ) : (
        <main
          ref={containerRef}
          className="flex flex-1 overflow-hidden relative"
        >
          <div
            style={{ width: `${questionWidth}px` }}
            className="p-6 bg-white overflow-y-auto custom-scrollbar flex-shrink-0"
          >
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                activeQuestion?.difficulty === "Easy"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : activeQuestion?.difficulty === "Medium"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {activeQuestion?.difficulty || "Standard"}
            </span>

            <h2 className="text-xl font-bold mt-4 mb-4 text-slate-800">
              {activeQuestion?.title}
            </h2>
            <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
              {activeQuestion?.description}
            </div>
          </div>
          <div
            className="w-1.5 bg-slate-200 hover:bg-blue-500/50 cursor-col-resize transition-colors flex-shrink-0 z-10"
            onMouseDown={(e) => {
              e.preventDefault();
              isDraggingLeft.current = true;
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
            }}
          />

          <div className="flex-1 flex flex-col min-w-[250px] overflow-hidden">
            <CodeEditorArea
              code={code}
              setCode={handleSetCode}
              language={language}
              setLanguage={setLanguage}
              output={output}
              isRunning={isRunning}
              userRole={userRole}
              isPracticeMode={false}
              activeQuestion={activeQuestion}
              setOutput={setOutput}
              setIsRunning={setIsRunning}
              roomId={roomId}
              testResults={testResults}
              setTestResults={setTestResults}
              onSave={async () => {
                try {
                  await axios.post(
                    `/api/v1/interviews/${roomId}/submit`,
                    { questionId: activeQuestion._id, finalCode: code },
                    { withCredentials: true },
                  );
                  alert("✅ Answer saved successfully!");
                } catch {
                  alert("Failed to save answer.");
                }
              }}
              onEnd={async () => {
                if (
                  !window.confirm("Are you sure you want to end the interview?")
                )
                  return;
                socketRef.current.emit("end-interview", { roomId });
                stopMediaTracks();
                if (userRole === "Interviewer") setInterviewPhase("feedback");
                else setInterviewPhase("thankyou");
              }}
              onSocketEmit={(ev, d) =>
                socketRef.current.emit(ev, { roomId, ...d })
              }
            />
          </div>

          <div
            className="w-1.5 bg-slate-200 hover:bg-blue-500/50 cursor-col-resize transition-colors flex-shrink-0 z-10"
            onMouseDown={(e) => {
              e.preventDefault();
              isDraggingRight.current = true;
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
            }}
          />

          <div
            style={{ width: `${chatWidth}px` }}
            className="flex-shrink-0 bg-white"
          >
            <ChatPanel
              chatHistory={chatHistory}
              username={username}
              onSendMessage={handleSendChat}
            />
          </div>

          <Draggable bounds="body" nodeRef={draggableRef}>
            <div
              ref={draggableRef}
              className="fixed bottom-6 right-8 w-72 bg-slate-900/95 p-3 rounded-2xl border border-slate-700 cursor-move shadow-2xl backdrop-blur-md z-50"
            >
              <VideoPanel
                layout="coding"
                myStream={myStream}
                remoteStream={remoteStream}
                isCameraOn={isCameraOn}
                isMicOn={isMicOn}
                remoteCameraOn={remoteCameraOn}
                isOtherPersonHere={isOtherPersonHere}
                userRole={userRole}
              />
              <div className="flex justify-center gap-3 mt-3">
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={toggleMic}
                  className={`p-2.5 rounded-full transition ${isMicOn ? "bg-slate-700 text-white" : "bg-red-500 text-white"}`}
                >
                  {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={toggleCamera}
                  className={`p-2.5 rounded-full transition ${isCameraOn ? "bg-slate-700 text-white" : "bg-red-500 text-white"}`}
                >
                  {isCameraOn ? <Video size={16} /> : <VideoOff size={16} />}
                </button>
              </div>
            </div>
          </Draggable>
        </main>
      )}

      <QuestionLibrary
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        questions={roomData?.questions || []}
        activeId={activeQuestion?._id}
        onSelect={(q) => {
          setActiveQuestion(q);
          setCode(q.startingCode || "");
          setIsLibraryOpen(false);
          socketRef.current.emit("change-question", { roomId, question: q });
        }}
      />
    </div>
  );
};

export default Room;
