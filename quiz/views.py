from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
import logging

from .models import Quiz, Question, Reponse, Tentative
from django.utils import timezone

from courses.models import Resultat, Progression, Inscription
from courses.views import student_required

logger = logging.getLogger(__name__)


# ---------------------------
# GET QUIZ
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz(request, cours_id):

    # check enrollment
    if not Inscription.objects.filter(etudiant=request.user, cours_id=cours_id).exists():
        return JsonResponse({"error": "Not enrolled"}, status=403)

    try:
        quiz = Quiz.objects.get(cours_id=cours_id)
    except Quiz.DoesNotExist:
        return JsonResponse({"error": "Quiz not found"}, status=404)

    # prevent retake if passed
    existing = Resultat.objects.filter(
        etudiant=request.user,
        cours_id=cours_id
    ).first()

    if existing and existing.note >= 10:
        return JsonResponse({"error": "Quiz already completed"}, status=403)

    questions = Question.objects.filter(quiz=quiz)

    data = []
    for q in questions:
        responses = Reponse.objects.filter(question=q)

        data.append({
            "question_id": q.id,
            "contenu": q.texte,
            "reponses": [
                {"id": r.id, "texte": r.texte}
                for r in responses
            ]
        })

    return JsonResponse({
        "quiz_id": quiz.id,
        "questions": data
    })


# ---------------------------
# SUBMIT QUIZ
# ---------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@student_required
def submit_quiz(request):

    quiz_id = request.data.get("quiz_id")
    answers = request.data.get("answers", [])

    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return JsonResponse({"error": "Quiz not found"}, status=404)

    # prevent passing again
    existing = Resultat.objects.filter(
        etudiant=request.user,
        cours=quiz.cours
    ).first()

    if existing and existing.note >= 10:
        return JsonResponse({"error": "Already passed"}, status=403)

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

    # save attempt
    Tentative.objects.create(
        etudiant=request.user,
        quiz=quiz,
        score=final_score,
        date_fin=timezone.now()
    )

    # save result
    Resultat.objects.update_or_create(
        etudiant=request.user,
        cours=quiz.cours,
        defaults={"note": final_score}
    )

    # progression
    progress = 100 if final_score >= 10 else 50

    Progression.objects.update_or_create(
        etudiant=request.user,
        cours=quiz.cours,
        defaults={"progression": progress}
    )

    logger.info(f"{request.user} submitted quiz {quiz.id} with score {final_score}")

    return JsonResponse({
        "success": True,
        "score": final_score
    })