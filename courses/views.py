from django.shortcuts import get_object_or_404
from django.http import FileResponse, HttpResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from drf_yasg.utils import swagger_auto_schema

from functools import wraps

import os

from .models import (
    Cours,
    Inscription,
    Contenu,
    Certificat,
    Progression,
    CompletedContent
)

from .serializers import (
    CourseListSerializer,
    CourseDetailSerializer,
    CreateCourseSerializer,
    EnrollSerializer,
    CompleteContentSerializer,
    ProgressionSerializer,
    ContenuSerializer
)

from results.models import Resultat

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet

from .utils import update_course_progress


# =====================================================
# ROLE DECORATORS
# =====================================================

def teacher_required(view_func):

    @wraps(view_func)
    def wrapper(request, *args, **kwargs):

        if request.user.role != "teacher":

            return Response(
                {"error": "Teacher only"},
                status=status.HTTP_403_FORBIDDEN
            )

        return view_func(request, *args, **kwargs)

    return wrapper


def student_required(view_func):

    @wraps(view_func)
    def wrapper(request, *args, **kwargs):

        if request.user.role != "student":

            return Response(
                {"error": "Student only"},
                status=status.HTTP_403_FORBIDDEN
            )

        return view_func(request, *args, **kwargs)

    return wrapper


# =====================================================
# GET ALL COURSES
# =====================================================

@api_view(['GET'])
def get_courses(request):

    courses = Cours.objects.all()

    serializer = CourseListSerializer(
        courses,
        many=True
    )

    return Response(serializer.data)


# =====================================================
# MY COURSES
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@student_required
def my_courses(request):

    inscriptions = Inscription.objects.filter(
        etudiant=request.user
    )

    data = []

    for inscription in inscriptions:

        cours = inscription.cours

        progress = Progression.objects.filter(
            etudiant=request.user,
            cours=cours
        ).first()

        result = Resultat.objects.filter(
            etudiant=request.user,
            cours=cours
        ).first()

        data.append({
            "id": cours.id,
            "titre": cours.titre,
            "description": cours.description,
            "enseignant": cours.enseignant.username,
            "progress": progress.progression if progress else 0,
            "score": result.note if result else 0
        })

    return Response(data)


# =====================================================
# TEACHER COURSES
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@teacher_required
def teacher_courses(request):

    courses = Cours.objects.filter(
        enseignant=request.user
    )

    serializer = CourseListSerializer(
        courses,
        many=True
    )

    return Response(serializer.data)


# =====================================================
# CREATE COURSE
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@teacher_required
def create_course(request):

    serializer = CreateCourseSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    cours = Cours.objects.create(
        titre=serializer.validated_data['titre'],
        description=serializer.validated_data['description'],
        enseignant=request.user
    )

    return Response({
        "message": "Course created",
        "id": cours.id
    })


# =====================================================
# UPDATE COURSE
# =====================================================

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@teacher_required
def update_course(request, id):

    cours = get_object_or_404(
        Cours,
        id=id,
        enseignant=request.user
    )

    cours.titre = request.data.get(
        "titre",
        cours.titre
    )

    cours.description = request.data.get(
        "description",
        cours.description
    )

    cours.save()

    return Response({
        "message": "Course updated"
    })


# =====================================================
# DELETE COURSE
# =====================================================

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@teacher_required
def delete_course(request, id):

    cours = get_object_or_404(
        Cours,
        id=id,
        enseignant=request.user
    )

    cours.delete()

    return Response({
        "message": "Course deleted"
    })

# =====================================================
# ENROLL COURSE
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@student_required
def inscrire(request):

    serializer = EnrollSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    cours_id = serializer.validated_data['cours_id']

    cours = get_object_or_404(
        Cours,
        id=cours_id
    )

    inscription, created = Inscription.objects.get_or_create(
        etudiant=request.user,
        cours=cours
    )

    return Response({
        "message": (
            "Enrollment successful"
            if created
            else "Already enrolled"
        )
    })

# =====================================================
# COURSE DETAIL (STUDENT)
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@student_required
def cours_detail(request, id):

    cours = get_object_or_404(
        Cours,
        id=id
    )

    enrolled = Inscription.objects.filter(
        etudiant=request.user,
        cours=cours
    ).exists()

    if not enrolled:

        return Response(
            {"error": "Not enrolled"},
            status=status.HTTP_403_FORBIDDEN
        )

    contenus = Contenu.objects.filter(
        cours=cours
    )

    contenus_data = []

    for contenu in contenus:

        completed = CompletedContent.objects.filter(
            etudiant=request.user,
            contenu=contenu
        ).exists()

        contenus_data.append({
            "id": contenu.id,
            "titre": contenu.titre,
            "video_url": contenu.video_url,
            "fichier": (
                contenu.fichier.url
                if contenu.fichier
                else None
            ),
            "completed": completed
        })

    result = Resultat.objects.filter(
        etudiant=request.user,
        cours=cours
    ).first()

    progress = Progression.objects.filter(
        etudiant=request.user,
        cours=cours
    ).first()

    return Response({
        "id": cours.id,
        "titre": cours.titre,
        "description": cours.description,
        "enseignant": cours.enseignant.username,
        "progress": progress.progression if progress else 0,
        "score": result.note if result else 0,
        "contenus": contenus_data
    })


# =====================================================
# TEACHER COURSE DETAIL
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@teacher_required
def teacher_course_detail(request, id):

    cours = get_object_or_404(
        Cours,
        id=id,
        enseignant=request.user
    )

    contenus = Contenu.objects.filter(
        cours=cours
    )

    students_count = Inscription.objects.filter(
        cours=cours
    ).count()

    results = Resultat.objects.filter(
        cours=cours
    )

    avg_score = 0

    if results.exists():

        avg_score = round(
            sum(r.note for r in results) / results.count(),
            1
        )

    return Response({
        "id": cours.id,
        "titre": cours.titre,
        "description": cours.description,
        "students": students_count,
        "average_score": avg_score,
        "contenus": ContenuSerializer(
            contenus,
            many=True
        ).data
    })


# =====================================================
# ADD CONTENT
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@teacher_required
def add_content(request, cours_id):

    cours = get_object_or_404(
        Cours,
        id=cours_id,
        enseignant=request.user
    )

    titre = request.data.get("titre")

    if not titre:

        return Response(
            {"error": "Title required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    contenu = Contenu.objects.create(
        titre=titre,
        video_url=request.data.get("video_url"),
        fichier=request.data.get("fichier"),
        cours=cours
    )

    return Response({
        "message": "Content added",
        "content_id": contenu.id
    })


# =====================================================
# COMPLETE CONTENT
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@student_required
def complete_content(request):

    contenu_id = request.data.get("contenu_id")

    contenu = get_object_or_404(
        Contenu,
        id=contenu_id
    )

    CompletedContent.objects.get_or_create(
        etudiant=request.user,
        contenu=contenu
    )

    progress = update_course_progress(
        request.user,
        contenu.cours
    )

    return Response({
        "message": "Completed",
        "progression": progress
    })


# =====================================================
# PROGRESS
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_progress(request):

    progressions = Progression.objects.filter(
        etudiant=request.user
    )

    serializer = ProgressionSerializer(
        progressions,
        many=True
    )

    return Response(serializer.data)


# =====================================================
# TEACHER STUDENTS
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@teacher_required
def teacher_students(request):

    courses = Cours.objects.filter(
        enseignant=request.user
    )

    data = []

    for course in courses:

        inscriptions = Inscription.objects.filter(
            cours=course
        )

        for inscription in inscriptions:

            student = inscription.etudiant

            progress = Progression.objects.filter(
                etudiant=student,
                cours=course
            ).first()

            result = Resultat.objects.filter(
                etudiant=student,
                cours=course
            ).first()

            score = result.note if result else 0

            gpa = round(score / 25, 2)

            data.append({
                "student": student.username,
                "course": course.titre,
                "progress": progress.progression if progress else 0,
                "score": score,
                "gpa": gpa,
                "status": (
                    "Passed"
                    if score >= 10
                    else "In Progress"
                )
            })

    return Response(data)


# =====================================================
# CERTIFICATE JSON
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_certificat(request, cours_id):

    try:
        result = Resultat.objects.get(
            etudiant=request.user,
            cours_id=cours_id
        )

        if result.note < 10:

            return Response(
                {"error": "Insufficient grade"},
                status=status.HTTP_403_FORBIDDEN
            )

        certificat, created = Certificat.objects.get_or_create(
            etudiant=request.user,
            cours_id=cours_id
        )

        return Response({
            "message": "Certificate generated",
            "created": created
        })

    except Resultat.DoesNotExist:

        return Response(
            {"error": "No result found"},
            status=status.HTTP_404_NOT_FOUND
        )


# =====================================================
# CERTIFICATE PDF
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def certificat_pdf(request, cours_id):

    try:
        result = Resultat.objects.get(
            etudiant=request.user,
            cours_id=cours_id
        )

        if result.note < 10:

            return Response(
                {"error": "Insufficient grade"},
                status=status.HTTP_403_FORBIDDEN
            )

        response = HttpResponse(
            content_type='application/pdf'
        )

        response['Content-Disposition'] = (
            f'attachment; filename="certificat_{cours_id}.pdf"'
        )

        doc = SimpleDocTemplate(response)

        styles = getSampleStyleSheet()

        content = [

            Paragraph(
                "CERTIFICATE OF ACHIEVEMENT",
                styles["Title"]
            ),

            Spacer(1, 20),

            Paragraph(
                f"Student: {request.user.username}",
                styles["Normal"]
            ),

            Paragraph(
                f"Course: {result.cours.titre}",
                styles["Normal"]
            ),

            Paragraph(
                f"Grade: {result.note}",
                styles["Normal"]
            ),
        ]

        doc.build(content)

        return response

    except Resultat.DoesNotExist:

        return Response(
            {"error": "No result found"},
            status=status.HTTP_404_NOT_FOUND
        )


# =====================================================
# DOWNLOAD CONTENT
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_content(request, contenu_id):

    contenu = get_object_or_404(
        Contenu,
        id=contenu_id
    )

    if not contenu.fichier:

        return Response(
            {"error": "No file attached"},
            status=status.HTTP_404_NOT_FOUND
        )

    is_teacher_owner = (
        request.user.role == "teacher"
        and contenu.cours.enseignant == request.user
    )

    is_enrolled_student = Inscription.objects.filter(
        etudiant=request.user,
        cours=contenu.cours
    ).exists()

    if not (is_teacher_owner or is_enrolled_student):

        return Response(
            {"error": "Access denied"},
            status=status.HTTP_403_FORBIDDEN
        )

    file_path = contenu.fichier.path

    if not os.path.exists(file_path):

        return Response(
            {"error": "File not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    return FileResponse(
        open(file_path, 'rb'),
        as_attachment=True,
        filename=os.path.basename(file_path)
    )
