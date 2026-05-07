function Navbar() {
  return (
    <div className="h-20 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500" />
      </div>
    </div>
  );
}

export default Navbar;
