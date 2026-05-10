import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";

import { getCourseDetail, completeContent } from "../../services/courseService";

function CourseDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const data = await getCourseDetail(id);

      console.log(data);

      setCourse(data);
    } catch (err) {
      console.log(err);

      setError("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (contenuId) => {
    try {
      await completeContent(contenuId);

      fetchCourse();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <div className="text-white">Loading course...</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Button variant="ghost" className="mb-2" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-white">{course.titre}</h1>

        <p className="text-slate-400 mt-3">{course.description}</p>
      </div>

      <div className="mt-6">
        <Link
          to={`/student/quiz/${course.id}`}
          className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-3 rounded-xl text-white inline-block"
        >
          Start Quiz
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Course Content</h2>

        {course.contenus.length === 0 ? (
          <div className="text-slate-500">No content yet</div>
        ) : (
          course.contenus.map((contenu) => (
            <div
              key={contenu.id}
              className="bg-[#0d1526] border border-white/[0.06] rounded-2xl p-5"
            >
              <h3 className="text-white font-medium">{contenu.titre}</h3>

              {contenu.video_url && (
                <a
                  href={contenu.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 text-sm block mt-3"
                >
                  Watch Video
                </a>
              )}

              {contenu.fichier && (
                <a
                  href={contenu.fichier}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-400 text-sm block mt-2"
                >
                  Download File
                </a>
              )}

              <button
                onClick={() => handleComplete(contenu.id)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-xl text-white text-sm"
              >
                {contenu.completed ? "Completed ✓" : "Mark as Completed"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
