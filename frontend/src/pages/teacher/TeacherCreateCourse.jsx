import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { createCourse } from "../../services/courseService";

function TeacherCreateCourse() {
  const navigate = useNavigate();

  const [titre, setTitre] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      await createCourse({
        titre,
        description,
      });

      navigate("/teacher/courses");
    } catch (err) {
      console.log(err);

      setError("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Create Course</h1>

        <p className="text-slate-400 mt-2">Add a new course for students.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#0d1526] border border-white/10 rounded-2xl p-6 space-y-5"
      >
        {error && <div className="text-red-400 text-sm">{error}</div>}

        <div>
          <label className="block text-sm text-slate-300 mb-2">
            Course Title
          </label>

          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Enter course title"
            className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">
            Description
          </label>

          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter course description"
            className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 rounded-xl text-white"
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}

export default TeacherCreateCourse;
