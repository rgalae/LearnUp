function RecentActivity() {
  const activities = [
    "Completed Python Basics Quiz",
    "Downloaded JavaScript PDF",
    "Enrolled in React Course",
    "Earned HTML Certificate",
  ];

  return (
    <div
      className="
        bg-white/5
        border border-white/10
        rounded-3xl
        backdrop-blur-xl
        p-6
      "
    >
      <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="
              flex items-center gap-4
              bg-white/5
              rounded-2xl
              p-4
            "
          >
            <div className="w-3 h-3 rounded-full bg-indigo-400"></div>

            <p className="text-slate-300">{activity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;
