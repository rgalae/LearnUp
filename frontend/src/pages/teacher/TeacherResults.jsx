function TeacherResults() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white">Teacher Results</h1>

        <p className="text-gray-400 mt-2">
          Track student grades and quiz performance.
        </p>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-3xl p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Recent Results
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-800 pb-3">
            <span>React Quiz</span>
            <span className="text-green-400">87%</span>
          </div>

          <div className="flex justify-between border-b border-gray-800 pb-3">
            <span>Python Assignment</span>
            <span className="text-yellow-400">74%</span>
          </div>

          <div className="flex justify-between">
            <span>UI/UX Test</span>
            <span className="text-indigo-400">91%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherResults;
