import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getCourses } from "../../services/courseService";

function TeacherCourses() {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();

      setCourses(data);
    } catch (err) {
      console.log(err);

      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center py-10">Loading courses...</div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center py-10">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Teacher Courses</h1>

          <p className="text-slate-400 mt-2">Manage your created courses.</p>
        </div>

        <Link
          to="/teacher/create-course"
          className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-3 rounded-xl text-white"
        >
          Create Course
        </Link>
      </div>

      <div className="grid gap-5">
        {courses.map((course) => (
          <Link
            to={`/teacher/courses/${course.id}`}
            key={course.id}
            className="bg-[#0d1526] border border-white/10 rounded-2xl p-6 block hover:border-indigo-500/30 transition"
          >
            <h2 className="text-xl font-semibold text-white">{course.titre}</h2>

            <p className="text-slate-400 mt-3">{course.description}</p>

            <p className="text-indigo-400 text-sm mt-4">
              Teacher: {course.enseignant}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TeacherCourses;
