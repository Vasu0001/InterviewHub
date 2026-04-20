import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

export const ChatPanel = ({ chatHistory, username, onSendMessage }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <div className="flex w-full flex-col bg-slate-50 h-full">
      <div className="p-3 border-b border-slate-100 flex items-center gap-2 bg-white">
        <MessageSquare size={16} className="text-slate-400" />
        <span className="text-sm font-semibold text-slate-700">Room Chat</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-white custom-scrollbar">
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.sender === username ? "items-end" : "items-start"}`}
          >
            <span className="text-[10px] text-slate-400 mb-0.5">
              {msg.sender}
            </span>
            <div
              className={`text-sm px-3 py-2 rounded-xl max-w-[85%] ${
                msg.sender === username
                  ? "bg-blue-600 text-white rounded-tr-sm"
                  : "bg-slate-100 text-slate-700 rounded-tl-sm"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <form
        className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-blue-600 outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
