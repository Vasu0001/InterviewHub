import React from "react";
import { useNavigate } from "react-router-dom";

export function CandidateDashboard({ username, handleLogout }) {
  const navigate = useNavigate();

  const joinRoom = () => {
    const rawLink = document.getElementById("roomLink").value.trim();

    if (!rawLink) return;

    try {
      const parsedUrl = new URL(rawLink);
      const roomId = parsedUrl.pathname.match(/\/room\/([^/?#]+)/)?.[1];

      if (roomId) {
        navigate(`/room/${roomId}`);
        return;
      }
    } catch {
      const roomId =
        rawLink.match(/\/room\/([^/?#]+)/)?.[1] ||
        rawLink.match(/^[a-zA-Z0-9-]+$/)?.[0];

      if (roomId) {
        navigate(`/room/${roomId}`);
        return;
      }
    }

    alert("Please paste a valid InterviewHub room link.");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
          {username.charAt(0).toUpperCase()}
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Welcome, {username}!
        </h1>
        <p className="mb-8 text-slate-500">
          Please wait for your interviewer to share the room link with you.
        </p>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-sm font-semibold text-slate-700">
            Have a link?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              id="roomLink"
              placeholder="Paste room link here..."
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
            <button
              onClick={joinRoom}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition"
            >
              Join
            </button>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 text-sm text-slate-400 hover:text-red-500 transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
