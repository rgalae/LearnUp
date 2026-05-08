function StudentCourses() {
  return (
    <div>
      <h1 className="text-5xl font-black mb-8">My Courses</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-2">React Course</h2>
          <p className="text-slate-400">Frontend Development</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-2">Python Course</h2>
          <p className="text-slate-400">Backend Development</p>
        </div>
      </div>
    </div>
  );
}

export default StudentCourses;
