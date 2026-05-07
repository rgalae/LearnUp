import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    {
      name: "Dashboard",
      path: "/student",
    },
    {
      name: "Courses",
      path: "/student",
    },
    {
      name: "Results",
      path: "/student",
    },
  ];

  return (
    <aside className="w-[280px] min-h-screen bg-white/5 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col justify-between">
      <div>
        {/* LOGO */}
        <div className="mb-14">
          <h1 className="text-4xl font-black tracking-tight text-indigo-400">
            LearnUp
          </h1>

          <p className="text-sm text-slate-400 mt-2">Modern LMS Platform</p>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-3">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3
                px-5 py-4
                rounded-2xl
                transition-all duration-300
                border

                ${
                  isActive
                    ? "bg-indigo-500/20 border-indigo-500/30 text-white shadow-lg shadow-indigo-500/10"
                    : "bg-white/5 border-transparent text-slate-300 hover:bg-white/10 hover:text-white"
                }
                `
              }
            >
              <span className="font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* USER CARD */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500"></div>

          <div>
            <h3 className="font-semibold">Student</h3>

            <p className="text-sm text-slate-400">Active learner</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
