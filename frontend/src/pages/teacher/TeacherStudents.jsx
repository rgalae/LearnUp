import { useEffect, useState } from "react";
import api from "../../api/axios";

function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/cours/teacher-students/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">👨‍🎓 Enrolled Students</h1>
        <p className="text-slate-400 mt-2">
          All students enrolled in your courses — {students.length} total
        </p>
      </div>

      <div className="bg-[#0d1526] border border-white/10 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-4 px-6 py-4 border-b border-white/10 text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <div>Student</div>
          <div>Course</div>
          <div className="text-center">Score</div>
          <div className="text-right">Status</div>
        </div>

        {students.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No students enrolled yet.</div>
        ) : (
          students.map((s, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 px-6 py-4 border-b border-white/5 items-center hover:bg-white/[0.02] transition"
            >
              <div>
                <p className="text-white font-semibold">{s.student}</p>
                <p className="text-slate-500 text-xs">{s.email}</p>
              </div>
              <p className="text-slate-300 text-sm">{s.course}</p>
              <p className={`text-center font-bold ${s.score >= 80 ? "text-emerald-400" : s.score >= 50 ? "text-amber-400" : "text-rose-400"}`}>
                {s.score}%
              </p>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  s.status === "Passed"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  {s.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TeacherStudents;
