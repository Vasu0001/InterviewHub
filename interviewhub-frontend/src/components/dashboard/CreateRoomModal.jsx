import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api.js";
import { Search, CheckCircle2, Circle, Copy } from "lucide-react";

export function CreateRoomModal({ isOpen, onClose, questions }) {
  const navigate = useNavigate();

  const [candidateName, setCandidateName] = useState("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");

  if (!isOpen) return null;

  const toggleQuestion = (id) =>
    setSelectedQuestionIds((p) =>
      p.includes(id) ? p.filter((qId) => qId !== id) : [...p, id],
    );

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (selectedQuestionIds.length === 0)
      return alert("Select at least one question.");
    try {
      const response = await axios.post(
        "/api/v1/interviews",
        { candidateName, questionIds: selectedQuestionIds },
        { withCredentials: true },
      );
      setGeneratedLink(
        `${window.location.origin}/room/${response.data.data.roomId}`,
      );
    } catch (error) {
      alert("Failed to create room");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy");
    }
  };

  const resetAndClose = () => {
    onClose();
    setGeneratedLink(null);
    setCandidateName("");
    setSelectedQuestionIds([]);
    setModalSearchQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {!generatedLink ? (
          <>
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Setup Interview Room
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Configure the candidate and select questions.
              </p>
            </div>
            <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Candidate Name
                </label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Select Questions{" "}
                  <span className="font-normal text-blue-600">
                    ({selectedQuestionIds.length} selected)
                  </span>
                </label>
                <div className="relative mb-3">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="custom-scrollbar max-h-64 space-y-2 overflow-y-auto pr-2">
                  {questions
                    .filter((q) =>
                      q.title
                        .toLowerCase()
                        .includes(modalSearchQuery.toLowerCase()),
                    )
                    .map((q) => {
                      const isSelected = selectedQuestionIds.includes(q._id);
                      return (
                        <div
                          key={q._id}
                          onClick={() => toggleQuestion(q._id)}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${isSelected ? "border-blue-600 bg-blue-50/50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}
                        >
                          {isSelected ? (
                            <CheckCircle2 className="text-blue-600" size={20} />
                          ) : (
                            <Circle className="text-slate-300" size={20} />
                          )}
                          <div>
                            <p
                              className={`font-medium ${isSelected ? "text-blue-900" : "text-slate-700"}`}
                            >
                              {q.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {q.difficulty}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 p-6">
              <button
                type="button"
                onClick={resetAndClose}
                className="rounded-xl px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={!candidateName || selectedQuestionIds.length === 0}
                className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Generate Room Link
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Room Created!</h2>
            <p className="mb-6 mt-2 text-sm text-slate-500">
              Send this link to{" "}
              <span className="font-bold text-slate-800">{candidateName}</span>.
            </p>
            <div className="mb-6 flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="flex-1 bg-transparent px-2 text-sm text-slate-600 outline-none"
              />
              <button
                onClick={copyToClipboard}
                className={`rounded-lg p-2 transition ${isCopied ? "bg-green-100 text-green-700" : "border bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="flex w-full gap-3">
              <button
                onClick={() =>
                  navigate(`/room/${generatedLink.split("/").pop()}`)
                }
                className="flex-1 rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
              >
                Enter Room Now
              </button>
            </div>
            <button
              onClick={resetAndClose}
              className="mt-4 text-sm font-medium text-slate-400 hover:text-slate-600"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
