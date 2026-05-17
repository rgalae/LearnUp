import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import StatCard from "../../components/ui/StatCard";

import ProgressBar from "../../components/ui/ProgressBar";

import { getTeacherDashboardData } from "../../services/dashboardService";

function TeacherDashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getTeacherDashboardData();

      console.log(data);

      setDashboard(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center py-10">Loading dashboard...</div>
    );
  }

  const stats = [
    {
      title: "Total Students",
      value: dashboard.students_count,
      sub: "Students enrolled",
      accent: "indigo",
    },
    {
      title: "Active Courses",
      value: dashboard.courses_count,
      sub: "Courses created",
      accent: "emerald",
    },
    {
      title: "Average Score",
      value: `${dashboard.avg_score}%`,
      sub: "Student performance",
      accent: "amber",
    },
    {
      title: "Quizzes Created",
      value: dashboard.quizzes_count,
      sub: "Total quizzes",
      accent: "rose",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-white">
          Good morning, Teacher 👋
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Here's an overview of your platform.
        </p>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COURSES */}

        <div className="lg:col-span-2 bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-white">Your Courses</h3>

            <span className="text-xs text-slate-500">
              Real course statistics
            </span>
          </div>

          {dashboard.courses.length === 0 ? (
            <div className="text-slate-500">No courses created yet</div>
          ) : (
            <div className="space-y-5">
              {dashboard.courses.map((course) => (
                <div key={course.id}>
                  <ProgressBar
                    label={course.titre}
                    value={course.students * 10}
                    color="indigo"
                  />

                  <p className="text-xs text-slate-500 mt-1">
                    {course.students} students enrolled
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}

        <div className="bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-5">
            Quick Actions
          </h3>

          <div className="space-y-3">
            <Link
              to="/teacher/create-course"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all duration-200 text-sm font-medium"
            >
              ➕ Create New Course
            </Link>

            <Link
              to="/teacher/courses"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all duration-200 text-sm font-medium"
            >
              📚 Manage Courses
            </Link>

            <Link
              to="/teacher/students"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all duration-200 text-sm font-medium"
            >
              👨‍🎓 View Students
            </Link>

            <Link
              to="/teacher/results"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-all duration-200 text-sm font-medium"
            >
              📄 View Results
            </Link>
          </div>
        </div>
      </div>

      {/* COURSES TABLE */}

      <div className="bg-[#0d1526] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.05]">
          <h3 className="text-sm font-semibold text-white">Course Overview</h3>
        </div>

        {dashboard.courses.length === 0 ? (
          <div className="p-5 text-slate-500">No course data available</div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {dashboard.courses.map((course, index) => (
              <div
                key={course.id}
                className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 text-sm">{index + 1}</span>

                  <div>
                    <p className="text-white font-medium">{course.titre}</p>

                    <p className="text-xs text-slate-500">
                      {course.students} students enrolled
                    </p>
                  </div>
                </div>

                <Link
                  to={`/teacher/courses/${course.id}`}
                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  Open →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
