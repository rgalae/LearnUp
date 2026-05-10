import { useLocation } from "react-router-dom";

import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";

function DashboardLayout({ children }) {
  const location = useLocation();

  const role = location.pathname.startsWith("/teacher") ? "teacher" : "student";

  return (
    <div className="flex bg-[#0B1120] text-white min-h-screen">
      <Sidebar role={role} />

      <div className="flex-1 flex flex-col">
        <Navbar role={role} />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
