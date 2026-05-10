import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCourses } from "../../services/courseService";

function PublicCourses() {
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
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">
        Loading courses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold">Explore Courses</h1>

          <p className="text-slate-400 mt-4 text-lg">
            Discover courses created by our teachers
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center">
            <p className="text-slate-400 text-lg">No courses available yet</p>

            <p className="text-slate-500 mt-4">
              Create an account to start learning when courses become available.
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <Link
                to="/register"
                className="bg-indigo-500 hover:bg-indigo-400 transition px-6 py-3 rounded-2xl text-white font-medium"
              >
                Register
              </Link>

              <Link
                to="/login"
                className="border border-white/10 hover:border-indigo-400 transition px-6 py-3 rounded-2xl text-white"
              >
                Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-[#111827] border border-white/10 rounded-3xl p-6"
              >
                <h2 className="text-2xl font-semibold">{course.titre}</h2>

                <p className="text-slate-400 mt-3">{course.description}</p>

                <p className="text-indigo-400 mt-5 text-sm">
                  Teacher: {course.enseignant}
                </p>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-slate-300 mb-4">
                    Want full access to this course?
                  </p>

                  <div className="flex gap-4">
                    <Link
                      to="/register"
                      className="bg-indigo-500 hover:bg-indigo-400 transition px-5 py-3 rounded-2xl font-medium"
                    >
                      Register
                    </Link>

                    <Link
                      to="/login"
                      className="border border-white/10 hover:border-indigo-400 transition px-5 py-3 rounded-2xl"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicCourses;
