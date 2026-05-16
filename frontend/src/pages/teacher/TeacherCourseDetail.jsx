import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  createModule,
  updateModule,
  deleteModule,
  createContent,
  updateContent,
  deleteContent,
  reorderModules,
  reorderContent,
  getTeacherCourseDetail,
} from "../../services/courseService";

import {
  createQuiz,
  createQuestion,
  createResponse,
} from "../../services/quizService";
import { API_URL } from "../../api/axios";

function TeacherCourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleForm, setModuleForm] = useState({ titre: "", description: "" });

  const [activeModuleIdForContent, setActiveModuleIdForContent] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [contentForm, setContentForm] = useState({ titre: "", video_url: "", fichier: null });

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
  }, [id]);

  const fetchCourse = async () => {
    try {
      const data = await getTeacherCourseDetail(id);
      setCourse(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // MODULES
  // =========================

  const handleSaveModule = async (e) => {
    e.preventDefault();
    try {
      if (editingModule) {
        await updateModule(editingModule.id, moduleForm);
      } else {
        await createModule({ cours_id: id, ...moduleForm });
      }
      setModuleForm({ titre: "", description: "" });
      setEditingModule(null);
      setShowModuleForm(false);
      fetchCourse();
    } catch (err) {
      console.log(err);
      alert("Failed to save module");
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

  const moveModule = async (index, direction) => {
    const newModules = [...course.modules];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newModules.length) return;

    [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
    
    const reorderData = newModules.map((m, i) => ({ id: m.id, order: i }));
    try {
      await reorderModules({ modules: reorderData });
      fetchCourse();
    } catch (err) {
      alert("Failed to reorder modules");
    }
  };

  // =========================
  // CONTENT (LESSONS)
  // =========================

  const handleSaveContent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titre", contentForm.titre);
    formData.append("video_url", contentForm.video_url);
    if (contentForm.fichier instanceof File) {
      formData.append("fichier", contentForm.fichier);
    }

    try {
      if (editingContent) {
        await updateContent(editingContent.id, formData);
      } else {
        await createContent(activeModuleIdForContent, formData);
      }
      setContentForm({ titre: "", video_url: "", fichier: null });
      setEditingContent(null);
      setActiveModuleIdForContent(null);
      fetchCourse();
    } catch (err) {
      alert("Failed to save content");
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      await deleteContent(contentId);
      fetchCourse();
    } catch (err) {
      alert("Failed to delete content");
    }
  };

  const moveContent = async (module, index, direction) => {
    const newContent = [...module.contenus];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newContent.length) return;

    [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]];
    
    const reorderData = newContent.map((c, i) => ({ id: c.id, order: i }));
    try {
      await reorderContent(module.id, { contents: reorderData });
      fetchCourse();
    } catch (err) {
      alert("Failed to reorder content");
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
      if (!quizTitle.trim()) return alert("Quiz title required");
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
      alert("Failed to save quiz");
    }
  };

  if (loading) return <div className="text-white p-10 text-center animate-pulse">Loading course data...</div>;
  if (!course) return <div className="text-white p-10 text-center">Course not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4">
      {/* GLASS HEADER */}
      <div className="relative overflow-hidden bg-[#0d1526]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-black/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link to="/teacher/courses" className="text-indigo-400 hover:text-indigo-300 transition flex items-center gap-2 text-sm font-medium">
                <i className="fas fa-arrow-left"></i> Back to Courses
              </Link>
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight">{course.titre}</h1>
            <p className="text-slate-400 text-lg max-w-2xl">{course.description}</p>
            <div className="flex gap-4 pt-4">
              <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full text-sm font-medium">
                <i className="fas fa-user-graduate mr-2"></i>{course.students} Students
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-sm font-medium">
                <i className="fas fa-star mr-2"></i>{course.average_score}% Avg. Score
              </span>
            </div>
          </div>
          <button
            onClick={() => { setEditingModule(null); setModuleForm({ titre: "", description: "" }); setShowModuleForm(!showModuleForm); }}
            className="group bg-indigo-600 hover:bg-indigo-500 transition-all px-8 py-4 rounded-2xl text-white font-bold shadow-xl shadow-indigo-600/20 flex items-center gap-2 active:scale-95"
          >
            <i className={`fas ${showModuleForm ? 'fa-times' : 'fa-plus'} group-hover:rotate-90 transition-transform`}></i>
            {showModuleForm ? "Cancel" : "Add Module"}
          </button>
        </div>
      </div>

      {/* MODULE FORM */}
      {showModuleForm && (
        <div className="bg-[#111827] border border-indigo-500/30 rounded-3xl p-8 animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <i className="fas fa-folder-plus text-indigo-400"></i>
            {editingModule ? "Edit Module" : "Create New Module"}
          </h2>
          <form onSubmit={handleSaveModule} className="space-y-6">
            <div className="space-y-2">
              <label className="text-slate-400 text-sm font-medium ml-1">Module Title</label>
              <input
                type="text"
                value={moduleForm.titre}
                onChange={(e) => setModuleForm({...moduleForm, titre: e.target.value})}
                placeholder="e.g., Module 1: Foundations of Design"
                className="w-full bg-[#09101f] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition shadow-inner"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-400 text-sm font-medium ml-1">Description (Optional)</label>
              <textarea
                value={moduleForm.description}
                onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                placeholder="What will students learn in this module?"
                className="w-full bg-[#09101f] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition min-h-[120px] shadow-inner"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => setShowModuleForm(false)} className="px-6 py-3 text-slate-400 hover:text-white transition font-medium">Discard</button>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-2xl text-white font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                {editingModule ? "Update Module" : "Save Module"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODULES LIST */}
      <div className="space-y-8">
        {course.modules?.length === 0 ? (
          <div className="text-center py-20 bg-[#0d1526]/50 rounded-3xl border border-dashed border-white/10">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-layer-group text-3xl text-indigo-400"></i>
            </div>
            <h3 className="text-xl font-bold text-white">No modules yet</h3>
            <p className="text-slate-500 mt-2">Start by creating your first module to structure your course.</p>
          </div>
        ) : (
          course.modules?.map((module, mIndex) => (
            <div key={module.id} className="group/module bg-[#0d1526] border border-white/10 rounded-3xl overflow-hidden transition-all hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5">
              {/* MODULE BAR */}
              <div className="p-8 bg-gradient-to-r from-[#0f192d] to-[#0d1526] border-b border-white/5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div className="flex flex-col gap-1 opacity-0 group-hover/module:opacity-100 transition-opacity">
                    <button onClick={() => moveModule(mIndex, -1)} className="text-slate-500 hover:text-indigo-400"><i className="fas fa-chevron-up"></i></button>
                    <button onClick={() => moveModule(mIndex, 1)} className="text-slate-500 hover:text-indigo-400"><i className="fas fa-chevron-down"></i></button>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Module {mIndex + 1}</span>
                      <h3 className="text-2xl font-bold text-white">{module.titre}</h3>
                    </div>
                    {module.description && <p className="text-slate-400 mt-2 line-clamp-2">{module.description}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setActiveModuleIdForContent(activeModuleIdForContent === module.id ? null : module.id); setEditingContent(null); }} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all text-sm font-semibold border border-white/10 flex items-center gap-2">
                    <i className="fas fa-plus text-indigo-400"></i> Lesson
                  </button>
                  <button onClick={() => { setActiveModuleIdForQuiz(activeModuleIdForQuiz === module.id ? null : module.id); }} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all text-sm font-semibold border border-white/10 flex items-center gap-2">
                    <i className="fas fa-plus text-purple-400"></i> Quiz
                  </button>
                  <div className="w-[1px] h-10 bg-white/5 mx-2 hidden lg:block" />
                  <button onClick={() => { setEditingModule(module); setModuleForm({titre: module.titre, description: module.description}); setShowModuleForm(true); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDeleteModule(module.id)} className="p-2.5 text-red-500/50 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>

              {/* LESSONS & QUIZZES */}
              <div className="p-8 space-y-4 bg-[#09101f]/30">
                {module.contenus?.length === 0 && module.quizzes?.length === 0 && !activeModuleIdForContent && !activeModuleIdForQuiz && (
                  <div className="text-center py-6">
                    <p className="text-slate-600 italic">No content yet. Click "+ Lesson" or "+ Quiz" to add materials.</p>
                  </div>
                )}

                {/* LESSONS LIST */}
                {module.contenus?.map((contenu, cIndex) => (
                  <div key={contenu.id} className="group/item flex items-center justify-between bg-[#09101f] p-5 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="flex flex-col gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button onClick={() => moveContent(module, cIndex, -1)} className="text-slate-600 hover:text-indigo-400 text-xs"><i className="fas fa-chevron-up"></i></button>
                        <button onClick={() => moveContent(module, cIndex, 1)} className="text-slate-600 hover:text-indigo-400 text-xs"><i className="fas fa-chevron-down"></i></button>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/5">
                        <i className={`fas ${contenu.video_url ? 'fa-play' : 'fa-file-alt'}`}></i>
                      </div>
                      <div>
                        <span className="text-white font-bold block">{contenu.titre}</span>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-slate-500 text-xs flex items-center gap-2">
                            {contenu.video_url ? <><i className="fas fa-video"></i> Video Lesson</> : <><i className="fas fa-file"></i> Document</>}
                          </span>
                          {contenu.fichier && (
                            <a 
                              href={contenu.fichier.startsWith('http') ? contenu.fichier : `${API_URL}${contenu.fichier}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-indigo-400 hover:text-indigo-300 text-xs font-bold transition-all"
                            >
                              <i className="fas fa-external-link-alt mr-1"></i> View File
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all translate-x-2 group-hover/item:translate-x-0">
                      <button onClick={() => { setEditingContent(contenu); setContentForm({titre: contenu.titre, video_url: contenu.video_url, fichier: null}); setActiveModuleIdForContent(module.id); }} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <i className="fas fa-pen text-xs"></i>
                      </button>
                      <button onClick={() => handleDeleteContent(contenu.id)} className="p-2 text-red-500/40 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all">
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                ))}

                {/* QUIZZES LIST */}
                {module.quizzes?.map((quiz) => (
                  <div key={quiz.id} className="group/item flex items-center justify-between bg-[#09101f] p-5 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/5">
                        <i className="fas fa-question-circle"></i>
                      </div>
                      <div>
                        <span className="text-white font-bold block">{quiz.titre}</span>
                        <span className="text-slate-500 text-xs flex items-center gap-2 mt-1">
                          <i className="fas fa-tasks"></i> Interactive Quiz
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all">
                       <span className="text-slate-600 text-xs italic px-3 py-1 bg-white/5 rounded-lg">View only</span>
                    </div>
                  </div>
                ))}

                {/* INLINE FORMS */}
                {activeModuleIdForContent === module.id && (
                  <div className="mt-6 bg-[#111827] border border-indigo-500/20 rounded-2xl p-6 animate-in zoom-in-95 duration-200">
                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <i className="fas fa-plus-circle text-indigo-400"></i>
                      {editingContent ? `Editing: ${editingContent.titre}` : `Add Lesson to ${module.titre}`}
                    </h4>
                    <form onSubmit={handleSaveContent} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" value={contentForm.titre} onChange={(e) => setContentForm({...contentForm, titre: e.target.value})} placeholder="Lesson Title" className="bg-[#09101f] border border-white/10 rounded-xl px-5 py-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none" required />
                        <input type="text" value={contentForm.video_url} onChange={(e) => setContentForm({...contentForm, video_url: e.target.value})} placeholder="Video URL (optional)" className="bg-[#09101f] border border-white/10 rounded-xl px-5 py-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                      </div>
                      <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="w-full relative">
                          <input type="file" id={`file-${module.id}`} onChange={(e) => setContentForm({...contentForm, fichier: e.target.files[0]})} className="hidden" />
                          <label htmlFor={`file-${module.id}`} className="w-full flex items-center justify-center gap-3 bg-[#09101f] border border-dashed border-white/20 rounded-xl px-5 py-3 text-slate-400 cursor-pointer hover:border-indigo-500/50 hover:text-slate-200 transition-all">
                            <i className="fas fa-cloud-upload-alt text-indigo-400"></i>
                            {contentForm.fichier ? contentForm.fichier.name : "Upload PDF/Document"}
                          </label>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <button type="button" onClick={() => { setActiveModuleIdForContent(null); setEditingContent(null); }} className="px-6 py-3 text-slate-400 hover:text-white transition">Cancel</button>
                          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl text-white font-bold flex-1 md:flex-none">Save Lesson</button>
                        </div>
                      </div>
                    </form>
                  </div>
                )}

                {/* QUIZ BUILDER */}
                {activeModuleIdForQuiz === module.id && (
                  <div className="mt-6 bg-[#111827] border border-purple-500/20 rounded-2xl p-8 animate-in zoom-in-95 duration-300 space-y-8">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xl font-bold text-white flex items-center gap-3">
                        <i className="fas fa-vial text-purple-400"></i> Quiz Builder
                      </h4>
                      <button onClick={() => setActiveModuleIdForQuiz(null)} className="text-slate-500 hover:text-white"><i className="fas fa-times"></i></button>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-slate-400 text-xs font-bold uppercase tracking-wider ml-1">Quiz Title</label>
                        <input type="text" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="e.g., Final Assessment" className="w-full bg-[#09101f] border border-white/10 rounded-xl px-6 py-4 text-white focus:ring-1 focus:ring-purple-500 outline-none" />
                      </div>
                      
                      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                        {questions.map((q, qIndex) => (
                          <div key={qIndex} className="bg-[#09101f] border border-white/10 rounded-2xl p-6 space-y-5 relative group/q">
                            <div className="flex justify-between items-center">
                              <span className="bg-purple-500/10 text-purple-400 px-4 py-1 rounded-lg text-sm font-bold">Question {qIndex + 1}</span>
                              <button onClick={() => removeQuestion(qIndex)} className="text-red-500/40 hover:text-red-400 transition-all"><i className="fas fa-trash-alt"></i></button>
                            </div>
                            <input type="text" value={q.texte} onChange={(e) => handleQuestionChange(qIndex, "texte", e.target.value)} placeholder="Enter the question text..." className="w-full bg-[#111827] border border-white/5 rounded-xl px-5 py-4 text-white focus:border-purple-500 transition outline-none" />
                            
                            <div className="flex gap-4">
                              <button onClick={() => handleQuestionChange(qIndex, "type_question", "choix")} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${q.type_question === 'choix' ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/20' : 'bg-[#111827] text-slate-500 border-white/5 hover:border-white/20'}`}>Multiple Choice</button>
                              <button onClick={() => handleQuestionChange(qIndex, "type_question", "ouverte")} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${q.type_question === 'ouverte' ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-600/20' : 'bg-[#111827] text-slate-500 border-white/5 hover:border-white/20'}`}>Open Question</button>
                            </div>
                            
                            {q.type_question === "ouverte" ? (
                              <input type="text" placeholder="Type the correct answer..." value={q.correct_answer} onChange={(e) => handleQuestionChange(qIndex, "correct_answer", e.target.value)} className="w-full bg-[#111827] border border-white/5 rounded-xl px-5 py-4 text-white font-medium italic" />
                            ) : (
                              <div className="space-y-3 pl-4 border-l-2 border-white/5">
                                {q.responses.map((res, rIndex) => (
                                  <div key={rIndex} className="flex gap-3 animate-in slide-in-from-left-2 duration-200">
                                    <input type="text" value={res.texte} onChange={(e) => handleResponseChange(qIndex, rIndex, e.target.value)} placeholder={`Option ${rIndex + 1}`} className="flex-1 bg-[#111827] border border-white/5 rounded-xl px-5 py-3 text-white" />
                                    <button onClick={() => handleCorrectAnswer(qIndex, rIndex)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${res.est_correcte ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-500 hover:bg-white/10"}`}>{res.est_correcte ? "Correct" : "Set Correct"}</button>
                                    <button onClick={() => removeOption(qIndex, rIndex)} className="p-3 text-red-500/30 hover:text-red-400"><i className="fas fa-times"></i></button>
                                  </div>
                                ))}
                                <button onClick={() => addOption(qIndex)} className="text-purple-400 hover:text-purple-300 text-sm font-bold mt-2 flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-purple-500/5 w-fit transition-all">+ Add Answer Option</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10">
                        <button onClick={addQuestion} className="w-full md:w-auto px-8 py-3 text-purple-400 hover:text-white border border-purple-400/30 hover:bg-purple-400/10 rounded-xl font-bold transition-all">+ Add New Question</button>
                        <button onClick={handleSaveQuiz} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 px-12 py-4 rounded-2xl text-white font-extrabold shadow-xl shadow-emerald-600/20 active:scale-95 transition-all uppercase tracking-wider">Complete & Save Quiz</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TeacherCourseDetail;
