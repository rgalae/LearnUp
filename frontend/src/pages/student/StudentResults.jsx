import { useState } from "react";

const results = [
  {
    id: 1,
    course: "React — Advanced Patterns",
    quiz: "Chapter 5 — Hooks",
    score: 92,
    total: 100,
    date: "May 6, 2025",
    status: "Passed",
  },
  {
    id: 2,
    course: "Python for Data Science",
    quiz: "Midterm Exam",
    score: 78,
    total: 100,
    date: "Apr 30, 2025",
    status: "Passed",
  },
  {
    id: 3,
    course: "UI/UX Design Fundamentals",
    quiz: "Design Systems Quiz",
    score: 85,
    total: 100,
    date: "Apr 24, 2025",
    status: "Passed",
  },
  {
    id: 4,
    course: "Node.js & REST APIs",
    quiz: "Chapter 2 — Routes",
    score: 54,
    total: 100,
    date: "Apr 18, 2025",
    status: "Failed",
  },
  {
    id: 5,
    course: "HTML & CSS Mastery",
    quiz: "Final Exam",
    score: 96,
    total: 100,
    date: "Mar 12, 2025",
    status: "Passed",
  },
  {
    id: 6,
    course: "Git & Version Control",
    quiz: "Branching Strategies",
    score: 88,
    total: 100,
    date: "Mar 5, 2025",
    status: "Passed",
  },
];

function scoreColor(score) {
  if (score >= 85) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-rose-400";
}

function scoreBg(score) {
  if (score >= 85)
    return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
  if (score >= 60) return "bg-amber-500/10 border-amber-500/20 text-amber-400";
  return "bg-rose-500/10 border-rose-500/20 text-rose-400";
}

const avg = Math.round(
  results.reduce((a, r) => a + r.score, 0) / results.length,
);
const passed = results.filter((r) => r.status === "Passed").length;

function StudentResults() {
  const [sort, setSort] = useState("date");

  const sorted = [...results].sort((a, b) => {
    if (sort === "score") return b.score - a.score;
    return b.id - a.id;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Results</h1>
        <p className="text-slate-500 text-sm mt-1">
          Your quiz and exam history
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Attempts", value: results.length, accent: "indigo" },
          {
            label: "Passed",
            value: `${passed}/${results.length}`,
            accent: "emerald",
          },
          {
            label: "Average Score",
            value: `${avg}%`,
            accent: avg >= 75 ? "emerald" : "amber",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              {s.label}
            </p>
            <p className="text-3xl font-bold text-white mt-2 tracking-tight">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0d1526] border border-white/[0.06] rounded-2xl overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Table Header */}
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">All Results</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Sort by</span>
            {["date", "score"].map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                  sort === s
                    ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                    : "bg-white/[0.03] text-slate-500 border-white/[0.06] hover:text-slate-300"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.04]">
          {sorted.map((r) => (
            <div
              key={r.id}
              className="px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
            >
              {/* Score circle */}
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 font-bold text-sm ${scoreBg(r.score)}`}
              >
                {r.score}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {r.quiz}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {r.course}
                </p>
              </div>

              {/* Date */}
              <span className="text-xs text-slate-600 hidden sm:block flex-shrink-0">
                {r.date}
              </span>

              {/* Status */}
              <span
                className={`text-[10px] px-2.5 py-1 rounded-full border font-medium flex-shrink-0 ${
                  r.status === "Passed"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {r.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentResults;
