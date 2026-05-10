import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import ProgressBar from "../../components/ui/ProgressBar";

import { getCourses } from "../../services/courseService";

function StudentCourses() {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();

      console.log(data);

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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">My Courses</h1>

        <p className="text-slate-500 text-sm mt-1">
          {courses.length} courses available
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map((course) => (
          <Link
            to={`/student/courses/${course.id}`}
            key={course.id}
            className="bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5 hover:border-indigo-500 transition-all"
          >
            <h3 className="text-lg font-semibold text-white">{course.titre}</h3>

            <p className="text-sm text-slate-400 mt-2">{course.description}</p>

            <p className="text-xs text-indigo-400 mt-4">
              Teacher: {course.enseignant}
            </p>

            <div className="mt-5">
              <ProgressBar label="Progress" value={0} color="indigo" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StudentCourses;
