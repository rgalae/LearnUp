import { useEffect, useState } from "react";

import { getTeacherStudents } from "../../services/dashboardService";

function TeacherStudents() {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getTeacherStudents();

      setStudents(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center py-10">Loading students...</div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Students</h1>

        <p className="text-slate-400 mt-2">
          Real enrolled students from your courses
        </p>
      </div>

      <div className="bg-[#111827] border border-white/10 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-5 p-5 border-b border-white/10 text-slate-400">
          <p>Student</p>

          <p>Course</p>

          <p>Progress</p>

          <p>Score</p>

          <p>Status</p>
        </div>

        {students.length === 0 ? (
          <div className="p-6 text-slate-400">No students enrolled yet</div>
        ) : (
          students.map((student, index) => (
            <div
              key={index}
              className="grid grid-cols-5 p-5 border-b border-white/5 items-center"
            >
              <p className="text-white font-medium">{student.student}</p>

              <p className="text-slate-300">{student.course}</p>

              <p className="text-indigo-400">{student.progress}%</p>

              <p className="text-green-400">{student.score}%</p>

              <p
                className={
                  student.status === "Passed"
                    ? "text-green-400"
                    : "text-yellow-400"
                }
              >
                {student.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TeacherStudents;
