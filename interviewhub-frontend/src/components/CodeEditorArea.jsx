import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Save,
  PhoneOff,
  TerminalSquare,
  FlaskConical,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import axios from "../api.js";

export const CodeEditorArea = ({
  code,
  setCode,
  language,
  setLanguage,
  output,
  isRunning,
  userRole,
  onSave,
  onEnd,
  onSocketEmit,
  isPracticeMode = false,
  activeQuestion = null,
  setOutput,
  setIsRunning,
  roomId,
  testResults = [],
  setTestResults = null,
}) => {
  const [bottomTab, setBottomTab] = useState("console");

  const [localTestResults, setLocalTestResults] = useState([]);
  const activeTestResults = setTestResults ? testResults : localTestResults;
  const updateTestResults = setTestResults || setLocalTestResults;

  const handleRunCode = async () => {
    setIsRunning(true);
    setBottomTab("console");
    setOutput("⏳ Code is executing in the cloud...");
    updateTestResults([]);

    if (onSocketEmit && roomId) onSocketEmit("code-running", { roomId });

    try {
      const r = await axios.post(
        "/api/v1/execute",
        {
          language,
          code,
          testCases: activeQuestion?.testCases || [],
        },
        { withCredentials: true },
      );

      const finalOutput = r.data.run.stdout || r.data.run.stderr;
      setOutput(
        finalOutput || "Code executed successfully. No console output.",
      );

      if (r.data.testResults && r.data.testResults.length > 0) {
        updateTestResults(r.data.testResults);
        setBottomTab("testcases");

        if (onSocketEmit && roomId) {
          onSocketEmit("receive-test-results", {
            roomId,
            testResults: r.data.testResults,
          });
        }
      }

      if (onSocketEmit && roomId)
        onSocketEmit("receive-output", { roomId, output: finalOutput });
    } catch {
      setOutput("❌ Execution error. Check server.");
      if (onSocketEmit && roomId)
        onSocketEmit("receive-output", {
          roomId,
          output: "❌ Execution error.",
        });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="flex h-10 items-center justify-between border-b border-slate-100 px-4 bg-slate-50/50">
        <div className="text-xs font-semibold text-slate-500 uppercase">
          solution.
          {language === "python"
            ? "py"
            : language === "cpp"
              ? "cpp"
              : language === "java"
                ? "java"
                : "js"}
        </div>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            if (onSocketEmit)
              onSocketEmit("change-language", { language: e.target.value });
          }}
          className="bg-slate-200/50 hover:bg-slate-200 text-xs text-slate-700 font-bold py-1 px-2 rounded outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          theme="light"
          language={language}
          value={code}
          onChange={(val) => setCode(val)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
          }}
        />
      </div>

      <div className="border-t border-slate-200 bg-white flex flex-col h-72">
        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => setBottomTab("console")}
              className={`text-xs font-bold uppercase flex items-center gap-1.5 px-2 py-1 border-b-2 transition-colors ${bottomTab === "console" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <TerminalSquare size={14} /> Console
            </button>
            {activeQuestion?.testCases?.length > 0 && (
              <button
                onClick={() => setBottomTab("testcases")}
                className={`text-xs font-bold uppercase flex items-center gap-1.5 px-2 py-1 border-b-2 transition-colors ${bottomTab === "testcases" ? "border-green-600 text-green-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
              >
                <FlaskConical size={14} /> Test Cases
                {activeTestResults.length > 0 && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                )}
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* 🚀 Removed UserRole restriction so BOTH people can click Run! */}
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              <Play
                size={14}
                className={isRunning ? "text-slate-400" : "text-blue-600"}
              />
              {isRunning ? "Running..." : "Run Code"}
            </button>

            {!isPracticeMode && (
              <>
                <button
                  onClick={onSave}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-indigo-700 shadow-md transition ml-2"
                >
                  <Save size={14} /> Save Answer
                </button>
                <button
                  onClick={onEnd}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-red-700 shadow-md transition ml-2"
                >
                  <PhoneOff size={14} /> End Interview
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#1e1e1e] p-4">
          {bottomTab === "console" && (
            <div className="font-mono text-sm whitespace-pre-wrap text-slate-300">
              {output}
            </div>
          )}
          {bottomTab === "testcases" && (
            <div className="space-y-4">
              {activeQuestion?.testCases.map((tc, idx) => {
                const result = activeTestResults[idx];
                return (
                  <div
                    key={idx}
                    className={`rounded-lg border overflow-hidden ${result ? (result.passed ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5") : "border-slate-700 bg-slate-800"}`}
                  >
                    <div
                      className={`px-4 py-2 border-b flex justify-between items-center ${result ? (result.passed ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30") : "bg-slate-900 border-slate-700"}`}
                    >
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Test Case {idx + 1}
                      </span>
                      {result &&
                        (result.passed ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                            <CheckCircle2 size={12} /> Passed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded">
                            <XCircle size={12} /> Failed
                          </span>
                        ))}
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-500 block mb-1">
                          Input:
                        </span>
                        <code className="text-sm font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded block whitespace-pre-wrap">
                          {tc.input}
                        </code>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-500 block mb-1">
                          Expected Output:
                        </span>
                        <code className="text-sm font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded block whitespace-pre-wrap">
                          {tc.expectedOutput}
                        </code>
                      </div>
                      {result && !result.passed && (
                        <div>
                          <span className="text-xs font-bold text-red-400 block mb-1">
                            Actual Output:
                          </span>
                          <code className="text-sm font-mono text-red-300 bg-red-950/30 border border-red-900/50 px-2 py-1 rounded block whitespace-pre-wrap">
                            {result.actual}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
