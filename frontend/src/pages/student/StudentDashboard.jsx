import StatCard from "../../components/ui/StatCard";
import ProgressBar from "../../components/ui/ProgressBar";
import ActivityFeed from "../../components/ui/ActivityFeed";

const stats = [
  {
    title: "Enrolled Courses",
    value: "12",
    sub: "+2 this month",
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
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    title: "Avg. Score",
    value: "87%",
    sub: "+4% vs last month",
    trend: "up",
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
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Quizzes Done",
    value: "24",
    sub: "3 pending",
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
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    title: "Certificates",
    value: "3",
    sub: "1 in progress",
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
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
];

const courseProgress = [
  { label: "React — Advanced Patterns", value: 78, color: "indigo" },
  { label: "Python for Data Science", value: 55, color: "emerald" },
  { label: "UI/UX Design Fundamentals", value: 90, color: "amber" },
  { label: "Node.js & REST APIs", value: 32, color: "rose" },
];

const recentActivity = [
  {
    label: "Completed React Quiz — Chapter 5",
    time: "2h ago",
    type: "success",
  },
  { label: "Started Python for Data Science", time: "Yesterday", type: "info" },
  { label: "Earned React Basics Certificate", time: "3d ago", type: "success" },
  { label: "Submitted UI/UX Assignment", time: "4d ago", type: "warning" },
  { label: "Enrolled in Node.js & REST APIs", time: "1w ago", type: "info" },
];

function StudentDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Good morning, Student 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Here's what's happening with your learning today.
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
        {/* Course Progress */}
        <div className="lg:col-span-2 bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-white">
              Course Progress
            </h3>
            <a
              href="/student/courses"
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View all →
            </a>
          </div>
          <div className="space-y-5">
            {courseProgress.map((c) => (
              <ProgressBar key={c.label} {...c} />
            ))}
          </div>
        </div>

        {/* Quick Stats panel */}
        <div className="bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <h3 className="text-sm font-semibold text-white mb-5">Weekly Goal</h3>

          {/* Circular-ish donut — CSS only */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#ffffff08"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${0.72 * 251.2} ${251.2}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">72%</span>
                <span className="text-[10px] text-slate-500">of goal</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
              5 of 7 study sessions completed this week
            </p>
          </div>

          <div className="mt-4 space-y-2.5">
            {[
              { day: "Mon", done: true },
              { day: "Tue", done: true },
              { day: "Wed", done: true },
              { day: "Thu", done: true },
              { day: "Fri", done: true },
              { day: "Sat", done: false },
              { day: "Sun", done: false },
            ].map((d) => (
              <div key={d.day} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-7">{d.day}</span>
                <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  {d.done && (
                    <div className="h-full bg-indigo-500 rounded-full w-full" />
                  )}
                </div>
                {d.done ? (
                  <span className="text-emerald-400 text-xs">✓</span>
                ) : (
                  <span className="text-slate-700 text-xs">–</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed title="Recent Activity" items={recentActivity} />
        </div>

        {/* Upcoming */}
        <div className="bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <h3 className="text-sm font-semibold text-white mb-4">Upcoming</h3>
          <div className="space-y-3">
            {[
              { title: "React Final Quiz", date: "Tomorrow", tag: "Quiz" },
              {
                title: "Python Assignment",
                date: "In 3 days",
                tag: "Assignment",
              },
              { title: "UI/UX Live Session", date: "Friday", tag: "Live" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.date}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
