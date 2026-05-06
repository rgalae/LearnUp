from django.utils import timezone
import logging

from rest_framework.decorators import (
    api_view,
    permission_classes
)

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema

from .models import (
    Quiz,
    Question,
    Reponse,
    Tentative
)

from .serializers import (
    QuizSerializer,
    SubmitQuizSerializer,
    CreateQuizSerializer,
    CreateQuestionSerializer,
    CreateResponseSerializer
)

from courses.models import (
    Resultat,
    Progression,
    Inscription
)

from courses.views import (
    student_required,
    teacher_required
)

logger = logging.getLogger(__name__)


# =====================================================
# GET QUIZ
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz(request, cours_id):

    # enrollment check
    if not Inscription.objects.filter(
        etudiant=request.user,
        cours_id=cours_id
    ).exists():

        return Response(
            {"error": "Not enrolled"},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        quiz = Quiz.objects.get(
            cours_id=cours_id
        )

    except Quiz.DoesNotExist:

        return Response(
            {"error": "Quiz not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # prevent retake if passed
    existing = Resultat.objects.filter(
        etudiant=request.user,
        cours_id=cours_id
    ).first()

    if existing and existing.note >= 10:

        return Response(
            {"error": "Quiz already completed"},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = QuizSerializer(quiz)

    return Response(serializer.data)


# =====================================================
# SUBMIT QUIZ
# =====================================================

@swagger_auto_schema(
    method='post',
    request_body=SubmitQuizSerializer
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@student_required
def submit_quiz(request):

    serializer = SubmitQuizSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    quiz_id = serializer.validated_data['quiz_id']

    answers = serializer.validated_data['answers']

    try:
        quiz = Quiz.objects.get(id=quiz_id)

    except Quiz.DoesNotExist:

        return Response(
            {"error": "Quiz not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # prevent retake
    existing = Resultat.objects.filter(
        etudiant=request.user,
        cours=quiz.cours
    ).first()

    if existing and existing.note >= 10:

        return Response(
            {"error": "Already passed"},
            status=status.HTTP_403_FORBIDDEN
        )

    score = 0

    for ans in answers:

        try:
            reponse = Reponse.objects.get(
                id=ans['reponse_id'],
                question_id=ans['question_id']
            )

            if reponse.est_correcte:
                score += 1

        except Reponse.DoesNotExist:
            continue

    total = len(answers)

    final_score = int(
        (score / total) * 100
    ) if total > 0 else 0

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
        defaults={
            "note": final_score
        }
    )

    # progression
    progress = 100 if final_score >= 10 else 50

    Progression.objects.update_or_create(
        etudiant=request.user,
        cours=quiz.cours,
        defaults={
            "progression": progress
        }
    )

    logger.info(
        f"{request.user} submitted quiz {quiz.id} with score {final_score}"
    )

    return Response({
        "success": True,
        "score": final_score
    })


# =====================================================
# CREATE QUIZ
# =====================================================

@swagger_auto_schema(
    method='post',
    request_body=CreateQuizSerializer
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@teacher_required
def create_quiz(request):

    serializer = CreateQuizSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    quiz = Quiz.objects.create(
        titre=serializer.validated_data['titre'],
        cours_id=serializer.validated_data['cours_id']
    )

    return Response({
        "message": "Quiz created",
        "quiz_id": quiz.id
    })


# =====================================================
# CREATE QUESTION
# =====================================================

@swagger_auto_schema(
    method='post',
    request_body=CreateQuestionSerializer
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@teacher_required
def create_question(request):

    serializer = CreateQuestionSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    question = Question.objects.create(
        quiz_id=serializer.validated_data['quiz_id'],
        texte=serializer.validated_data['texte'],
        type_question=serializer.validated_data['type_question']
    )

    return Response({
        "message": "Question created",
        "question_id": question.id
    })


# =====================================================
# CREATE RESPONSE
# =====================================================

@swagger_auto_schema(
    method='post',
    request_body=CreateResponseSerializer
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@teacher_required
def create_response(request):

    serializer = CreateResponseSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    response_obj = Reponse.objects.create(
        question_id=serializer.validated_data['question_id'],
        texte=serializer.validated_data['texte'],
        est_correcte=serializer.validated_data['est_correcte']
    )

    return Response({
        "message": "Response created",
        "response_id": response_obj.id
    })