function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  return (
    <div className="h-20 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-500" />

        <button
          onClick={handleLogout}
          className="
            px-4 py-2
            rounded-xl
            bg-red-500/20
            border border-red-500/20
            hover:bg-red-500/30
            transition
            text-sm
          "
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
