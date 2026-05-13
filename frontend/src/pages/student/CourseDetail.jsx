import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";

import { getCourseDetail, completeContent } from "../../services/courseService";

function CourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const data = await getCourseDetail(id);

      setCourse(data);
    } catch (err) {
      console.log(err);

      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (contenuId) => {
    try {
      await completeContent(contenuId);

      alert("Lesson completed successfully");

      fetchCourse();
    } catch (err) {
      console.log(err);

      alert("Failed to complete lesson");
    }
  };

  if (loading) {
    return <div className="text-white text-2xl">Loading...</div>;
  }

  if (!course) {
    return <div className="text-red-400 text-2xl">Course not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}

      <div className="bg-[#0d1526] border border-white/10 rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-white">{course.titre}</h1>

        <p className="text-slate-400 mt-4 text-lg">{course.description}</p>

        <p className="text-indigo-400 mt-5">Teacher: {course.enseignant}</p>
      </div>

      {/* LESSONS */}

      <div className="space-y-5">
        <h2 className="text-2xl font-bold text-white">Course Lessons</h2>

        {course.contenus?.map((contenu) => (
          <div
            key={contenu.id}
            className="bg-[#0d1526] border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white">
              {contenu.titre}
            </h3>

            <div className="flex flex-wrap gap-4 mt-5">
              {contenu.video_url && (
                <a
                  href={contenu.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-3 rounded-xl text-white"
                >
                  Watch Video
                </a>
              )}

              {contenu.fichier && (
                <a
                  href={contenu.fichier}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 transition px-5 py-3 rounded-xl text-white"
                >
                  Open File
                </a>
              )}

              <button
                onClick={() => handleComplete(contenu.id)}
                className="bg-yellow-500 hover:bg-yellow-400 transition px-5 py-3 rounded-xl text-black font-semibold"
              >
                Mark Complete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QUIZ SECTION */}

      {course.quiz_exists && (
        <div className="bg-[#0d1526] border border-white/10 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Course Quiz</h2>

          <p className="text-slate-400 mb-6">
            Complete the quiz to validate your learning.
          </p>

          <Link
            to={`/student/quiz/${course.id}`}
            className="inline-block bg-indigo-600 hover:bg-indigo-500 transition px-6 py-4 rounded-2xl text-white font-semibold"
          >
            Start Quiz
          </Link>
        </div>
      )}
    </div>
  );
}
export default CourseDetail;
