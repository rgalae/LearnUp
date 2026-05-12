import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { getTeacherCourses, deleteCourse } from "../../services/courseService";

function TeacherCourses() {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getTeacherCourses();

      setCourses(data);
    } catch (err) {
      console.log(err);

      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?",
    );

    if (!confirmed) return;

    try {
      await deleteCourse(courseId);

      setCourses((prev) => prev.filter((course) => course.id !== courseId));

      alert("Course deleted successfully");
    } catch (err) {
      console.log(err);

      alert("Failed to delete course");
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
          <div
            key={course.id}
            className="bg-[#0d1526] border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition"
          >
            <Link to={`/teacher/courses/${course.id}`} className="block">
              <h2 className="text-xl font-semibold text-white">
                {course.titre}
              </h2>

              <p className="text-slate-400 mt-3">{course.description}</p>

              <p className="text-indigo-400 text-sm mt-4">
                Teacher: {course.enseignant}
              </p>
            </Link>

            <div className="flex gap-3 mt-6">
              <Link
                to={`/teacher/courses/${course.id}`}
                className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-xl text-white text-sm"
              >
                Manage
              </Link>

              <button
                onClick={() => handleDelete(course.id)}
                className="bg-red-600 hover:bg-red-500 transition px-4 py-2 rounded-xl text-white text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherCourses;
