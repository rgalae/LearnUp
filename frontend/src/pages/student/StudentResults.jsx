import { useEffect, useState } from "react";
import api from "../../api/axios";

function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/users/student-results/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (coursId) => {
    setDownloading(coursId);
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/cours/certificat/${coursId}/pdf/`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate_${coursId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert(
        "Failed to download certificate. You may need a score ≥ 80% to qualify.",
      );
    } finally {
      setDownloading(null);
    }
  };

  const total = results.length;
  const passed = results.filter((r) => r.note >= 80).length;
  const withCerts = results.filter((r) => r.has_certificate).length;
  const average =
    total > 0
      ? (results.reduce((acc, r) => acc + r.note, 0) / total).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">
            Loading your achievements...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      {/* HEADER */}
      <div>
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          Academic Performance
        </h1>
        <p className="text-slate-400 mt-4 text-lg">
          Detailed breakdown of your course achievements, quiz scores, and
          certificates.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Enrolled Courses",
            value: total,
            color: "indigo",
            icon: "📚",
          },
          { label: "Passed", value: passed, color: "emerald", icon: "✅" },
          {
            label: "Overall Average",
            value: `${average}%`,
            color: "amber",
            icon: "📊",
          },
          {
            label: "Certificates",
            value: withCerts,
            color: "rose",
            icon: "🏆",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#0d1526] border border-white/10 rounded-2xl p-6 shadow-xl hover:border-indigo-500/30 transition-all"
          >
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
              {s.label}
            </p>
            <h2 className={`text-4xl font-black mt-3 text-${s.color}-400`}>
              {s.value}
            </h2>
          </div>
        ))}
      </div>

      {/* COURSE RESULTS */}
      <div className="bg-[#0d1526] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white">Course Achievements</h2>
        </div>

        <div className="divide-y divide-white/5">
          {results.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5">
                <span className="text-4xl">🎓</span>
              </div>
              <p className="text-slate-500 font-medium text-lg">
                No results yet.
              </p>
              <p className="text-slate-600 text-sm mt-2">
                Enroll in a course and complete a quiz to see your performance
                here!
              </p>
            </div>
          ) : (
            results.map((result, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 hover:bg-white/[0.02] transition group gap-6"
              >
                {/* LEFT: Course Info */}
                <div className="space-y-3 flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition truncate">
                    {result.cours}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        result.note >= 80
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : result.note >= 50
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {result.grade}
                    </span>
                    {result.has_certificate && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        🏆 Certified
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        result.status === "Passed"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : result.status === "In Progress"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[200px]">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                        style={{ width: `${result.progression || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {result.progression || 0}% progress
                    </span>
                  </div>

                  {result.completion_date && (
                    <p className="text-xs text-slate-500">
                      Certified on {result.completion_date}
                    </p>
                  )}
                </div>

                {/* RIGHT: Score + Actions */}
                <div className="mt-2 md:mt-0 flex flex-col md:items-end gap-4">
                  <div className="flex flex-row md:flex-col items-baseline md:items-end gap-2">
                    <span
                      className={`text-4xl font-black ${
                        result.note >= 80
                          ? "text-emerald-400"
                          : result.note >= 50
                            ? "text-amber-400"
                            : "text-rose-400"
                      }`}
                    >
                      {result.note}%
                    </span>
                    <span className="text-slate-500 text-xs font-medium uppercase">
                      Final Score
                    </span>
                  </div>

                  {result.note >= 80 && result.progression >= 100 && (
                    <button
                      onClick={() => downloadCertificate(result.cours_id)}
                      disabled={downloading === result.cours_id}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
                    >
                      {downloading === result.cours_id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <span>🏅</span>
                          Download Certificate
                        </>
                      )}
                    </button>
                  )}

                  {result.note < 80 && result.note > 0 && (
                    <div className="text-xs text-slate-600 text-center md:text-right max-w-[160px]">
                      Need {80 - result.note}% more to earn a certificate
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CERTIFICATE NOTE */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <p className="text-white font-semibold mb-1">
              How to earn a Certificate
            </p>
            <p className="text-slate-400 text-sm">
              Complete all course content and score{" "}
              <strong className="text-indigo-400">80% or higher</strong> on the
              quiz. Certificates are generated automatically and include a
              unique Certificate ID for verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentResults;
