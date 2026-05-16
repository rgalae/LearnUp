import {
  getCourses,
  getMyCourses,
  enrollCourse,
  unenrollCourse,
} from "../../services/courseService";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import StatCard from "../../components/ui/StatCard";
import ProgressBar from "../../components/ui/ProgressBar";

import { getStudentDashboardData } from "../../services/dashboardService";

function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  const [courses, setCourses] = useState([]);

  const [searchedCourses, setSearchedCourses] = useState([]);

  const [hasSearched, setHasSearched] = useState(false);

  const [myCourses, setMyCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getStudentDashboardData();

      const allCourses = await getCourses();

      const enrolledCourses = await getMyCourses();

      setDashboardData(data);

      setCourses(allCourses);

      setSearchedCourses(allCourses);

      setMyCourses(enrolledCourses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = (courseId) => {
    return myCourses.some((c) => c.id === courseId);
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollCourse(courseId);

      fetchDashboard();

      alert("Enrollment successful");
    } catch (err) {
      console.log(err);

      alert("Failed to enroll");
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      await unenrollCourse(courseId);

      fetchDashboard();

      alert("Unenrolled successfully");
    } catch (err) {
      console.log(err);

      alert("Failed to unenroll");
    }
  };

  const handleSearch = () => {
    const trimmedSearch = searchTerm.trim().toLowerCase();

    if (!trimmedSearch) {
      setSearchedCourses(courses);

      setHasSearched(false);

      return;
    }

    const filtered = courses.filter(
      (course) =>
        course.titre.toLowerCase().includes(trimmedSearch) ||
        course.description.toLowerCase().includes(trimmedSearch) ||
        course.enseignant.toLowerCase().includes(trimmedSearch),
    );

    setSearchedCourses(filtered);

    setHasSearched(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading) {
    return <div className="text-white text-2xl">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return (
      <div className="text-red-400 text-2xl">Failed to load dashboard</div>
    );
  }

  const stats = [
    {
      title: "Enrolled Courses",
      value: String(dashboardData.total_courses || 0),
      sub: "Your active courses",
      accent: "indigo",
    },

    {
      title: "Completed Courses",
      value: String(dashboardData.completed_courses || 0),
      sub: "Finished successfully",
      accent: "emerald",
    },

    {
      title: "Average Progress",
      value: `${dashboardData.average_progress || 0}%`,
      sub: "Overall learning progress",
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>

        <p className="text-slate-400 mt-2">Track your courses and progress</p>
      </div>

      {/* SEARCH + AVAILABLE COURSES */}
      <div className="bg-[#0d1526] border border-white/10 rounded-3xl p-8">
        {/* SEARCH BAR */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search courses and press Enter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-[#111827] border border-white/10 text-white px-4 py-3 rounded-2xl outline-none focus:border-indigo-500 w-full"
          />
        </div>

        <h2 className="text-2xl font-bold text-white mb-8">
          Available Courses
        </h2>

        {courses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">No available courses yet.</p>
          </div>
        ) : hasSearched && searchedCourses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              No course found with the name "{searchTerm}"
            </p>

            <p className="text-slate-600 text-sm mt-2">
              Try another search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {searchedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#111827] border border-white/[0.06] rounded-2xl p-5 hover:border-indigo-500/30 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition">
                    {course.titre}
                  </h3>

                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                    {course.description}
                  </p>

                  <p className="text-xs text-indigo-400 mt-4">
                    Teacher: {course.enseignant}
                  </p>
                </div>

                <div className="mt-5 flex gap-3">
                  {isEnrolled(course.id) ? (
                    <>
                      <Link
                        to={`/student/courses/${course.id}`}
                        className="flex-1 border border-white/10 px-4 py-2 rounded-xl text-white text-sm text-center hover:bg-white/5"
                      >
                        Open
                      </Link>

                      <button
                        onClick={() => handleUnenroll(course.id)}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition px-4 py-2 rounded-xl text-sm font-medium border border-red-500/20"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-xl text-white text-sm font-bold"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            sub={stat.sub}
            accent={stat.accent}
          />
        ))}
      </div>

      {/* PROGRESS */}
      <div className="bg-[#0d1526] border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-white mb-8">Course Progress</h2>

        {dashboardData.courses?.length > 0 ? (
          <div className="space-y-6">
            {dashboardData.courses.map((course, index) => (
              <ProgressBar
                key={index}
                label={course.titre}
                value={course.progression}
                color="indigo"
              />
            ))}
          </div>
        ) : (
          <div className="text-slate-500">No course progress yet</div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
