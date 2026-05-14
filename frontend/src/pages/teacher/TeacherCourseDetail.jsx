import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  createModule,
  deleteModule,
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

  // Module state
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");

  // Content Form state
  const [activeModuleIdForContent, setActiveModuleIdForContent] = useState(null);
  const [titre, setTitre] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [fichier, setFichier] = useState("");

  // Quiz Form state
  const [activeModuleIdForQuiz, setActiveModuleIdForQuiz] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");
  
  const emptyQuestion = {
    texte: "",
    type_question: "choix",
    correct_answer: "",
    responses: [{ texte: "", est_correcte: true }],
  };
  const [questions, setQuestions] = useState([emptyQuestion]);

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

  // =========================
  // MODULES
  // =========================

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      await createModule({ cours_id: id, titre: moduleTitle, description: moduleDesc });
      setModuleTitle("");
      setModuleDesc("");
      setShowModuleForm(false);
      fetchCourse();
    } catch (err) {
      console.log(err);
      alert("Failed to create module");
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Delete this module and all its contents?")) return;
    try {
      await deleteModule(moduleId);
      fetchCourse();
    } catch (err) {
      console.log(err);
      alert("Failed to delete module");
    }
  };

  // =========================
  // ADD CONTENT
  // =========================

  const handleAddContent = async (e) => {
    e.preventDefault();
    try {
      await createContent(activeModuleIdForContent, { titre, video_url: videoUrl, fichier });
      setTitre("");
      setVideoUrl("");
      setFichier("");
      setActiveModuleIdForContent(null);
      fetchCourse();
    } catch (err) {
      console.log(err);
      alert("Failed to add content");
    }
  };

  // =========================
  // QUIZ BUILDER
  // =========================

  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  const handleResponseChange = (qIndex, rIndex, value) => {
    const updated = [...questions];
    updated[qIndex].responses[rIndex].texte = value;
    setQuestions(updated);
  };

  const handleCorrectAnswer = (qIndex, rIndex) => {
    const updated = [...questions];
    updated[qIndex].responses = updated[qIndex].responses.map((res, idx) => ({
      ...res,
      est_correcte: idx === rIndex,
    }));
    setQuestions(updated);
  };

  const addQuestion = () => setQuestions([...questions, emptyQuestion]);
  
  const removeQuestion = (qIndex) => setQuestions(questions.filter((_, i) => i !== qIndex));

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].responses.push({ texte: "", est_correcte: false });
    setQuestions(updated);
  };

  const removeOption = (qIndex, rIndex) => {
    const updated = [...questions];
    updated[qIndex].responses = updated[qIndex].responses.filter((_, i) => i !== rIndex);
    setQuestions(updated);
  };

  const handleSaveQuiz = async () => {
    try {
      if (!quizTitle.trim()) {
        alert("Quiz title required");
        return;
      }
      const quizRes = await createQuiz({ module_id: activeModuleIdForQuiz, titre: quizTitle });
      const quizId = quizRes.quiz_id;

      for (const question of questions) {
        const qRes = await createQuestion({
          quiz_id: quizId,
          texte: question.texte,
          type_question: question.type_question,
          correct_answer: question.correct_answer,
        });

        if (question.type_question === "choix") {
          for (const response of question.responses) {
            if (!response.texte.trim()) continue;
            await createResponse({
              question_id: qRes.question_id,
              texte: response.texte,
              est_correcte: response.est_correcte,
            });
          }
        }
      }

      alert("Quiz saved successfully");
      setQuizTitle("");
      setQuestions([emptyQuestion]);
      setActiveModuleIdForQuiz(null);
      fetchCourse();
    } catch (err) {
      console.log(err.response?.data);
      alert("Failed to save quiz");
    }
  };

  if (!course) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* HEADER */}
      <div className="bg-[#0d1526] border border-white/10 rounded-2xl p-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">{course.titre}</h1>
          <p className="text-slate-400 mt-2 text-lg">{course.description}</p>
        </div>
        <button
          onClick={() => setShowModuleForm(!showModuleForm)}
          className="bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 rounded-xl text-white font-semibold shadow-lg shadow-indigo-500/20"
        >
          {showModuleForm ? "Cancel Module" : "+ New Module"}
        </button>
      </div>

      {/* NEW MODULE FORM */}
      {showModuleForm && (
        <div className="bg-[#111827] border border-indigo-500/30 rounded-2xl p-6 animate-fade-in shadow-xl shadow-black/50">
          <h2 className="text-xl font-bold text-white mb-4">Create New Module</h2>
          <form onSubmit={handleAddModule} className="space-y-4">
            <input
              type="text"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="Module Title (e.g., Week 1: Introduction)"
              className="w-full bg-[#09101f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
              required
            />
            <textarea
              value={moduleDesc}
              onChange={(e) => setModuleDesc(e.target.value)}
              placeholder="Module Description (Optional)"
              className="w-full bg-[#09101f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition min-h-[100px]"
            />
            <div className="flex justify-end">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-white font-medium">
                Save Module
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODULES LIST */}
      <div className="space-y-6">
        {course.modules?.length === 0 ? (
          <div className="text-center py-12 bg-[#0d1526] rounded-2xl border border-white/5">
            <p className="text-slate-400 text-lg">No modules found. Create your first module to get started!</p>
          </div>
        ) : (
          course.modules?.map((module, index) => (
            <div key={module.id} className="bg-[#0d1526] border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/20">
              <div className="p-6 bg-[#0f192d] border-b border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg text-sm">Module {index + 1}</span>
                    {module.titre}
                  </h3>
                  {module.description && <p className="text-slate-400 mt-2">{module.description}</p>}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setActiveModuleIdForContent(activeModuleIdForContent === module.id ? null : module.id)} className="px-4 py-2 bg-[#1f2937] hover:bg-[#374151] text-white rounded-lg transition text-sm">
                    + Lesson
                  </button>
                  <button onClick={() => setActiveModuleIdForQuiz(activeModuleIdForQuiz === module.id ? null : module.id)} className="px-4 py-2 bg-[#1f2937] hover:bg-[#374151] text-white rounded-lg transition text-sm">
                    + Quiz
                  </button>
                  <button onClick={() => handleDeleteModule(module.id)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition text-sm">
                    Delete
                  </button>
                </div>
              </div>

              {/* MODULE CONTENT */}
              <div className="p-6 space-y-4">
                {module.contenus?.length === 0 && module.quizzes?.length === 0 && (
                  <p className="text-slate-500 italic">No content in this module yet.</p>
                )}

                {module.contenus?.map((contenu) => (
                  <div key={contenu.id} className="flex justify-between items-center bg-[#09101f] p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <i className="fas fa-play"></i>
                      </div>
                      <span className="text-white font-medium">{contenu.titre}</span>
                    </div>
                  </div>
                ))}

                {module.quizzes?.map((quiz) => (
                  <div key={quiz.id} className="flex justify-between items-center bg-[#09101f] p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <i className="fas fa-question-circle"></i>
                      </div>
                      <span className="text-white font-medium">{quiz.titre}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD LESSON FORM (INLINE) */}
              {activeModuleIdForContent === module.id && (
                <div className="border-t border-white/10 p-6 bg-[#09101f]">
                  <h4 className="text-lg font-semibold text-white mb-4">Add Lesson to {module.titre}</h4>
                  <form onSubmit={handleAddContent} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Lesson Title" className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white" required />
                    <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Video URL" className="bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white" />
                    <div className="flex gap-4">
                      <input type="text" value={fichier} onChange={(e) => setFichier(e.target.value)} placeholder="PDF/File URL" className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white" />
                      <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-white whitespace-nowrap">Save</button>
                    </div>
                  </form>
                </div>
              )}

              {/* ADD QUIZ FORM (INLINE) */}
              {activeModuleIdForQuiz === module.id && (
                <div className="border-t border-white/10 p-6 bg-[#09101f] space-y-6">
                  <h4 className="text-lg font-semibold text-white mb-2">Quiz Builder</h4>
                  <div>
                    <input type="text" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="Enter quiz title" className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white" />
                  </div>
                  {questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-[#111827] border border-white/10 rounded-xl p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">Question {qIndex + 1}</span>
                        {questions.length > 1 && (
                          <button onClick={() => removeQuestion(qIndex)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                        )}
                      </div>
                      <input type="text" value={q.texte} onChange={(e) => handleQuestionChange(qIndex, "texte", e.target.value)} placeholder="Question text" className="w-full bg-[#1f2937] border border-white/5 rounded-lg px-4 py-3 text-white" />
                      <select value={q.type_question} onChange={(e) => handleQuestionChange(qIndex, "type_question", e.target.value)} className="w-full bg-[#1f2937] border border-white/5 rounded-lg px-4 py-3 text-white">
                        <option value="choix">Multiple Choice</option>
                        <option value="ouverte">Open Question</option>
                      </select>
                      
                      {q.type_question === "ouverte" && (
                        <input type="text" placeholder="Correct Answer" value={q.correct_answer} onChange={(e) => handleQuestionChange(qIndex, "correct_answer", e.target.value)} className="w-full bg-[#1f2937] border border-white/5 rounded-lg px-4 py-3 text-white" />
                      )}

                      {q.type_question === "choix" && (
                        <div className="space-y-3 pl-4 border-l-2 border-white/10">
                          {q.responses.map((res, rIndex) => (
                            <div key={rIndex} className="flex gap-3">
                              <input type="text" value={res.texte} onChange={(e) => handleResponseChange(qIndex, rIndex, e.target.value)} placeholder={`Option ${rIndex + 1}`} className="flex-1 bg-[#1f2937] border border-white/5 rounded-lg px-4 py-2 text-white" />
                              <button onClick={() => handleCorrectAnswer(qIndex, rIndex)} className={`px-4 py-2 rounded-lg text-sm ${res.est_correcte ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-[#374151] text-slate-300"}`}>Correct</button>
                              {q.responses.length > 1 && (
                                <button onClick={() => removeOption(qIndex, rIndex)} className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg">X</button>
                              )}
                            </div>
                          ))}
                          <button onClick={() => addOption(qIndex)} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">+ Add Option</button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4">
                    <button onClick={addQuestion} className="text-indigo-400 hover:text-indigo-300 font-medium bg-indigo-500/10 px-4 py-2 rounded-lg">+ Add Question</button>
                    <button onClick={handleSaveQuiz} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl text-white font-medium">Save Quiz to Module</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TeacherCourseDetail;
