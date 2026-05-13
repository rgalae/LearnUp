import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

const routeLabels = {
  "/student": "Overview",
  "/student/courses": "My Courses",
  "/student/results": "Results",

  "/teacher": "Overview",
  "/teacher/courses": "Courses",
  "/teacher/results": "Results",
  "/teacher/students": "Students",
};

function Navbar() {
  const location = useLocation();

  const { user } = useContext(AuthContext);

  const pageLabel = routeLabels[location.pathname] || "Dashboard";

  const role = user?.role || "student";

  const roleLabel = role === "teacher" ? "Teacher" : "Student";

  const userName = user?.username || "User";

  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#080e1c]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      {/* LEFT */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">{roleLabel}</span>

        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-600"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>

        <span className="text-white font-medium">{pageLabel}</span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] transition-all text-slate-400 hover:text-white">
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
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>

          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full" />
        </button>

        <div className="w-px h-5 bg-white/[0.08]" />

        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-indigo-500/20">
            {userName[0]?.toUpperCase()}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white leading-none">
              {userName}
            </p>

            <p className="text-[11px] text-slate-500 mt-0.5 leading-none capitalize">
              {role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
