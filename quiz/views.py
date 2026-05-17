from django.shortcuts import get_object_or_404
from django.utils import timezone
import logging

from rest_framework.decorators import (
    api_view,
    permission_classes
)

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import models

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
    Cours,
    Module
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
def get_quiz(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    
    if request.user.role == "teacher":
        if quiz.module.cours.enseignant != request.user:
            return Response(
                {"error": "Not your module"},
                status=status.HTTP_403_FORBIDDEN
            )
    else:
        enrolled = Inscription.objects.filter(
            etudiant=request.user,
            cours=quiz.module.cours
        ).exists()

        if not enrolled:
            return Response(
                {"error": "Not enrolled"},
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

    # -------------------------------------
    # ENFORCE MAX 3 ATTEMPTS AND 24H LOCK
    # -------------------------------------
    from datetime import timedelta
    attempts = Tentative.objects.filter(etudiant=request.user, quiz=quiz).order_by('-date_fin')
    attempts_count = attempts.count()

    if attempts_count >= 3:
        last_attempt = attempts.first()
        if last_attempt and last_attempt.date_fin:
            if timezone.now() < last_attempt.date_fin + timedelta(hours=24):
                return Response(
                    {"error": "You reached the maximum attempts. Try again in 24 hours."},
                    status=status.HTTP_403_FORBIDDEN
                )
            else:
                # 24h passed, reset attempts
                attempts.delete()

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
        cours=quiz.module.cours,
        defaults={
            "note": final_score
        }
    )

    progress = update_course_progress(
        request.user,
        quiz.module.cours
    )

    # =====================================================
    # AUTO-GENERATE CERTIFICATE IF PASSED
    # =====================================================
    certificate_data = None
    if final_score >= 80:
        from courses.models import Certificat
        cert, cert_created = Certificat.objects.get_or_create(
            etudiant=request.user,
            cours=quiz.module.cours,
            defaults={"score": final_score}
        )
        if not cert_created and cert.score < final_score:
            cert.score = final_score
            cert.save()
        certificate_data = {
            "certificate_id": str(cert.certificate_id),
            "course_id": quiz.module.cours.id,
        }

    return Response({
        "success": True,
        "score": final_score,
        "progression": progress,
        "certificate": certificate_data,
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
        module = Module.objects.get(
            id=serializer.validated_data['module_id']
        )

    except Module.DoesNotExist:

        return Response(
            {"error": "Module not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if module.cours.enseignant != request.user:

        return Response(
            {"error": "Not your module"},
            status=status.HTTP_403_FORBIDDEN
        )
        
    max_order = Quiz.objects.filter(module=module).aggregate(max_order=models.Max('order'))['max_order']
    next_order = 0 if max_order is None else max_order + 1

    quiz = Quiz.objects.create(
        titre=serializer.validated_data['titre'],
        module=module,
        order=next_order
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

    if quiz.module.cours.enseignant != request.user:

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

    if question.quiz.module.cours.enseignant != request.user:

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


# =====================================================
# DELETE QUIZ
# =====================================================

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@teacher_required
def delete_quiz(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id, module__cours__enseignant=request.user)
    quiz.delete()
    return Response({"message": "Quiz deleted"})
