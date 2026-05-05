from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Quiz, Question, Reponse, Tentative
from django.utils import timezone


def get_quiz(request, cours_id):
    try:
        quiz = Quiz.objects.get(cours_id=cours_id)
    except Quiz.DoesNotExist:
        return JsonResponse({"error": "Quiz not found"}, status=404)

    questions = Question.objects.filter(quiz=quiz)

    data = []

    for q in questions:
        responses = Reponse.objects.filter(question=q)

        data.append({
            "question_id": q.id,
            "contenu": q.texte,
            "reponses": [
                {
                    "id": r.id,
                    "texte": r.texte
                }
                for r in responses
            ]
        })

    return JsonResponse({
        "quiz_id": quiz.id,
        "questions": data
    })


@csrf_exempt
@login_required
def submit_quiz(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    quiz_id = data.get("quiz_id")
    answers = data.get("answers", [])

    user = request.user

    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return JsonResponse({"error": "Quiz not found"}, status=404)

    score = 0

    for ans in answers:
        try:
            reponse = Reponse.objects.get(
                id=ans["reponse_id"],
                question_id=ans["question_id"]
            )

            if reponse.est_correcte:
                score += 1

        except Reponse.DoesNotExist:
            continue

    total = len(answers)
    final_score = int((score / total) * 100) if total > 0 else 0

    Tentative.objects.create(
        etudiant=user,
        quiz=quiz,
        score=final_score,
        date_fin=timezone.now()
    )

    from courses.models import Resultat

    Resultat.objects.update_or_create(
        etudiant=user,
        cours=quiz.cours,
        defaults={"note": final_score}
    )

    return JsonResponse({
        "success": True,
        "score": final_score,
        "message": "Quiz submitted successfully"
    })