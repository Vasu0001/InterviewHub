import React, { useRef, useEffect } from "react";
import { Mic, MicOff, Video, VideoOff, Loader2 } from "lucide-react";

const VideoStream = ({ stream, isMuted, isHidden }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current
          .play()
          .catch((e) => console.warn("Video Play Blocked:", e));
      };
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted={isMuted}
      playsInline
      className={`w-full h-full object-cover ${isHidden ? "hidden" : ""}`}
    />
  );
};

const VideoBox = ({
  stream,
  label,
  isMuted,
  isRemote = false,
  isHardwareOn = true,
  isConnected = true,
}) => {
  const isWaiting = isRemote && !isConnected;
  const isCameraOff = isConnected && !isHardwareOn;
  const isNegotiating = isRemote && isConnected && isHardwareOn && !stream;

  return (
    <div
      className={`flex-1 bg-slate-800 rounded-2xl border border-slate-700 relative overflow-hidden shadow-2xl ${isCoding ? "rounded-lg h-24" : ""}`}
    >
      <div className="absolute bottom-2 left-2 z-10 bg-black/60 px-2 py-1 rounded text-[10px] text-white backdrop-blur-sm z-20">
        {label}
      </div>

      <VideoStream
        stream={stream}
        isMuted={isMuted}
        isHidden={isWaiting || isCameraOff || isNegotiating}
      />

      {isNegotiating && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-blue-400 z-10">
          <Loader2 className="animate-spin mb-2" size={24} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Connecting...
          </span>
        </div>
      )}

      {isCameraOff && !isNegotiating && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-bold bg-slate-800 text-center text-xs z-10">
          Camera Off
        </div>
      )}

      {isWaiting && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-bold bg-slate-800 text-center text-xs z-10">
          Waiting for User...
        </div>
      )}
    </div>
  );
};

export const VideoPanel = ({
  myStream,
  remoteStream,
  isCameraOn,
  isMicOn,
  remoteCameraOn,
  isOtherPersonHere,
  userRole,
  layout = "greeting",
}) => {
  const isCoding = layout === "coding";

  return (
    <div
      className={
        isCoding
          ? "flex gap-2 mb-2"
          : "flex gap-6 w-full max-w-6xl h-[60vh] mb-8"
      }
    >
      <VideoBox
        stream={myStream}
        label={`Me (${userRole})`}
        isMuted={true}
        isHardwareOn={isCameraOn}
        isConnected={true}
      />
      <VideoBox
        stream={remoteStream}
        label={userRole === "Interviewer" ? "Candidate" : "Interviewer"}
        isMuted={false}
        isRemote={true}
        isHardwareOn={remoteCameraOn}
        isConnected={isOtherPersonHere}
      />
    </div>
  );
};
