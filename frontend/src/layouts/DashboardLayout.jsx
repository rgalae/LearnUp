import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";

function DashboardLayout({ children }) {
  return (
    <div className="flex bg-[#0B1120] text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
