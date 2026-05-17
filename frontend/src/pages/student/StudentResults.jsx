import { useEffect, useState } from "react";
import api from "../../api/axios";

function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get("/users/student-results/");
      setResults(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const total = results.length;
  const passed = results.filter((r) => r.note >= 50).length;
  const average = total > 0 ? (results.reduce((acc, r) => acc + r.note, 0) / total).toFixed(1) : 0;

  if (loading) {
    return <div className="text-white text-center py-20 animate-pulse">Loading your achievements...</div>;
  }

  const downloadCertificate = async (coursId) => {
    try {
      const response = await api.get(`/cours/certificat/${coursId}/pdf/`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `certificate_${coursId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert("Failed to download certificate");
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      <div>
        <h1 className="text-5xl font-extrabold text-white tracking-tight">Academic Performance</h1>
        <p className="text-slate-400 mt-4 text-lg">Detailed breakdown of your course achievements and quiz scores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0d1526] border border-white/10 rounded-3xl p-8 shadow-xl">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Total Courses</p>
          <h2 className="text-5xl font-black mt-4 text-white">{total}</h2>
        </div>

        <div className="bg-[#0d1526] border border-white/10 rounded-3xl p-8 shadow-xl">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Passed</p>
          <h2 className="text-5xl font-black mt-4 text-emerald-400">{passed}</h2>
        </div>

        <div className="bg-[#0d1526] border border-white/10 rounded-3xl p-8 shadow-xl">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Overall Average</p>
          <h2 className="text-5xl font-black mt-4 text-indigo-400">{average}%</h2>
        </div>
      </div>

      <div className="bg-[#0d1526] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white">Course Achievements</h2>
        </div>

        <div className="divide-y divide-white/5">
          {results.length === 0 ? (
            <div className="p-20 text-center">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-trophy text-slate-700 text-2xl"></i>
               </div>
               <p className="text-slate-500 font-medium">No results found yet. Complete a quiz to see your performance here!</p>
            </div>
          ) : (
            results.map((result, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 hover:bg-white/[0.02] transition group"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition">{result.cours}</h3>
                  <div className="flex items-center gap-3">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${result.note >= 50 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {result.grade}
                     </span>
                  </div>
                </div>

                <div className="mt-6 md:mt-0 flex flex-col md:items-end gap-4 w-full md:w-auto">
                  <div className="flex flex-row md:flex-col items-baseline md:items-end gap-2">
                    <span className="text-3xl font-black text-white">{result.note}%</span>
                    <span className="text-slate-500 text-xs font-medium uppercase">Final Score</span>
                  </div>

                  {result.note >= 80 && (
                    <button
                      onClick={() => downloadCertificate(result.cours_id)}
                      className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white transition-all px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                      <i className="fas fa-award"></i>
                      Download Certificate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentResults;
