import { useEffect, useState } from "react";

import StatCard from "../../components/ui/StatCard";
import ProgressBar from "../../components/ui/ProgressBar";

import { getStudentDashboardData } from "../../services/dashboardService";

function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getStudentDashboardData();

      console.log(data);

      setDashboardData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-2xl">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return (
      <div className="text-red-400 text-2xl">Failed to load dashboard</div>
    );
  }

  const stats = [
    {
      title: "Enrolled Courses",
      value: String(dashboardData.total_courses || 0),
      sub: "Your active courses",
      accent: "indigo",
    },

    {
      title: "Completed Courses",
      value: String(dashboardData.completed_courses || 0),
      sub: "Finished successfully",
      accent: "emerald",
    },

    {
      title: "Average Progress",
      value: `${dashboardData.average_progress || 0}%`,
      sub: "Overall learning progress",
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>

        <p className="text-slate-400 mt-2">Track your courses and progress</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            sub={stat.sub}
            accent={stat.accent}
          />
        ))}
      </div>

      {/* PROGRESS */}
      <div className="bg-[#0d1526] border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-8">Course Progress</h2>

        {dashboardData.progress?.length > 0 ? (
          <div className="space-y-6">
            {dashboardData.progress.map((item, index) => (
              <ProgressBar
                key={index}
                label={item.cours}
                value={item.progression}
                color="indigo"
              />
            ))}
          </div>
        ) : (
          <div className="text-slate-500">No course progress yet</div>
        )}
      </div>
    </div>
  );
}
export default StudentDashboard;
