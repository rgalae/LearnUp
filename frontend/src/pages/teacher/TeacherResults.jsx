import { useEffect, useState } from "react";

import { getTeacherResults } from "../../services/courseService";

function TeacherResults() {
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const data = await getTeacherResults();

      setResults(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center py-10">Loading results...</div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Teacher Results</h1>

        <p className="text-slate-400 mt-3">
          Student grades and course performance
        </p>
      </div>

      <div className="bg-[#0d1526] border border-white/10 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-4 px-8 py-6 border-b border-white/10 text-slate-400 font-medium">
          <div>Student</div>
          <div>Course</div>
          <div>Score</div>
          <div>GPA</div>
        </div>

        {results.length > 0 ? (
          results.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-4 px-8 py-6 border-b border-white/5 text-white items-center"
            >
              <div>{item.student}</div>

              <div>{item.course}</div>

              <div className="text-emerald-400 font-semibold">
                {item.score}%
              </div>

              <div className="text-indigo-400 font-semibold">{item.gpa}</div>
            </div>
          ))
        ) : (
          <div className="px-8 py-10 text-slate-500">
            No student results yet
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherResults;
