from rest_framework.decorators import (
    api_view,
    permission_classes
)

from rest_framework.permissions import IsAuthenticated

from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import authenticate

from .serializers import (
    RegisterSerializer,
    LoginSerializer
)

from .models import Resultat

from courses.models import (
    Cours,
    Inscription,
    Contenu,
    CompletedContent
)


# =====================================================
# REGISTER
# =====================================================

@api_view(['POST'])
def register_view(request):

    serializer = RegisterSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response({
            "message": "User registered successfully"
        })

    return Response(
        serializer.errors,
        status=400
    )


# =====================================================
# LOGIN
# =====================================================

@api_view(['POST'])
def login_view(request):

    serializer = LoginSerializer(
        data=request.data
    )

    serializer.is_valid(
        raise_exception=True
    )

    email = serializer.validated_data['email']

    password = serializer.validated_data['password']

    user = authenticate(
        username=email,
        password=password
    )

    if user is None:

        return Response(
            {"error": "Invalid credentials"},
            status=401
        )

    refresh = RefreshToken.for_user(user)

    return Response({

        "refresh": str(refresh),

        "access": str(refresh.access_token),

        "role": user.role,

        "username": user.username
    })


# =====================================================
# REFRESH TOKEN
# =====================================================

@api_view(['POST'])
def refresh_token_view(request):

    refresh_token = request.data.get(
        "refresh"
    )

    if not refresh_token:

        return Response(
            {"error": "Refresh token required"},
            status=400
        )

    try:

        refresh = RefreshToken(
            refresh_token
        )

        return Response({
            "access": str(
                refresh.access_token
            )
        })

    except Exception:

        return Response(
            {"error": "Invalid token"},
            status=401
        )


# =====================================================
# LOGOUT
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):

    return Response({
        "message": "Logged out successfully"
    })




# =====================================================
# STUDENT RESULTS
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_results(request):

    if request.user.role != "student":

        return Response(
            {"error": "Student only"},
            status=403
        )

    inscriptions = Inscription.objects.filter(
        etudiant=request.user
    )

    data = []

    for inscription in inscriptions:

        total_content = Contenu.objects.filter(
            cours=inscription.cours
        ).count()

        completed_content = CompletedContent.objects.filter(
            etudiant=request.user,
            contenu__cours=inscription.cours
        ).count()

        progress = 0

        if total_content > 0:
            progress = int(
                (completed_content / total_content) * 100
            )

        gpa = round(progress / 25, 2)

        data.append({

            "course": inscription.cours.titre,

            "score": progress,

            "gpa": gpa,

            "status":
                "Passed"
                if progress == 100
                else "In Progress"
        })

    return Response(data)


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

    teacher_courses = Cours.objects.filter(
        enseignant=request.user
    )

    total_courses = teacher_courses.count()

    total_students = Inscription.objects.filter(
        cours__in=teacher_courses
    ).count()

    total_progress = 0

    total_items = 0

    for inscription in Inscription.objects.filter(
        cours__in=teacher_courses
    ):

        total_content = Contenu.objects.filter(
            cours=inscription.cours
        ).count()

        completed_content = CompletedContent.objects.filter(
            etudiant=inscription.etudiant,
            contenu__cours=inscription.cours
        ).count()

        progress = 0

        if total_content > 0:
            progress = int(
                (completed_content / total_content) * 100
            )

        total_progress += progress

        total_items += 1

    average_score = 0

    if total_items > 0:
        average_score = round(
            total_progress / total_items,
            1
        )

    return Response({

        "total_courses": total_courses,

        "total_students": total_students,

        "average_score": average_score
    })


# =====================================================
# TEACHER RESULTS
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def teacher_results(request):

    if request.user.role != "teacher":

        return Response(
            {"error": "Teacher only"},
            status=403
        )

    teacher_courses = Cours.objects.filter(
        enseignant=request.user
    )

    inscriptions = Inscription.objects.filter(
        cours__in=teacher_courses
    )

    data = []

    for inscription in inscriptions:

        total_content = Contenu.objects.filter(
            cours=inscription.cours
        ).count()

        completed_content = CompletedContent.objects.filter(
            etudiant=inscription.etudiant,
            contenu__cours=inscription.cours
        ).count()

        progress = 0

        if total_content > 0:
            progress = int(
                (completed_content / total_content) * 100
            )

        gpa = round(progress / 25, 2)

        data.append({

            "student":
                inscription.etudiant.username,

            "course":
                inscription.cours.titre,

            "score":
                progress,

            "gpa":
                gpa
        })

    return Response(data)