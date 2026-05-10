import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";

import { getQuiz, submitQuiz } from "../../services/quizServices.js";

function QuizPage() {
  const { coursId } = useParams();

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
      const data = await getQuiz(coursId);

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

      setTimeout(() => {
        navigate("/student/courses");
      }, 1500);
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
        <div className="bg-green-600/20 border border-green-500 text-green-300 p-5 rounded-2xl">
          Your score: {score}%
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
        onClick={handleSubmit}
        disabled={score !== null}
      >
        {score !== null ? "Quiz Submitted" : "Submit Quiz"}
      </Button>
    </div>
  );
}

export default QuizPage;
