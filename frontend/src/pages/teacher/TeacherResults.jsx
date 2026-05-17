import { useEffect, useState } from "react";
import api from "../../api/axios";

function TeacherResults() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedCourse, setSelectedCourse] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("name");

  useEffect(() => {
    fetchAnalytics();
  }, [selectedCourse, statusFilter, sortFilter]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (selectedCourse) params.append("course_id", selectedCourse);
      if (statusFilter) params.append("status", statusFilter);
      if (sortFilter) params.append("sort", sortFilter);

      const res = await api.get(`/cours/teacher-analytics/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch (err) {
      setError("Failed to load analytics.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center py-20 text-lg font-semibold">{error}</div>
    );
  }

  if (!analytics) return null;

  const { students, course_stats, total_students, passed_count, failed_count } = analytics;

  // Unique courses from course_stats for filter
  const courseOptions = course_stats || [];

  const passRate = total_students > 0 ? Math.round((passed_count / total_students) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          📊 Teacher Analytics
        </h1>
        <p className="text-slate-400 mt-2 text-base">
          Filter and analyze your students' performance across all courses.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: total_students, color: "indigo", icon: "👤" },
          { label: "Passed", value: passed_count, color: "emerald", icon: "✅" },
          { label: "Failed", value: failed_count, color: "rose", icon: "❌" },
          { label: "Pass Rate", value: `${passRate}%`, color: "amber", icon: "📈" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-[#0d1526] border border-white/10 rounded-2xl p-5 hover:border-indigo-500/30 transition-all"
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{card.label}</p>
            <p className={`text-3xl font-black mt-2 text-${card.color}-400`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* COURSE PERFORMANCE */}
      {courseOptions.length > 0 && (
        <div className="bg-[#0d1526] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-5">📚 Course Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {courseOptions.map((cs) => {
              const pct = cs.enrolled > 0 ? Math.round((cs.passed / cs.enrolled) * 100) : 0;
              return (
                <div
                  key={cs.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-indigo-500/30 transition-all cursor-pointer"
                  onClick={() => setSelectedCourse(cs.id === +selectedCourse ? "" : String(cs.id))}
                  style={{ outline: String(cs.id) === selectedCourse ? "2px solid #6366f1" : "none" }}
                >
                  <p className="text-white font-semibold truncate">{cs.titre}</p>
                  <div className="mt-3 space-y-1 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Enrolled</span>
                      <span className="text-white font-bold">{cs.enrolled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passed</span>
                      <span className="text-emerald-400 font-bold">{cs.passed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Score</span>
                      <span className="text-indigo-400 font-bold">{cs.average_score}%</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{pct}% pass rate</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-[#0d1526] border border-white/10 rounded-2xl p-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm font-medium">Course:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-[#111827] border border-white/10 text-white px-3 py-2 rounded-xl text-sm outline-none focus:border-indigo-500"
            >
              <option value="">All Courses</option>
              {courseOptions.map((cs) => (
                <option key={cs.id} value={cs.id}>{cs.titre}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#111827] border border-white/10 text-white px-3 py-2 rounded-xl text-sm outline-none focus:border-indigo-500"
            >
              <option value="">All</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm font-medium">Sort:</span>
            <select
              value={sortFilter}
              onChange={(e) => setSortFilter(e.target.value)}
              className="bg-[#111827] border border-white/10 text-white px-3 py-2 rounded-xl text-sm outline-none focus:border-indigo-500"
            >
              <option value="name">By Name</option>
              <option value="highest">Highest Score</option>
              <option value="lowest">Lowest Score</option>
            </select>
          </div>

          {(selectedCourse || statusFilter || sortFilter !== "name") && (
            <button
              onClick={() => { setSelectedCourse(""); setStatusFilter(""); setSortFilter("name"); }}
              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm hover:bg-red-500/20 transition"
            >
              ✕ Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* STUDENT TABLE */}
      <div className="bg-[#0d1526] border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Student Results</h2>
          <span className="text-slate-500 text-sm">{students.length} students</span>
        </div>

        {students.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-500 font-medium">No students found for the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-xs tracking-wider">
                  <th className="px-6 py-4 text-left">Student</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Course</th>
                  <th className="px-6 py-4 text-center">Score</th>
                  <th className="px-6 py-4 text-center">Progress</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition text-white">
                    <td className="px-6 py-4 font-semibold">
                      <div>{item.student_name || item.student}</div>
                      <div className="text-slate-500 text-xs font-normal">@{item.student}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{item.email}</td>
                    <td className="px-6 py-4 text-slate-300">{item.course}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`text-lg font-black ${
                          item.score >= 80 ? "text-emerald-400" :
                          item.score >= 50 ? "text-amber-400" : "text-rose-400"
                        }`}
                      >
                        {item.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden min-w-[60px]">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${item.progression}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{item.progression}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === "Passed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.certificate ? (
                        <span className="text-amber-400 text-lg" title="Certificate Earned">🏆</span>
                      ) : (
                        <span className="text-slate-700 text-lg">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherResults;
