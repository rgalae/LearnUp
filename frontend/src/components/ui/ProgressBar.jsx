/**
 * ProgressBar — reusable progress indicator
 *
 * Props:
 *  - label: string
 *  - value: number (0-100)
 *  - color: "indigo" | "emerald" | "amber" | "rose" (default: "indigo")
 *  - showPercent: boolean (default: true)
 */

const colors = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-400",
  rose: "bg-rose-500",
};

function ProgressBar({
  label,
  value = 0,
  color = "indigo",
  showPercent = true,
}) {
  const pct = Math.min(100, Math.max(0, value));
  const bar = colors[color] || colors.indigo;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-300 font-medium">{label}</span>
        {showPercent && (
          <span className="text-slate-400 text-xs tabular-nums">{pct}%</span>
        )}
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full ${bar} rounded-full transition-all duration-700 ease-out relative`}
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-0 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
