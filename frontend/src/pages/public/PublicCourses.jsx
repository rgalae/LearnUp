import { useEffect, useState } from "react";

import { getCourses, enrollCourse } from "../../services/courseService";

function PublicCourses() {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();

      setCourses(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollCourse(courseId);

      alert("Successfully enrolled in course");
    } catch (err) {
      console.log(err);

      alert("Enrollment failed");
    }
  };

  const role = localStorage.getItem("role");

  if (loading) {
    return (
      <div className="text-white text-center py-10">Loading courses...</div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white">Explore Courses</h1>

        <p className="text-slate-400 mt-4 text-lg">
          Discover courses created by our teachers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-[#0d1526] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-indigo-500/30 transition"
          >
            <div>
              <h2 className="text-3xl font-bold text-white">{course.titre}</h2>

              <p className="text-slate-400 mt-4 text-lg">
                {course.description}
              </p>

              <p className="text-indigo-400 text-sm mt-6">
                Teacher: {course.enseignant}
              </p>
            </div>

            {role === "student" && (
              <button
                onClick={() => handleEnroll(course.id)}
                className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500 transition py-3 rounded-xl text-white font-medium"
              >
                Enroll Now
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicCourses;
