import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

function Sidebar() {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  const role = user?.role || "student";

  const StudentLinks = [
    {
      name: "Dashboard",
      path: "/student",
      end: true,
    },
    {
      name: "My Courses",
      path: "/student/courses",
      end: false,
    },
    {
      name: "Results",
      path: "/student/results",
      end: false,
    },
  ];

  const TeacherLinks = [
    {
      name: "Dashboard",
      path: "/teacher",
      end: true,
    },
    {
      name: "Courses",
      path: "/teacher/courses",
      end: false,
    },
    {
      name: "Results",
      path: "/teacher/results",
      end: false,
    },
    {
      name: "Students",
      path: "/teacher/students",
      end: false,
    },
  ];

  const links = role === "teacher" ? TeacherLinks : StudentLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-[260px] min-h-screen bg-[#080e1c] border-r border-white/[0.06] flex flex-col justify-between">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-10">LearnUp</h1>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-indigo-500/20 text-white"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
