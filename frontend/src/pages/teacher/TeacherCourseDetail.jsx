import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  createContent,
  getTeacherCourseDetail,
} from "../../services/courseService";

import {
  createQuiz,
  createQuestion,
  createResponse,
} from "../../services/quizService";

function TeacherCourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);

  // =========================
  // CONTENT
  // =========================

  const [titre, setTitre] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [fichier, setFichier] = useState("");

  // =========================
  // QUIZ BUILDER
  // =========================

  const [quizTitle, setQuizTitle] = useState("");

  const emptyQuestion = {
    texte: "",
    type_question: "choix",
    correct_answer: "",
    responses: [
      {
        texte: "",
        est_correcte: true,
      },
    ],
  };

  const [questions, setQuestions] = useState([emptyQuestion]);

  useEffect(() => {
    fetchCourse();
  }, []);

  // =========================
  // FETCH COURSE
  // =========================

  const fetchCourse = async () => {
    try {
      const data = await getTeacherCourseDetail(id);

      setCourse(data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // ADD CONTENT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createContent(id, {
        titre,
        video_url: videoUrl,
        fichier,
      });

      setTitre("");
      setVideoUrl("");
      setFichier("");

      fetchCourse();
    } catch (err) {
      console.log(err);

      alert("Failed to add content");
    }
  };

  // =========================
  // QUESTION HANDLERS
  // =========================

  const handleQuestionChange = (questionIndex, field, value) => {
    const updated = [...questions];

    updated[questionIndex][field] = value;

    setQuestions(updated);
  };

  const handleResponseChange = (questionIndex, responseIndex, value) => {
    const updated = [...questions];

    updated[questionIndex].responses[responseIndex].texte = value;

    setQuestions(updated);
  };

  const handleCorrectAnswer = (questionIndex, responseIndex) => {
    const updated = [...questions];

    updated[questionIndex].responses = updated[questionIndex].responses.map(
      (response, index) => ({
        ...response,
        est_correcte: index === responseIndex,
      }),
    );

    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        texte: "",
        type_question: "choix",
        correct_answer: "",
        responses: [
          {
            texte: "",
            est_correcte: true,
          },
        ],
      },
    ]);
  };

  const removeQuestion = (questionIndex) => {
    const updated = questions.filter((_, index) => index !== questionIndex);

    setQuestions(updated);
  };

  const addOption = (questionIndex) => {
    const updated = [...questions];

    updated[questionIndex].responses.push({
      texte: "",
      est_correcte: false,
    });

    setQuestions(updated);
  };

  const removeOption = (questionIndex, responseIndex) => {
    const updated = [...questions];

    updated[questionIndex].responses = updated[questionIndex].responses.filter(
      (_, index) => index !== responseIndex,
    );

    setQuestions(updated);
  };

  // =========================
  // SAVE QUIZ
  // =========================

  const handleSaveQuiz = async () => {
    try {
      if (!quizTitle.trim()) {
        alert("Quiz title required");

        return;
      }

      // CREATE QUIZ

      const quizResponse = await createQuiz({
        cours_id: id,
        titre: quizTitle,
      });

      const quizId = quizResponse.quiz_id;

      // CREATE QUESTIONS

      for (const question of questions) {
        const questionResponse = await createQuestion({
          quiz_id: quizId,
          texte: question.texte,
          type_question: question.type_question,
          correct_answer: question.correct_answer,
        });

        const questionId = questionResponse.question_id;

        // MULTIPLE CHOICE RESPONSES

        if (question.type_question === "choix") {
          for (const response of question.responses) {
            if (!response.texte.trim()) continue;

            await createResponse({
              question_id: questionId,
              texte: response.texte,
              est_correcte: response.est_correcte,
            });
          }
        }
      }

      alert("Quiz saved successfully");

      // RESET

      setQuizTitle("");

      setQuestions([
        {
          texte: "",
          type_question: "choix",
          correct_answer: "",
          responses: [
            {
              texte: "",
              est_correcte: true,
            },
          ],
        },
      ]);
    } catch (err) {
      console.log(err.response?.data);

      alert("Failed to save quiz");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (!course) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-white">{course.titre}</h1>

        <p className="text-slate-400 mt-2">{course.description}</p>
      </div>

      {/* ADD CONTENT */}

      <div className="bg-[#0d1526] border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Add Course Content
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Lesson title"
            className="w-full bg-[#09101f] border border-white/10 rounded-xl px-4 py-3 text-white"
          />

          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Video URL"
            className="w-full bg-[#09101f] border border-white/10 rounded-xl px-4 py-3 text-white"
          />

          <input
            type="text"
            value={fichier}
            onChange={(e) => setFichier(e.target.value)}
            placeholder="PDF/File URL"
            className="w-full bg-[#09101f] border border-white/10 rounded-xl px-4 py-3 text-white"
          />

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-3 rounded-xl text-white"
          >
            Add Content
          </button>
        </form>
      </div>

      {/* QUIZ BUILDER */}

      <div className="bg-[#0d1526] border border-white/10 rounded-2xl p-6 space-y-8">
        <h2 className="text-3xl font-bold text-white">Quiz Builder</h2>

        {/* QUIZ TITLE */}

        <div>
          <label className="block text-white mb-2">Quiz Title</label>

          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter quiz title"
            className="w-full bg-[#09101f] border border-white/10 rounded-xl px-4 py-3 text-white"
          />
        </div>

        {/* QUESTIONS */}

        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            className="bg-[#09101f] border border-white/10 rounded-2xl p-6 space-y-5"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl text-white font-semibold">
                Question {qIndex + 1}
              </h3>

              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl text-white"
                >
                  Delete
                </button>
              )}
            </div>

            {/* QUESTION TEXT */}

            <input
              type="text"
              value={question.texte}
              onChange={(e) =>
                handleQuestionChange(qIndex, "texte", e.target.value)
              }
              placeholder="Question text"
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white"
            />

            {/* QUESTION TYPE */}

            <select
              value={question.type_question}
              onChange={(e) =>
                handleQuestionChange(qIndex, "type_question", e.target.value)
              }
              className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white"
            >
              <option value="choix">Multiple Choice</option>

              <option value="ouverte">Open Question</option>
            </select>

            {/* OPEN QUESTION */}

            {question.type_question === "ouverte" && (
              <input
                type="text"
                placeholder="Correct Answer"
                value={question.correct_answer}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "correct_answer", e.target.value)
                }
                className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white"
              />
            )}

            {/* MULTIPLE CHOICE */}

            {question.type_question === "choix" && (
              <div className="space-y-4">
                {question.responses.map((response, rIndex) => (
                  <div key={rIndex} className="flex gap-3">
                    <input
                      type="text"
                      value={response.texte}
                      onChange={(e) =>
                        handleResponseChange(qIndex, rIndex, e.target.value)
                      }
                      placeholder={`Option ${rIndex + 1}`}
                      className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white"
                    />

                    <button
                      type="button"
                      onClick={() => handleCorrectAnswer(qIndex, rIndex)}
                      className={`px-4 py-3 rounded-xl ${
                        response.est_correcte
                          ? "bg-green-600 text-white"
                          : "bg-[#1f2937] text-slate-300"
                      }`}
                    >
                      Correct
                    </button>

                    {question.responses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, rIndex)}
                        className="bg-red-600 hover:bg-red-500 px-4 py-3 rounded-xl text-white"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-3 rounded-xl text-white"
                >
                  Add Option
                </button>
              </div>
            )}
          </div>
        ))}

        {/* ACTIONS */}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl text-white"
          >
            Add Another Question
          </button>

          <button
            type="button"
            onClick={handleSaveQuiz}
            className="bg-emerald-600 hover:bg-emerald-500 px-5 py-3 rounded-xl text-white"
          >
            Save Entire Quiz
          </button>
        </div>
      </div>

      {/* CONTENT LIST */}

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
                  rel="noreferrer"
                  className="text-indigo-400 block mt-3"
                >
                  Watch Video
                </a>
              )}

              {contenu.fichier && (
                <a
                  href={contenu.fichier}
                  target="_blank"
                  rel="noreferrer"
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
