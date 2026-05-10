function TeacherCourses() {
  const courses = [
    {
      id: 1,
      title: "React Advanced",
      students: 42,
      completion: "78%",
      status: "Active",
    },
    {
      id: 2,
      title: "Python for Data Science",
      students: 31,
      completion: "64%",
      status: "Active",
    },
    {
      id: 3,
      title: "UI/UX Fundamentals",
      students: 19,
      completion: "91%",
      status: "Completed",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Teacher Courses</h1>

        <p className="text-slate-400 mt-2">
          Manage your created courses and track student progress.
        </p>
      </div>

      <div className="grid gap-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-[#0d1526] border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {course.title}
                </h2>

                <p className="text-slate-400 mt-2">
                  {course.students} students enrolled
                </p>
              </div>

              <span className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm">
                {course.status}
              </span>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Completion Rate</span>

                <span className="text-white">{course.completion}</span>
              </div>

              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: course.completion }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherCourses;
