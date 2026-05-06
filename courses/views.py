from django.shortcuts import get_object_or_404
from django.http import FileResponse
from django.http import HttpResponse, JsonResponse

from django.conf import settings

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

from functools import wraps

import os

from .models import (
    Cours,
    Inscription,
    Contenu,
    Resultat,
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
    ResultSerializer,
    ContenuSerializer
)


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
# GET COURSES
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_courses(request):

    courses = Cours.objects.all()

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
# ADD CONTENT
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@teacher_required
def add_content(request, cours_id):

    try:
        cours = Cours.objects.get(id=cours_id)
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

    titre = request.data.get("titre")
    video_url = request.data.get("video_url")
    fichier = request.FILES.get("fichier")

    if not titre:
        return Response(
            {"error": "Title required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    contenu = Contenu.objects.create(
        titre=titre,
        video_url=video_url,
        fichier=fichier,
        cours=cours
    )

    return Response({
        "message": "Content added",
        "content_id": contenu.id
    })


# =====================================================
# INSCRIPTION
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

    try:
        cours = Cours.objects.get(id=cours_id)
    except Cours.DoesNotExist:
        return Response(
            {"error": "Course not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    inscription, created = Inscription.objects.get_or_create(
        etudiant=request.user,
        cours=cours
    )

    return Response({
        "message": "Inscription successful",
        "created": created
    })


# =====================================================
# COURSE DETAIL
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cours_detail(request, id):

    try:
        cours = Cours.objects.get(id=id)
    except Cours.DoesNotExist:
        return Response(
            {"error": "Course not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if not Inscription.objects.filter(
        etudiant=request.user,
        cours=cours
    ).exists():
        return Response(
            {"error": "Not enrolled"},
            status=status.HTTP_403_FORBIDDEN
        )

    contenus = Contenu.objects.filter(cours=cours)

    content_data = []

    for c in contenus:

        completed = CompletedContent.objects.filter(
            etudiant=request.user,
            contenu=c
        ).exists()

        serialized = ContenuSerializer(c).data
        serialized['completed'] = completed

        content_data.append(serialized)

    course_data = CourseDetailSerializer(cours).data
    course_data['contenus'] = content_data

    return Response(course_data)


# =====================================================
# COMPLETE CONTENT
# =====================================================

@swagger_auto_schema(
    method='post',
    request_body=CompleteContentSerializer
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@student_required
def complete_content(request):

    serializer = CompleteContentSerializer(
        data=request.data
    )

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    contenu_id = serializer.validated_data['contenu_id']

    try:
        contenu = Contenu.objects.get(id=contenu_id)
    except Contenu.DoesNotExist:
        return Response(
            {"error": "Content not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if not Inscription.objects.filter(
        etudiant=request.user,
        cours=contenu.cours
    ).exists():
        return Response(
            {"error": "Not enrolled"},
            status=status.HTTP_403_FORBIDDEN
        )

    CompletedContent.objects.get_or_create(
        etudiant=request.user,
        contenu=contenu
    )

    total_contents = Contenu.objects.filter(
        cours=contenu.cours
    ).count()

    completed_contents = CompletedContent.objects.filter(
        etudiant=request.user,
        contenu__cours=contenu.cours
    ).count()

    progress = int(
        (completed_contents / total_contents) * 100
    )

    Progression.objects.update_or_create(
        etudiant=request.user,
        cours=contenu.cours,
        defaults={"progression": progress}
    )

    return Response({
        "message": "Content completed",
        "progression": progress
    })


# =====================================================
# RESULTS
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_results(request):

    results = Resultat.objects.filter(
        etudiant=request.user
    )

    serializer = ResultSerializer(
        results,
        many=True
    )

    return Response(serializer.data)


# =====================================================
# CGPA
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cgpa(request):

    results = Resultat.objects.filter(
        etudiant=request.user
    )

    if not results.exists():
        return Response({
            "cgpa": 0
        })

    total = sum(r.gpa or 0 for r in results)

    cgpa = total / results.count()

    return Response({
        "cgpa": round(cgpa, 2)
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
# CERTIFICAT JSON
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
# CERTIFICAT PDF
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
# RESULTS PDF
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_pdf(request):

    results = Resultat.objects.filter(
        etudiant=request.user
    )

    response = HttpResponse(
        content_type='application/pdf'
    )

    response['Content-Disposition'] = (
        f'attachment; filename="{request.user.username}_results.pdf"'
    )

    doc = SimpleDocTemplate(response)

    styles = getSampleStyleSheet()

    content = [
        Paragraph("Student Results", styles["Title"])
    ]

    for r in results:
        content.append(
            Paragraph(
                f"{r.cours.titre} : {r.note}",
                styles["Normal"]
            )
        )

    doc.build(content)

    return response


# =====================================================
# SECURE FILE DOWNLOAD
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