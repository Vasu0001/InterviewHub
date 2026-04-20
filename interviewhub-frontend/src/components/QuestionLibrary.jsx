import React from "react";
import { BookOpen, X } from "lucide-react";

export const QuestionLibrary = ({
  isOpen,
  onClose,
  questions,
  onSelect,
  activeId,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
            <BookOpen className="text-blue-600" size={20} /> Question Bank
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 space-y-3 bg-slate-50 flex-1">
          {questions.map((q) => (
            <div
              key={q._id}
              onClick={() => onSelect(q)}
              className={`bg-white border rounded-xl p-4 cursor-pointer hover:shadow-md transition ${
                activeId === q._id
                  ? "border-blue-500 ring-1 ring-blue-500"
                  : "border-slate-200"
              }`}
            >
              <h3 className="font-bold text-slate-800">{q.title}</h3>
              <p className="text-sm text-slate-500 line-clamp-2">
                {q.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
