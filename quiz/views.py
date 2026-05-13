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

from results.models import Resultat

from courses.models import (
    Inscription,
    Cours
)

from courses.views import (
    student_required,
    teacher_required
)

from courses.utils import update_course_progress

logger = logging.getLogger(__name__)


# =====================================================
# GET QUIZ
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz(request, cours_id):

    if request.user.role == "teacher":

        try:
            Cours.objects.get(
                id=cours_id,
                enseignant=request.user
            )

        except Cours.DoesNotExist:

            return Response(
                {"error": "Not your course"},
                status=status.HTTP_403_FORBIDDEN
            )

    else:

        enrolled = Inscription.objects.filter(
            etudiant=request.user,
            cours_id=cours_id
        ).exists()

        if not enrolled:

            return Response(
                {"error": "Not enrolled"},
                status=status.HTTP_403_FORBIDDEN
            )

    quiz = Quiz.objects.filter(
        cours_id=cours_id
    ).first()

    if not quiz:

        return Response(
            {"error": "Quiz not found"},
            status=status.HTTP_404_NOT_FOUND
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

    score = 0

    total_questions = len(answers)

    for ans in answers:

        try:

            question = Question.objects.get(
                id=ans['question_id']
            )

            # =====================================
            # MULTIPLE CHOICE
            # =====================================

            if question.type_question == "choix":

                reponse = Reponse.objects.get(
                    id=ans['reponse_id'],
                    question=question
                )

                if reponse.est_correcte:
                    score += 1

            # =====================================
            # OPEN QUESTION
            # =====================================

            elif question.type_question == "ouverte":

                student_answer = ans.get(
                    "texte_reponse",
                    ""
                ).strip().lower()

                correct_answer = (
                    question.correct_answer or ""
                ).strip().lower()

                if student_answer == correct_answer:
                    score += 1

        except Exception as e:
            print(e)
            continue

    final_score = int(
        (score / total_questions) * 100
    ) if total_questions > 0 else 0

    Tentative.objects.create(
        etudiant=request.user,
        quiz=quiz,
        score=final_score,
        date_fin=timezone.now()
    )

    # =====================================================
    # SAVE RESULT FOR RESULTS PAGE
    # =====================================================

    Resultat.objects.update_or_create(
        etudiant=request.user,
        cours=quiz.cours,
        defaults={
            "note": final_score
        }
    )

    progress = update_course_progress(
        request.user,
        quiz.cours
    )

    return Response({
        "success": True,
        "score": final_score,
        "progression": progress
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

    try:
        cours = Cours.objects.get(
            id=serializer.validated_data['cours_id']
        )

    except Cours.DoesNotExist:

        return Response(
            {"error": "Course not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if cours.enseignant != request.user:

        return Response(
            {"error": "Not your course"},
            status=status.HTTP_403_FORBIDDEN
        )

    quiz = Quiz.objects.create(
        titre=serializer.validated_data['titre'],
        cours=cours
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

    try:
        quiz = Quiz.objects.get(
            id=serializer.validated_data['quiz_id']
        )

    except Quiz.DoesNotExist:

        return Response(
            {"error": "Quiz not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if quiz.cours.enseignant != request.user:

        return Response(
            {"error": "Not your quiz"},
            status=status.HTTP_403_FORBIDDEN
        )

    question = Question.objects.create(
        quiz=quiz,
        texte=serializer.validated_data['texte'],
        type_question=serializer.validated_data['type_question'],
        correct_answer=serializer.validated_data.get(
            'correct_answer',
            ""
        )
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

    try:
        question = Question.objects.get(
            id=serializer.validated_data['question_id']
        )

    except Question.DoesNotExist:

        return Response(
            {"error": "Question not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if question.quiz.cours.enseignant != request.user:

        return Response(
            {"error": "Not your question"},
            status=status.HTTP_403_FORBIDDEN
        )

    response_obj = Reponse.objects.create(
        question=question,
        texte=serializer.validated_data['texte'],
        est_correcte=serializer.validated_data['est_correcte']
    )

    return Response({
        "message": "Response created",
        "response_id": response_obj.id
    })