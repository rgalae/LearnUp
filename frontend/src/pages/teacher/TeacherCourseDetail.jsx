import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  createContent,
  getTeacherCourseDetail,
} from "../../services/courseService";

function TeacherCourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);

  const [titre, setTitre] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [fichier, setFichier] = useState("");

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      const data = await getTeacherCourseDetail(id);

      setCourse(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createContent(id, {
        titre,
        video_url: videoUrl,
        fichier,
      });

      alert("Content added successfully");

      setTitre("");
      setVideoUrl("");
      setFichier("");

      fetchCourse();
    } catch (err) {
      console.log(err);

      alert("Failed to add content");
    }
  };

  if (!course) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">{course.titre}</h1>

        <p className="text-slate-400 mt-2">{course.description}</p>
      </div>

      <div className="bg-[#0d1526] border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">
          Add New Content
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Lesson title"
            className="w-full bg-[#09101f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
          />

          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Video URL"
            className="w-full bg-[#09101f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
          />

          <input
            type="text"
            value={fichier}
            onChange={(e) => setFichier(e.target.value)}
            placeholder="PDF/File URL"
            className="w-full bg-[#09101f] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-3 rounded-xl text-white"
          >
            Add Content
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Course Content</h2>

        {course.contenus.length === 0 ? (
          <div className="text-slate-500">No content yet</div>
        ) : (
          course.contenus.map((contenu) => (
            <div
              key={contenu.id}
              className="bg-[#0d1526] border border-white/10 rounded-2xl p-5"
            >
              <h3 className="text-lg font-semibold text-white">
                {contenu.titre}
              </h3>

              {contenu.video_url && (
                <a
                  href={contenu.video_url}
                  target="_blank"
                  className="text-indigo-400 block mt-3"
                >
                  Watch Video
                </a>
              )}

              {contenu.fichier && (
                <a
                  href={contenu.fichier}
                  target="_blank"
                  className="text-green-400 block mt-2"
                >
                  Open PDF/File
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TeacherCourseDetail;
