import { useState } from "react";
import ProgressBar from "../../components/ui/ProgressBar";

const courses = [
  {
    id: 1,
    title: "React — Advanced Patterns",
    category: "Frontend",
    instructor: "Sarah M.",
    progress: 78,
    lessons: 24,
    lessonsCompleted: 18,
    color: "indigo",
    tag: "In Progress",
  },
  {
    id: 2,
    title: "Python for Data Science",
    category: "Backend",
    instructor: "Alex K.",
    progress: 55,
    lessons: 32,
    lessonsCompleted: 17,
    color: "emerald",
    tag: "In Progress",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    category: "Design",
    instructor: "Nina R.",
    progress: 90,
    lessons: 18,
    lessonsCompleted: 16,
    color: "amber",
    tag: "Almost Done",
  },
  {
    id: 4,
    title: "Node.js & REST APIs",
    category: "Backend",
    instructor: "Tom B.",
    progress: 32,
    lessons: 28,
    lessonsCompleted: 9,
    color: "rose",
    tag: "In Progress",
  },
  {
    id: 5,
    title: "HTML & CSS Mastery",
    category: "Frontend",
    instructor: "Lina S.",
    progress: 100,
    lessons: 16,
    lessonsCompleted: 16,
    color: "indigo",
    tag: "Completed",
  },
  {
    id: 6,
    title: "Git & Version Control",
    category: "Tools",
    instructor: "Mark D.",
    progress: 100,
    lessons: 10,
    lessonsCompleted: 10,
    color: "emerald",
    tag: "Completed",
  },
];

const tagColors = {
  "In Progress": "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  "Almost Done": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};

const filters = ["All", "In Progress", "Almost Done", "Completed"];

function StudentCourses() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? courses : courses.filter((c) => c.tag === active);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Courses</h1>
          <p className="text-slate-500 text-sm mt-1">
            {courses.length} courses enrolled
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
              active === f
                ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-slate-200 hover:bg-white/[0.06]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="group bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 hover:bg-[#0f1830] transition-all duration-300 relative overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  {course.category}
                </span>
                <h3 className="text-base font-semibold text-white mt-0.5 leading-snug">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  by {course.instructor}
                </p>
              </div>
              <span
                className={`text-[10px] px-2.5 py-1 rounded-full border font-medium flex-shrink-0 ml-3 ${tagColors[course.tag]}`}
              >
                {course.tag}
              </span>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <ProgressBar
                label={`${course.lessonsCompleted}/${course.lessons} lessons`}
                value={course.progress}
                color={course.color}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
              <span className="text-xs text-slate-500">
                {course.progress}% complete
              </span>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium group-hover:underline">
                {course.progress === 100 ? "Review" : "Continue"} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentCourses;
