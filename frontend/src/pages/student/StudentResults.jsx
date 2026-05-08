function StudentResults() {
  return (
    <div>
      <h1 className="text-5xl font-black mb-8">Results</h1>

      <div className="space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between">
          <span>React Quiz</span>
          <span className="font-bold text-green-400">85%</span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between">
          <span>Python Exam</span>
          <span className="font-bold text-green-400">91%</span>
        </div>
      </div>
    </div>
  );
}

export default StudentResults;
