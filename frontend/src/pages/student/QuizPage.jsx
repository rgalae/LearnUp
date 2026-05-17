import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { getQuiz, submitQuiz } from "../../services/quizService.js";

function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { score, progression, certificate }

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const data = await getQuiz(quizId);
      setQuiz(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId, reponseId) => {
    const filtered = answers.filter((a) => a.question_id !== questionId);
    setAnswers([...filtered, { question_id: questionId, reponse_id: reponseId }]);
  };

  const handleTextAnswer = (questionId, text) => {
    const filtered = answers.filter((a) => a.question_id !== questionId);
    setAnswers([...filtered, { question_id: questionId, texte_reponse: text }]);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const data = await submitQuiz({ quiz_id: quiz.quiz_id, answers });
      setResult(data);
    } catch (err) {
      const msg =
        err?.response?.data?.error || "Failed to submit quiz. Please try again.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-red-400 text-center py-10 text-lg font-semibold">
        Quiz not found.
      </div>
    );
  }

  const score = result?.score;
  const passed = score !== null && score >= 80;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
      >
        ← Back
      </button>

      {/* QUIZ HEADER */}
      <div className="bg-[#0d1526] border border-white/10 rounded-2xl p-6">
        <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Quiz</p>
        <h1 className="text-3xl font-extrabold text-white">{quiz.titre}</h1>
        <p className="text-slate-400 mt-2">
          {quiz.questions?.length || 0} question{quiz.questions?.length !== 1 ? "s" : ""}
          {" · "}Answer all questions, then submit.
        </p>
      </div>

      {/* RESULT BANNER */}
      {result !== null && (
        <div
          className={`rounded-2xl p-8 border space-y-5 ${
            passed
              ? "bg-emerald-900/20 border-emerald-500/30"
              : "bg-rose-900/20 border-rose-500/30"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`text-5xl w-20 h-20 flex items-center justify-center rounded-2xl ${
                passed ? "bg-emerald-500/20" : "bg-rose-500/20"
              }`}
            >
              {passed ? "🎉" : "😔"}
            </div>
            <div>
              <h2 className={`text-3xl font-black ${passed ? "text-emerald-300" : "text-rose-300"}`}>
                {passed ? "Quiz Passed!" : "Quiz Failed"}
              </h2>
              <p className={`text-lg font-bold mt-1 ${passed ? "text-emerald-400" : "text-rose-400"}`}>
                Your score: {score}%
              </p>
            </div>
          </div>

          <p className={`text-sm ${passed ? "text-emerald-300/70" : "text-rose-300/70"}`}>
            {passed
              ? "Excellent work! You passed this quiz. A certificate has been generated for you if this course qualifies."
              : "You need at least 80% to pass. Review the material and try again (up to 3 attempts per 24 hours)."}
          </p>

          {result.progression !== undefined && (
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-xs font-medium">Course Progress:</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden max-w-xs">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${result.progression}%` }}
                />
              </div>
              <span className="text-indigo-400 font-bold text-sm">{result.progression}%</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate("/student/results")}
              className="bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 rounded-xl text-white font-bold text-sm"
            >
              📊 View My Results
            </button>
            <button
              onClick={() => navigate("/student/courses")}
              className="bg-white/10 hover:bg-white/20 transition px-6 py-3 rounded-xl text-white font-bold text-sm"
            >
              📚 My Courses
            </button>
            {passed && result.certificate && (
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    const { default: api } = await import("../../api/axios");
                    const res = await api.get(
                      `/cours/certificat/${result.certificate.course_id}/pdf/`,
                      { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
                    );
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `certificate_${result.certificate.course_id}.pdf`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  } catch {
                    alert("Could not download certificate.");
                  }
                }}
                className="bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 transition px-6 py-3 rounded-xl text-white font-bold text-sm"
              >
                🏅 Download Certificate
              </button>
            )}
          </div>
        </div>
      )}

      {/* QUESTIONS */}
      <div className="space-y-6">
        {quiz.questions?.map((question, qIdx) => (
          <div
            key={question.question_id}
            className="bg-[#0d1526] border border-white/10 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-start gap-3">
              <span className="bg-indigo-500/20 text-indigo-400 font-bold text-sm w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                {qIdx + 1}
              </span>
              <h2 className="text-lg font-semibold text-white leading-snug">
                {question.contenu}
              </h2>
            </div>

            <div className="space-y-3 ml-11">
              {question.type_question === "choix" ? (
                question.reponses?.map((reponse) => {
                  const selected = answers.some(
                    (a) => a.question_id === question.question_id && a.reponse_id === reponse.id
                  );
                  return (
                    <label
                      key={reponse.id}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                        result !== null
                          ? "cursor-default opacity-70"
                          : selected
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-white/10 hover:border-indigo-500/50 hover:bg-white/5"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.question_id}`}
                        disabled={result !== null}
                        onChange={() =>
                          handleSelect(question.question_id, reponse.id)
                        }
                        className="accent-indigo-500"
                      />
                      <span className="text-slate-300 text-sm">{reponse.texte}</span>
                    </label>
                  );
                })
              ) : (
                <textarea
                  disabled={result !== null}
                  onChange={(e) => handleTextAnswer(question.question_id, e.target.value)}
                  placeholder="Type your answer here..."
                  rows={3}
                  className="w-full bg-[#111827] border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-indigo-500 resize-none text-sm disabled:opacity-60"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SUBMIT */}
      {result === null && (
        <button
          onClick={handleSubmit}
          disabled={submitting || answers.length === 0}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            "Submit Quiz"
          )}
        </button>
      )}
    </div>
  );
}

export default QuizPage;
