/**
 * ActivityFeed — recent activity list widget
 *
 * Props:
 *  - items: Array<{ label: string, time?: string, type?: "success"|"info"|"warning" }>
 *  - title: string (default: "Recent Activity")
 */

const dot = {
  success: "bg-emerald-400",
  info: "bg-indigo-400",
  warning: "bg-amber-400",
};

function ActivityFeed({ title = "Recent Activity", items = [] }) {
  return (
    <div className="bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5 overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-6">
          No recent activity
        </p>
      ) : (
        <div className="space-y-1">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot[item.type || "info"]}`}
              />
              <p className="text-sm text-slate-300 flex-1 leading-snug">
                {item.label}
              </p>
              {item.time && (
                <span className="text-xs text-slate-600 flex-shrink-0">
                  {item.time}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;
