import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api.js";
import {
  Search,
  Star,
  ChevronDown,
  Calendar,
  ChevronUp,
  User as UserIcon,
  Mail,
  Shield,
  Lock,
} from "lucide-react";
import { CodeEditorArea } from "./CodeEditorArea";

import { Sidebar } from "./dashboard/Sidebar";
import { CandidateDashboard } from "./dashboard/CandidateDashboard";
import { CreateRoomModal } from "./dashboard/CreateRoomModal";

const StarRatingStatic = ({ value }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        fill={star <= (value || 0) ? "#eab308" : "none"}
        className={star <= (value || 0) ? "text-yellow-500" : "text-slate-300"}
      />
    ))}
  </div>
);

function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("library");
  const [questions, setQuestions] = useState([]);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedInterview, setExpandedInterview] = useState(null);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const [solvingQuestion, setSolvingQuestion] = useState(null);
  const [solveCode, setSolveCode] = useState("");
  const [solveLanguage, setSolveLanguage] = useState("javascript");
  const [solveOutput, setSolveOutput] = useState("Ready...");
  const [isSolvingRunning, setIsSolvingRunning] = useState(false);

  const username = localStorage.getItem("username") || "Admin";
  const userRole = localStorage.getItem("role") || "Interviewer";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (activeTab === "library") {
          const res = await axios.get("/api/v1/questions", {
            withCredentials: true,
          });
          setQuestions(res.data.data);
        } else if (activeTab === "history") {
          const res = await axios.get("/api/v1/interviews/history", {
            withCredentials: true,
          });
          setPastInterviews(res.data.data);
        } else if (activeTab === "profile" && !currentUserData) {
          const res = await axios.get("/api/v1/users/current-user", {
            withCredentials: true,
          });
          setCurrentUserData(res.data.data);
        }
      } catch (error) {
        if (error.response?.status === 401) navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab, navigate, currentUserData]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { withCredentials: true });
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordStatus({ loading: true, error: "", success: "" });
    if (passwords.newPassword !== passwords.confirmPassword)
      return setPasswordStatus({
        loading: false,
        error: "New passwords do not match",
        success: "",
      });
    try {
      await axios.post(
        "/api/v1/users/change-password",
        {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        { withCredentials: true },
      );
      setPasswordStatus({
        loading: false,
        error: "",
        success: "Password updated successfully!",
      });
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordStatus((p) => ({ ...p, success: "" })), 3000);
    } catch (error) {
      setPasswordStatus({
        loading: false,
        error: error.response?.data?.message || "Failed to update password",
        success: "",
      });
    }
  };

  const handleStartSolving = (q) => {
    setSolvingQuestion(q);
    setSolveCode(q.startingCode || "// Start coding...");
    setSolveOutput("Ready...");
    setSolveLanguage("javascript");
  };

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (userRole === "Candidate") {
    return (
      <CandidateDashboard username={username} handleLogout={handleLogout} />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        username={username}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSolvingQuestion={setSolvingQuestion}
        handleLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-5xl h-full">
          {activeTab === "library" && (
            <>
              {solvingQuestion ? (
                <div className="flex h-[calc(100vh-100px)] rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="w-1/3 bg-white p-6 overflow-y-auto border-r border-slate-200 custom-scrollbar">
                    <button
                      onClick={() => setSolvingQuestion(null)}
                      className="text-blue-600 font-bold text-sm mb-6 hover:underline flex items-center gap-1"
                    >
                      ← Back to Library
                    </button>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${solvingQuestion.difficulty === "Easy" ? "bg-green-50 text-green-700 border-green-200" : solvingQuestion.difficulty === "Medium" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-red-50 text-red-700 border-red-200"}`}
                    >
                      {solvingQuestion.difficulty}
                    </span>
                    <h2 className="text-2xl font-bold mt-4 mb-4 text-slate-800">
                      {solvingQuestion.title}
                    </h2>
                    <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {solvingQuestion.description}
                    </div>
                  </div>
                  <div className="w-2/3 flex flex-col">
                    <CodeEditorArea
                      code={solveCode}
                      setCode={setSolveCode}
                      language={solveLanguage}
                      setLanguage={setSolveLanguage}
                      output={solveOutput}
                      isRunning={isSolvingRunning}
                      userRole="Candidate"
                      isPracticeMode={true}
                      activeQuestion={solvingQuestion}
                      setOutput={setSolveOutput}
                      setIsRunning={setIsSolvingRunning}
                      roomId={null}
                      onSave={() =>
                        alert(
                          "You are in practice mode! Code is not saved to the database.",
                        )
                      }
                      onEnd={() => setSolvingQuestion(null)}
                      onSocketEmit={() => {}}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">
                        Question Library
                      </h1>
                      <p className="text-slate-500 mt-1">
                        Select challenges and create meeting rooms.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
                    >
                      + Create Room
                    </button>
                  </div>

                  <div className="relative mb-6">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search by question title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                    />
                  </div>

                  {isLoading ? (
                    <div className="text-slate-500 font-bold mt-10">
                      Loading Library...
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredQuestions.map((q) => (
                        <div
                          key={q._id}
                          onClick={() => handleStartSolving(q)}
                          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span
                              className={`px-2.5 py-1 text-xs font-semibold rounded-full ${q.difficulty === "Easy" ? "bg-green-100 text-green-700" : q.difficulty === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                            >
                              {q.difficulty}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {q.title}
                          </h3>
                          <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                            {q.description}
                          </p>
                          <p className="mt-3 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to practice →
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === "history" && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                  Past Interviews
                </h1>
                <p className="text-slate-500 mt-1">
                  Review candidate performance and submitted code.
                </p>
              </div>

              {isLoading ? (
                <div className="text-slate-500 font-bold mt-10">
                  Loading History...
                </div>
              ) : (
                <div className="space-y-4">
                  {pastInterviews.length === 0 && (
                    <div className="text-slate-400 border border-dashed border-slate-300 p-10 text-center rounded-xl">
                      No past interviews found.
                    </div>
                  )}

                  {pastInterviews.map((interview) => (
                    <div
                      key={interview._id}
                      className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                    >
                      <div
                        onClick={() =>
                          setExpandedInterview(
                            expandedInterview === interview._id
                              ? null
                              : interview._id,
                          )
                        }
                        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                            {interview.candidateName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-800">
                              Candidate: {interview.candidateName}
                            </h3>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />{" "}
                                {new Date(
                                  interview.createdAt,
                                ).toLocaleDateString()}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full ${interview.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                              >
                                {interview.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <span className="text-xs text-slate-400 font-semibold block mb-1 uppercase tracking-wider">
                              Overall Rating
                            </span>
                            <StarRatingStatic
                              value={interview.feedback?.overall}
                            />
                          </div>
                          {expandedInterview === interview._id ? (
                            <ChevronUp className="text-slate-400" />
                          ) : (
                            <ChevronDown className="text-slate-400" />
                          )}
                        </div>
                      </div>

                      {expandedInterview === interview._id && (
                        <div className="border-t border-slate-100 bg-slate-50 p-6 flex flex-col gap-6">
                          {interview.feedback?.notes && (
                            <div className="bg-white p-4 rounded-xl border border-slate-200">
                              <h4 className="text-sm font-bold text-slate-700 mb-2">
                                Interviewer Notes
                              </h4>
                              <p className="text-sm text-slate-600">
                                {interview.feedback.notes}
                              </p>
                            </div>
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-3">
                              Submitted Answers
                            </h4>
                            <div className="grid gap-4 md:grid-cols-2">
                              {interview.questions.map((q, idx) => (
                                <div
                                  key={idx}
                                  className="bg-slate-900 rounded-xl overflow-hidden flex flex-col"
                                >
                                  <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
                                    <span className="text-xs font-bold text-slate-300">
                                      {q.title}
                                    </span>
                                  </div>
                                  <div className="p-4 flex-1 overflow-auto max-h-60 custom-scrollbar">
                                    <pre className="text-xs text-blue-300 font-mono whitespace-pre-wrap">
                                      {q.finalCode || "// No code saved"}
                                    </pre>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "profile" && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                  My Profile
                </h1>
                <p className="text-slate-500 mt-1">
                  Manage your account details and security settings.
                </p>
              </div>

              {isLoading || !currentUserData ? (
                <div className="text-slate-500 font-bold mt-10">
                  Loading Profile...
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 items-start">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center gap-3">
                      <UserIcon className="text-blue-600" size={20} />
                      <h2 className="font-bold text-slate-800">
                        Account Details
                      </h2>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Full Name
                        </label>
                        <div className="flex items-center gap-3 text-slate-800 font-medium">
                          {currentUserData.fullName || "Not provided"}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Username
                        </label>
                        <div className="flex items-center gap-3 text-slate-800 font-medium">
                          <Shield size={16} className="text-slate-400" /> @
                          {currentUserData.username}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Email Address
                        </label>
                        <div className="flex items-center gap-3 text-slate-800 font-medium">
                          <Mail size={16} className="text-slate-400" />{" "}
                          {currentUserData.email}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Account Role
                        </label>
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {currentUserData.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center gap-3">
                      <Lock className="text-blue-600" size={20} />
                      <h2 className="font-bold text-slate-800">
                        Change Password
                      </h2>
                    </div>
                    <form
                      onSubmit={handlePasswordChange}
                      className="p-6 space-y-5"
                    >
                      {passwordStatus.error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                          {passwordStatus.error}
                        </div>
                      )}
                      {passwordStatus.success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm border border-green-200">
                          {passwordStatus.success}
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          required
                          value={passwords.oldPassword}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              oldPassword: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          minLength="6"
                          value={passwords.newPassword}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          minLength="6"
                          value={passwords.confirmPassword}
                          onChange={(e) =>
                            setPasswords({
                              ...passwords,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={passwordStatus.loading}
                        className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
                      >
                        {passwordStatus.loading
                          ? "Updating..."
                          : "Update Password"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <CreateRoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        questions={questions}
      />
    </div>
  );
}

export default Dashboard;
