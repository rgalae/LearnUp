function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_40%)]" />

      <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">{title}</h1>

          <p className="text-gray-400">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
