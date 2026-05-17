import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseDetail, completeContent } from "../../services/courseService";
import { API_URL } from "../../api/axios";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);

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
      fetchCourse();
    } catch (err) {
      console.log(err);
      alert("Failed to complete lesson");
    }
  };

  if (loading) return <div className="text-white text-center py-20 animate-pulse">Loading course content...</div>;
  if (!course) return <div className="text-red-400 text-center py-20">Course not found or access denied.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* LEFT: COURSE INFO & MODULE LIST */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-[#0d1526] border border-white/10 rounded-3xl p-8 shadow-xl">
          <Link to="/student/courses" className="text-indigo-400 hover:text-indigo-300 transition flex items-center gap-2 text-sm font-medium mb-4">
            <i className="fas fa-arrow-left"></i> My Courses
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">{course.titre}</h1>
          <div className="flex items-center gap-2 mt-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs text-white font-bold">
              {course.enseignant?.[0]}
            </div>
            <p className="text-slate-400 text-sm">Instructor: <span className="text-slate-200">{course.enseignant}</span></p>
          </div>
          
          <div className="mt-8 space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span>Your Progress</span>
              <span>{Math.round(course.progress)}%</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-1000"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-[#0d1526] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Course Syllabus</h2>
          </div>
          <div className="divide-y divide-white/5">
            {course.modules?.map((module, idx) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(idx)}
                className={`w-full text-left p-6 transition-all hover:bg-white/5 flex items-center gap-4 ${activeModule === idx ? 'bg-indigo-600/10 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${activeModule === idx ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-slate-500'}`}>
                  {idx + 1}
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${activeModule === idx ? 'text-white' : 'text-slate-400'}`}>{module.titre}</h3>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">
                    {module.contenus?.length || 0} LESSONS • {module.quizzes?.length || 0} QUIZ
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: MODULE CONTENT DETAIL */}
      <div className="lg:w-2/3 space-y-8">
        {course.modules?.[activeModule] ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-gradient-to-br from-[#111827] to-[#0d1526] border border-white/10 rounded-3xl p-10 shadow-2xl">
              <span className="bg-indigo-500/10 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                Currently Viewing: Module {activeModule + 1}
              </span>
              <h2 className="text-4xl font-extrabold text-white mb-4">{course.modules[activeModule].titre}</h2>
              <p className="text-slate-400 text-lg leading-relaxed">{course.modules[activeModule].description || "Dive into this module to master these topics."}</p>
            </div>

            {/* LESSONS IN ACTIVE MODULE */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white px-2">Lessons</h3>
              {course.modules[activeModule].contenus?.length === 0 ? (
                <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-8 text-center text-slate-500 italic">
                  No lessons added to this module yet.
                </div>
              ) : (
                course.modules[activeModule].contenus.map((lesson) => (
                  <div key={lesson.id} className="bg-[#0d1526] border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-indigo-500/30 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${lesson.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400 group-hover:scale-110'}`}>
                        <i className={`fas ${lesson.completed ? 'fa-check-circle' : (lesson.video_url ? 'fa-play-circle' : 'fa-file-alt')}`}></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{lesson.titre}</h4>
                        <div className="flex gap-4 mt-1">
                          {lesson.video_url && <span className="text-xs text-slate-500"><i className="fas fa-video mr-1"></i> Video</span>}
                          {lesson.fichier && <span className="text-xs text-slate-500"><i className="fas fa-paperclip mr-1"></i> Document</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      {lesson.video_url && (
                        <a href={lesson.video_url} target="_blank" rel="noreferrer" className="flex-1 md:flex-none text-center bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border border-white/10">
                          Watch
                        </a>
                      )}
                      {lesson.fichier && (
                        <a 
                          href={lesson.fichier.startsWith('http') ? lesson.fichier : `${API_URL}${lesson.fichier}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex-1 md:flex-none text-center bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border border-white/10"
                        >
                          Read
                        </a>
                      )}
                      {!lesson.completed && (
                        <button onClick={() => handleComplete(lesson.id)} className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* QUIZZES IN ACTIVE MODULE */}
            {course.modules[activeModule].quizzes?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white px-2">Knowledge Checks</h3>
                {course.modules[activeModule].quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-2xl text-purple-400">
                        <i className="fas fa-brain"></i>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white">{quiz.titre}</h4>
                        <p className="text-slate-400 mt-1">Test your knowledge for this module.</p>
                      </div>
                    </div>
                    <Link to={`/student/quiz/${quiz.id}`} className="w-full md:w-auto bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-2xl font-extrabold shadow-xl shadow-purple-600/30 transition-all text-center active:scale-95">
                      TAKE QUIZ
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-slate-500">
            <i className="fas fa-book-open text-6xl mb-6 opacity-20"></i>
            <p className="text-xl font-medium">Select a module from the sidebar to start learning.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
