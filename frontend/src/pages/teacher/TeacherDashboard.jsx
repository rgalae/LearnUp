import StatCard from "../../components/ui/StatCard";
import ActivityFeed from "../../components/ui/ActivityFeed";
import ProgressBar from "../../components/ui/ProgressBar";

const stats = [
  {
    title: "Total Students",
    value: "148",
    sub: "+12 this month",
    trend: "up",
    accent: "indigo",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Active Courses",
    value: "6",
    sub: "2 drafts",
    accent: "emerald",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: "Avg. Pass Rate",
    value: "82%",
    sub: "+3% vs last month",
    trend: "up",
    accent: "amber",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Quizzes Created",
    value: "34",
    sub: "5 pending review",
    accent: "rose",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

const topStudents = [
  { name: "Yassine B.", course: "React Advanced", score: 96, avatar: "Y" },
  { name: "Salma R.", course: "Python DS", score: 91, avatar: "S" },
  { name: "Omar K.", course: "UI/UX Design", score: 88, avatar: "O" },
  { name: "Hiba M.", course: "Node.js APIs", score: 85, avatar: "H" },
  { name: "Amine L.", course: "React Advanced", score: 82, avatar: "A" },
];

const courseStats = [
  { label: "React — Advanced Patterns", value: 87, color: "indigo" },
  { label: "Python for Data Science", value: 74, color: "emerald" },
  { label: "UI/UX Design Fundamentals", value: 91, color: "amber" },
  { label: "Node.js & REST APIs", value: 63, color: "rose" },
];

const activity = [
  {
    label: "Yassine B. submitted React Final Quiz",
    time: "1h ago",
    type: "success",
  },
  {
    label: "New enrollment: Python for Data Science",
    time: "3h ago",
    type: "info",
  },
  {
    label: "Salma R. failed Node.js Chapter 3",
    time: "Yesterday",
    type: "warning",
  },
  {
    label: "Omar K. earned UI/UX Certificate",
    time: "2d ago",
    type: "success",
  },
  { label: "5 new students joined React course", time: "3d ago", type: "info" },
];

function TeacherDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Good morning, Teacher 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Here's an overview of your courses and students.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Pass Rates */}
        <div className="lg:col-span-2 bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-white">
              Course Pass Rates
            </h3>
            <span className="text-xs text-slate-500">
              Avg. across all students
            </span>
          </div>
          <div className="space-y-5">
            {courseStats.map((c) => (
              <ProgressBar key={c.label} {...c} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <h3 className="text-sm font-semibold text-white mb-5">
            Quick Actions
          </h3>
          <div className="space-y-2.5">
            {[
              {
                label: "Create New Course",
                icon: (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                ),
                color: "indigo",
              },
              {
                label: "Add Quiz",
                icon: (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                ),
                color: "emerald",
              },
              {
                label: "View All Students",
                icon: (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                ),
                color: "amber",
              },
              {
                label: "Export Results",
                icon: (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                ),
                color: "rose",
              },
            ].map((action) => (
              <button
                key={action.label}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 text-slate-300 hover:text-white transition-all duration-200 text-sm font-medium text-left"
              >
                <span className="text-slate-500">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Students Table */}
        <div className="lg:col-span-2 bg-[#0d1526] border border-white/[0.06] rounded-2xl overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <h3 className="text-sm font-semibold text-white">Top Students</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {topStudents.map((s, i) => (
              <div
                key={s.name}
                className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-xs text-slate-600 w-4 text-center">
                  {i + 1}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {s.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.course}</p>
                </div>
                <span
                  className={`text-sm font-bold ${s.score >= 90 ? "text-emerald-400" : s.score >= 80 ? "text-amber-400" : "text-slate-300"}`}
                >
                  {s.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed title="Recent Activity" items={activity} />
      </div>
    </div>
  );
}

export default TeacherDashboard;
