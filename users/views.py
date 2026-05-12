from .jwt_serializer import CustomTokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.decorators import (
    api_view,
    permission_classes
)

from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response

import json


# =====================================================
# LOGIN
# =====================================================

@csrf_exempt
def login_view(request):

    if request.method != "POST":

        return JsonResponse(
            {"error": "POST required"},
            status=400
        )

    try:
        data = json.loads(request.body)

    except:

        return JsonResponse(
            {"error": "Invalid JSON"},
            status=400
        )

    username = data.get("username")

    password = data.get("password")

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:

        return JsonResponse(
            {"error": "Invalid credentials"},
            status=401
        )

    refresh = CustomTokenObtainPairSerializer.get_token(user)

    return JsonResponse({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "role": user.role,
    })


# =====================================================
# REFRESH TOKEN
# =====================================================

@csrf_exempt
def refresh_token_view(request):

    if request.method != "POST":

        return JsonResponse(
            {"error": "POST required"},
            status=400
        )

    try:
        data = json.loads(request.body)

        refresh_token = data.get("refresh")

    except:

        return JsonResponse(
            {"error": "Invalid JSON"},
            status=400
        )

    try:

        refresh = RefreshToken(refresh_token)

        access_token = str(refresh.access_token)

        return JsonResponse({
            "access": access_token
        })

    except Exception:

        return JsonResponse(
            {"error": "Invalid refresh token"},
            status=401
        )


# =====================================================
# LOGOUT
# =====================================================

@csrf_exempt
def logout_view(request):

    if request.method != "POST":

        return JsonResponse(
            {"error": "POST required"},
            status=400
        )

    try:

        data = json.loads(request.body)

        refresh_token = data.get("refresh")

        token = RefreshToken(refresh_token)

        token.blacklist()

        return JsonResponse({
            "message": "Logged out successfully"
        })

    except Exception:

        return JsonResponse(
            {"error": "Invalid token"},
            status=400
        )


# =====================================================
# REGISTER
# =====================================================

@csrf_exempt
def register_view(request):

    if request.method != "POST":

        return JsonResponse(
            {"error": "POST required"},
            status=400
        )

    try:

        data = json.loads(request.body)

    except:

        return JsonResponse(
            {"error": "Invalid JSON"},
            status=400
        )

    serializer = RegisterSerializer(data=data)

    if not serializer.is_valid():

        return JsonResponse(
            serializer.errors,
            status=400
        )

    User = get_user_model()

    if User.objects.filter(
        username=serializer.validated_data['username']
    ).exists():

        return JsonResponse(
            {"error": "Username already exists"},
            status=400
        )

    user = User.objects.create_user(
        username=serializer.validated_data['username'],
        password=serializer.validated_data['password'],
        role=serializer.validated_data['role']
    )

    return JsonResponse({
        "message": "User created",
        "username": user.username,
        "role": user.role
    })


# =====================================================
# TEACHER DASHBOARD
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_dashboard(request):

    if request.user.role != "teacher":

        return Response(
            {"error": "Teacher only"},
            status=403
        )

    from courses.models import Cours, Inscription
    from quiz.models import Quiz
    from results.models import Resultat

    teacher_courses = Cours.objects.filter(
        enseignant=request.user
    )

    courses_count = teacher_courses.count()

    students_count = Inscription.objects.filter(
        cours__in=teacher_courses
    ).count()

    quizzes_count = Quiz.objects.filter(
        cours__in=teacher_courses
    ).count()

    results = Resultat.objects.filter(
        cours__in=teacher_courses
    )

    avg_score = 0

    if results.exists():

        avg_score = round(
            sum(r.note for r in results) / results.count(),
            1
        )

    courses_data = []

    for course in teacher_courses:

        enrolled = Inscription.objects.filter(
            cours=course
        ).count()

        courses_data.append({
            "id": course.id,
            "titre": course.titre,
            "students": enrolled
        })

    return Response({
        "courses_count": courses_count,
        "students_count": students_count,
        "quizzes_count": quizzes_count,
        "avg_score": avg_score,
        "courses": courses_data
    })