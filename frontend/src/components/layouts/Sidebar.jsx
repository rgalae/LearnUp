import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

const StudentLinks = [
  {
    name: "Dashboard",
    path: "/student",
    end: true,
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    name: "My Courses",
    path: "/student/courses",
    end: false,
    icon: (
      <svg
        width="18"
        height="18"
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
    name: "Results",
    path: "/student/results",
    end: false,
    icon: (
      <svg
        width="18"
        height="18"
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
];

const TeacherLinks = [
  {
    name: "Dashboard",
    path: "/teacher",
    end: true,
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    name: "My Courses",
    path: "/teacher/courses",
    end: false,
    icon: (
      <svg
        width="18"
        height="18"
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
    name: "Students",
    path: "/teacher/students",
    end: false,
    icon: (
      <svg
        width="18"
        height="18"
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
];

function Sidebar({ role = "student" }) {
  const navigate = useNavigate();
  const links = role === "teacher" ? TeacherLinks : StudentLinks;
  const roleLabel = role === "teacher" ? "Teacher" : "Student";
  const roleDesc = role === "teacher" ? "Course instructor" : "Active learner";
  const basePath = role === "teacher" ? "/teacher" : "/student";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="w-[260px] min-h-screen bg-[#080e1c] border-r border-white/[0.06] flex flex-col justify-between relative overflow-hidden">
      {/* subtle background glow */}
      <div className="absolute top-0 left-0 w-full h-64 bg-indigo-600/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* LOGO */}
        <div className="mb-10 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              LearnUp
            </span>
          </div>
          <div className="mt-2 h-px bg-gradient-to-r from-indigo-500/30 to-transparent" />
        </div>

        {/* ROLE BADGE */}
        <div className="mb-8 px-1">
          <span className="text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold">
            {roleLabel} Portal
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-1.5 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
                ${
                  isActive
                    ? "bg-indigo-500/15 text-white border border-indigo-500/25"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-r-full" />
                  )}
                  <span
                    className={`transition-colors ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}
                  >
                    {link.icon}
                  </span>
                  <span className="text-sm font-medium">{link.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="mt-6 space-y-3">
          {/* User Card */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20 flex-shrink-0">
                {roleLabel[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {roleLabel}
                </p>
                <p className="text-xs text-slate-500 truncate">{roleDesc}</p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/[0.06] border border-transparent hover:border-red-500/20 transition-all duration-200 group"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-0.5 transition-transform"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="text-sm font-medium">Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
