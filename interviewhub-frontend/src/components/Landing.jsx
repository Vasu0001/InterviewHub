import { useNavigate } from "react-router-dom";
import {
  Code2,
  Globe2,
  ShieldCheck,
  Zap,
  ChevronRight,
  PlayCircle,
  Users,
  Building2,
} from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Code2 size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              InterviewHub
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 pt-24 pb-32 lg:pt-36">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 mb-8">
            <Globe2 size={16} />
            <span>Trusted by global engineering teams</span>
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Technical interviews, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              engineered for precision.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Evaluate developer talent with our real-time collaborative coding
            environment, automated test-case execution, and integrated video
            conferencing.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/auth")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl active:scale-95"
            >
              Start Hiring <ChevronRight size={18} />
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <PlayCircle size={18} className="text-slate-400" />
              Try Practice Mode
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to make the right hire.
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              A streamlined, distraction-free environment designed to let
              candidate skills shine.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 transition hover:border-blue-200 hover:bg-blue-50/50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Zap size={24} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                Live Auto-Judge
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Automatically evaluate candidate code against hidden test cases
                in real-time, across multiple languages.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 transition hover:border-blue-200 hover:bg-blue-50/50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Users size={24} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                Seamless A/V Sync
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Built-in, high-fidelity video and audio communication. No need
                for external meeting links or third-party apps.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 transition hover:border-blue-200 hover:bg-blue-50/50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <ShieldCheck size={24} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                Secure & Private
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Isolated code execution environments and direct peer-to-peer
                media streams ensure strict data privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="mx-auto max-w-4xl px-6">
          <Building2
            size={48}
            className="mx-auto mb-6 text-blue-500 opacity-80"
          />
          <h2 className="text-3xl font-bold mb-6">
            Built for scale. Designed for quality.
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Whether you are scaling a startup in Berlin or managing enterprise
            teams in Tokyo, InterviewHub provides the stable, professional
            infrastructure required for top-tier technical recruitment.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="rounded-xl bg-white text-slate-900 px-8 py-4 font-bold shadow-lg transition hover:bg-slate-100 active:scale-95"
          >
            Create Your Enterprise Account
          </button>
        </div>
      </section>

      <footer className="bg-white py-8 border-t border-slate-200 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} InterviewHub. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
