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
        module__cours__in=teacher_courses
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

# =====================================================
# STUDENT RESULTS
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_results(request):

    from results.models import Resultat
    from courses.models import Certificat, Progression, Inscription

    inscriptions = Inscription.objects.filter(etudiant=request.user).select_related('cours')

    data = []

    for inscription in inscriptions:
        cours = inscription.cours
        result = Resultat.objects.filter(etudiant=request.user, cours=cours).first()
        prog = Progression.objects.filter(etudiant=request.user, cours=cours).first()
        cert = Certificat.objects.filter(etudiant=request.user, cours=cours).first()

        score = result.note if result else 0
        progression = prog.progression if prog else 0

        data.append({
            "cours": cours.titre,
            "cours_id": cours.id,
            "note": score,
            "grade": (
                "Excellent" if score >= 90 else
                "Very Good" if score >= 80 else
                "Good" if score >= 70 else
                "Average" if score >= 50 else
                "Failed"
            ),
            "gpa": round(score / 20, 2),
            "progression": progression,
            "status": "Passed" if score >= 80 else "Failed",
            "has_certificate": cert is not None,
            "certificate_id": str(cert.certificate_id) if cert else None,
            "completion_date": cert.date_obtention.strftime('%B %d, %Y') if cert else None,
        })

    return Response(data)


# =====================================================
# TEACHER RESULTS
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_results(request):

    from results.models import Resultat
    from courses.models import Cours

    teacher_courses = Cours.objects.filter(
        enseignant=request.user
    )

    results = Resultat.objects.filter(
        cours__in=teacher_courses
    )

    data = []

    for result in results:

        data.append({
            "student": result.etudiant.username,
            "cours": result.cours.titre,
            "note": result.note
        })

    return Response(data)


# =====================================================
# STUDENT DASHBOARD
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_dashboard(request):

    from courses.models import (
        Inscription,
        Progression
    )

    from results.models import Resultat

    total_courses = Inscription.objects.filter(
        etudiant=request.user
    ).count()

    results = Resultat.objects.filter(
        etudiant=request.user
    )

    completed_courses = results.filter(
        note__gte=80
    ).count()

    average_progress = 0

    if results.exists():

        average_progress = round(
            sum(r.note for r in results) / results.count(),
            1
        )

    progressions = Progression.objects.filter(
        etudiant=request.user
    )

    courses_data = []

    for progression in progressions:

        courses_data.append({
            "titre": progression.cours.titre,
            "progression": progression.progression
        })

    return Response({
    "total_courses": total_courses,
    "completed_courses": completed_courses,
    "average_progress": average_progress,
    "courses": courses_data
})

# =====================================================
# NOTIFICATIONS
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    from .models import Notification
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    
    data = []
    for notif in notifications:
        data.append({
            "id": notif.id,
            "message": notif.message,
            "is_read": notif.is_read,
            "created_at": notif.created_at
        })
    
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, id):
    from .models import Notification
    try:
        notif = Notification.objects.get(id=id, user=request.user)
        notif.is_read = True
        notif.save()
        return Response({"message": "Marked as read"})
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found"}, status=404)

# =====================================================
# UPDATE PROFILE
# =====================================================

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    
    if 'profile_picture' in request.FILES:
        user.profile_picture = request.FILES['profile_picture']
        
    if 'username' in request.data:
        # verify username is unique
        from django.contrib.auth import get_user_model
        User = get_user_model()
        new_username = request.data['username']
        if User.objects.filter(username=new_username).exclude(id=user.id).exists():
            return Response({"error": "Username already exists"}, status=400)
        user.username = new_username
        
    if 'email' in request.data:
        user.email = request.data['email']
        
    user.save()
    
    return Response({
        "message": "Profile updated successfully",
        "username": user.username,
        "email": user.email,
        "profile_picture": user.profile_picture.url if user.profile_picture else None
    })