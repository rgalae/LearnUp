function TeacherResults() {
  const results = [
    {
      student: "Yassine",
      course: "React Advanced",
      score: "94%",
    },
    {
      student: "Salma",
      course: "Python DS",
      score: "88%",
    },
    {
      student: "Omar",
      course: "UI/UX",
      score: "79%",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Student Results</h1>

        <p className="text-slate-400 mt-2">
          Track student performance and quiz results.
        </p>
      </div>

      <div className="bg-[#0d1526] border border-white/10 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-3 px-6 py-4 border-b border-white/10 text-slate-400 text-sm font-medium">
          <span>Student</span>
          <span>Course</span>
          <span>Score</span>
        </div>

        {results.map((result, index) => (
          <div
            key={index}
            className="grid grid-cols-3 px-6 py-5 border-b border-white/5 last:border-none"
          >
            <span className="text-white">{result.student}</span>

            <span className="text-slate-300">{result.course}</span>

            <span className="text-emerald-400 font-semibold">
              {result.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherResults;
