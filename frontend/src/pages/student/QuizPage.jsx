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

  const [score, setScore] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const data = await getQuiz(quizId);

      console.log(data);

      setQuiz(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId, reponseId) => {
    const filtered = answers.filter((a) => a.question_id !== questionId);

    setAnswers([
      ...filtered,
      {
        question_id: questionId,
        reponse_id: reponseId,
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      const data = await submitQuiz({
        quiz_id: quiz.quiz_id,
        answers,
      });

      setScore(data.score);
    } catch (err) {
      console.log(err);

      alert("Failed to submit quiz");
    }
  };

  if (loading) {
    return <div className="text-white text-center py-10">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="text-red-400 text-center py-10">Quiz not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button variant="ghost" className="mb-2" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold text-white">{quiz.titre}</h1>
      </div>

      {score !== null && (
        <div
          className={`p-6 rounded-2xl space-y-4 border ${
            score >= 80
              ? "bg-green-600/20 border-green-500 text-green-300"
              : "bg-red-600/20 border-red-500 text-red-300"
          }`}
        >
          <h2 className="text-2xl font-bold">
            {score >= 80 ? "Quiz Passed 🎉" : "Quiz Failed ❌"}
          </h2>

          <p className="text-lg">Your score: {score}%</p>

          <p>
            {score >= 80
              ? "Excellent work! You passed the quiz."
              : "You need at least 80% to pass this quiz."}
          </p>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => navigate("/student/results")}
              className="bg-indigo-600 hover:bg-indigo-500 transition px-5 py-3 rounded-xl text-white"
            >
              View Results
            </button>

            <button
              onClick={() => navigate("/student/courses")}
              className="bg-white/10 hover:bg-white/20 transition px-5 py-3 rounded-xl text-white"
            >
              Back to Courses
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {quiz.questions.map((question) => (
          <div
            key={question.question_id}
            className="bg-[#0d1526] border border-white/10 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white">
              {question.contenu}
            </h2>

            <div className="mt-5 space-y-3">
              {question.reponses.map((reponse) => (
                <label
                  key={reponse.id}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <input
                    type="radio"
                    disabled={score !== null}
                    name={`question-${question.question_id}`}
                    onChange={() =>
                      handleSelect(question.question_id, reponse.id)
                    }
                  />

                  {reponse.texte}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button
        className="w-full"
        disabled={score !== null}
        onClick={handleSubmit}
        disabled={score !== null}
      >
        {score !== null ? "Quiz Submitted" : "Submit Quiz"}
      </Button>
    </div>
  );
}

export default QuizPage;
