/**
 * StatCard — reusable metric widget
 *
 * Props:
 *  - title: string
 *  - value: string | number
 *  - sub: string (optional subtitle / change label)
 *  - trend: "up" | "down" | null
 *  - icon: JSX element (optional)
 *  - accent: "indigo" | "emerald" | "amber" | "rose" (default: "indigo")
 */

const accents = {
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    icon: "text-indigo-400",
    glow: "shadow-indigo-500/10",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: "text-emerald-400",
    glow: "shadow-emerald-500/10",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: "text-amber-400",
    glow: "shadow-amber-500/10",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    icon: "text-rose-400",
    glow: "shadow-rose-500/10",
  },
};

function StatCard({ title, value, sub, trend, icon, accent = "indigo" }) {
  const a = accents[accent] || accents.indigo;

  return (
    <div
      className={`relative bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 hover:bg-[#0f1830] transition-all duration-300 shadow-lg ${a.glow} overflow-hidden group`}
    >
      {/* subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex items-start justify-between">
        {/* Icon */}
        {icon && (
          <div
            className={`w-9 h-9 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center ${a.icon} flex-shrink-0`}
          >
            {icon}
          </div>
        )}
        {/* Trend badge */}
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trend === "up"
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-rose-400 bg-rose-500/10"
            }`}
          >
            {trend === "up" ? "↑" : "↓"} {sub}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
          {title}
        </p>
        <p className="text-3xl font-bold text-white mt-1.5 tracking-tight">
          {value}
        </p>
        {sub && !trend && (
          <p className="text-xs text-slate-500 mt-1.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

export default StatCard;
