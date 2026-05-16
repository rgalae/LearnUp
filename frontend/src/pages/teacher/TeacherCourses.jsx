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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-[#0d1526] border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-all cursor-pointer group flex flex-col justify-between"
            onClick={() => window.location.href = `/teacher/courses/${course.id}`}
          >
            <div>
              <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition">
                {course.titre}
              </h2>

              <p className="text-slate-400 mt-3 line-clamp-3">{course.description}</p>

              <div className="flex gap-4 mt-6">
                 <span className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">
                    <i className="fas fa-user-tie mr-1"></i> {course.enseignant}
                 </span>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Link
                to={`/teacher/courses/${course.id}`}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2.5 rounded-xl text-white text-sm font-bold text-center"
                onClick={(e) => e.stopPropagation()}
              >
                Manage
              </Link>

              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(course.id); }}
                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition px-4 py-2.5 rounded-xl text-sm font-bold border border-red-500/20"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherCourses;
