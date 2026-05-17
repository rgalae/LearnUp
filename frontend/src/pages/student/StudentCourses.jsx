import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import ProgressBar from "../../components/ui/ProgressBar";

import { getMyCourses, getProgress } from "../../services/courseService";

function StudentCourses() {
  const [courses, setCourses] = useState([]);

  const [progressions, setProgressions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const coursesData = await getMyCourses();

      const progressData = await getProgress();

      setCourses(coursesData);

      setProgressions(progressData);
    } catch (err) {
      console.log(err);

      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollCourse(courseId);

      fetchData();

      alert("Enrollment successful");
    } catch (err) {
      console.log(err);

      alert("Already enrolled or failed");
    }
  };

  const getCourseProgress = (courseTitle) => {
    const progress = progressions.find((p) => p.cours === courseTitle);

    return progress ? progress.progression : 0;
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
          <div
            key={course.id}
            className="bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5 hover:border-indigo-500 transition-all cursor-pointer group"
            onClick={() => window.location.href = `/student/courses/${course.id}`}
          >
            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition">{course.titre}</h3>

            <p className="text-sm text-slate-400 mt-2 line-clamp-2">{course.description}</p>

            <p className="text-xs text-indigo-400 mt-4">
              Teacher: {course.enseignant}
            </p>

            <div className="mt-5 flex gap-3">
              <Link
                to={`/student/courses/${course.id}`}
                className="border border-white/10 px-4 py-2 rounded-xl text-white text-sm hover:bg-white/5 transition"
                onClick={(e) => e.stopPropagation()}
              >
                Open
              </Link>
            </div>

            <div className="mt-5">
              <ProgressBar
                label="Progress"
                value={getCourseProgress(course.titre)}
                color="indigo"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentCourses;
