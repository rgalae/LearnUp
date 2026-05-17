from django.shortcuts import get_object_or_404
from django.http import FileResponse, HttpResponse
from django.db import models

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
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
    CompletedContent,
    Module
)

from .serializers import (
    CourseListSerializer,
    CourseDetailSerializer,
    CreateCourseSerializer,
    EnrollSerializer,
    CompleteContentSerializer,
    ProgressionSerializer,
    ContenuSerializer,
    CreateModuleSerializer
)

from results.models import Resultat

from quiz.models import Quiz

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
@permission_classes([AllowAny])
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

    # Notify all students
    from django.contrib.auth import get_user_model
    from users.models import Notification
    User = get_user_model()
    students = User.objects.filter(role='student')
    notifications = [
        Notification(
            user=student,
            message=f"New course available: {cours.titre} by {request.user.username}"
        ) for student in students
    ]
    Notification.objects.bulk_create(notifications)

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
# UNENROLL COURSE
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@student_required
def desinscrire(request):

    cours_id = request.data.get("cours_id")

    inscription = Inscription.objects.filter(
        etudiant=request.user,
        cours_id=cours_id
    ).first()

    if not inscription:

        return Response(
            {"error": "Not enrolled"},
            status=status.HTTP_404_NOT_FOUND
        )

    inscription.delete()

    return Response({
        "message": "Unenrolled successfully"
    })

# =====================================================
# COURSE DETAIL (STUDENT)
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@student_required
def cours_detail(request, id):
    cours = get_object_or_404(Cours, id=id)

    enrolled = Inscription.objects.filter(
        etudiant=request.user,
        cours=cours
    ).exists()

    if not enrolled:
        return Response(
            {"error": "Not enrolled"},
            status=status.HTTP_403_FORBIDDEN
        )

    # Use serializer for the core structure
    serializer = CourseDetailSerializer(cours)
    data = serializer.data

    # Add student-specific fields
    progress = Progression.objects.filter(etudiant=request.user, cours=cours).first()
    result = Resultat.objects.filter(etudiant=request.user, cours=cours).first()
    
    data["progress"] = progress.progression if progress else 0
    data["score"] = result.note if result else 0
    data["enseignant"] = cours.enseignant.username
    
    # Update modules with completion status
    for module_data in data["modules"]:
        for contenu_data in module_data["contenus"]:
            contenu_data["completed"] = CompletedContent.objects.filter(
                etudiant=request.user, 
                contenu_id=contenu_data["id"]
            ).exists()

    return Response(data)


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

    students_count = Inscription.objects.filter(cours=cours).count()
    results = Resultat.objects.filter(cours=cours)
    
    avg_score = 0
    if results.exists():
        avg_score = round(sum(r.note for r in results) / results.count(), 1)
        
    serializer = CourseDetailSerializer(cours)

    return Response({
        "id": cours.id,
        "titre": cours.titre,
        "description": cours.description,
        "students": students_count,
        "average_score": avg_score,
        "modules": serializer.data.get('modules', [])
    })


# =====================================================
# CREATE MODULE
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@teacher_required
def create_module(request):
    serializer = CreateModuleSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    cours = get_object_or_404(Cours, id=serializer.validated_data['cours_id'], enseignant=request.user)
    
    # Get max order
    max_order = Module.objects.filter(cours=cours).aggregate(max_order=models.Max('order'))['max_order']
    next_order = 0 if max_order is None else max_order + 1
    
    module = Module.objects.create(
        titre=serializer.validated_data['titre'],
        description=serializer.validated_data.get('description', ''),
        cours=cours,
        order=next_order
    )
    
    return Response({"message": "Module created", "id": module.id})

# =====================================================
# UPDATE MODULE
# =====================================================

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@teacher_required
def update_module(request, module_id):
    module = get_object_or_404(Module, id=module_id, cours__enseignant=request.user)
    module.titre = request.data.get("titre", module.titre)
    module.description = request.data.get("description", module.description)
    module.save()
    return Response({"message": "Module updated"})

# =====================================================
# DELETE MODULE
# =====================================================

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@teacher_required
def delete_module(request, module_id):
    module = get_object_or_404(Module, id=module_id, cours__enseignant=request.user)
    module.delete()
    return Response({"message": "Module deleted"})

# =====================================================
# REORDER MODULES
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@teacher_required
def reorder_modules(request):
    modules_data = request.data.get("modules", []) # List of {id, order}
    for m in modules_data:
        Module.objects.filter(id=m['id'], cours__enseignant=request.user).update(order=m['order'])
    return Response({"message": "Modules reordered"})


# =====================================================
# ADD CONTENT
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@teacher_required
def add_content(request, module_id):

    module = get_object_or_404(
        Module,
        id=module_id,
        cours__enseignant=request.user
    )

    titre = request.data.get("titre")

    if not titre:
        return Response(
            {"error": "Title required"},
            status=status.HTTP_400_BAD_REQUEST
        )
        
    max_order = Contenu.objects.filter(module=module).aggregate(max_order=models.Max('order'))['max_order']
    next_order = 0 if max_order is None else max_order + 1

    contenu = Contenu.objects.create(
        titre=titre,
        video_url=request.data.get("video_url"),
        fichier=request.data.get("fichier"),
        module=module,
        order=next_order
    )

    # Notify enrolled students
    from users.models import Notification
    inscriptions = Inscription.objects.filter(cours=module.cours)
    notifications = [
        Notification(
            user=inscription.etudiant,
            message=f"New content '{titre}' added to {module.cours.titre}"
        ) for inscription in inscriptions
    ]
    if notifications:
        Notification.objects.bulk_create(notifications)

    return Response({
        "message": "Content added",
        "content_id": contenu.id
    })


# =====================================================
# UPDATE CONTENT
# =====================================================

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@teacher_required
def update_content(request, content_id):
    contenu = get_object_or_404(
        Contenu,
        id=content_id,
        module__cours__enseignant=request.user
    )
    
    contenu.titre = request.data.get("titre", contenu.titre)
    contenu.video_url = request.data.get("video_url", contenu.video_url)
    
    if 'fichier' in request.FILES:
        contenu.fichier = request.FILES['fichier']
    elif 'fichier' in request.data and request.data['fichier'] is None:
        contenu.fichier = None
        
    contenu.save()
    
    return Response({"message": "Content updated"})


# =====================================================
# DELETE CONTENT
# =====================================================

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@teacher_required
def delete_content(request, content_id):
    contenu = get_object_or_404(
        Contenu,
        id=content_id,
        module__cours__enseignant=request.user
    )
    contenu.delete()
    return Response({"message": "Content deleted"})


# =====================================================
# REORDER CONTENT
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@teacher_required
def reorder_content(request, module_id):
    module = get_object_or_404(Module, id=module_id, cours__enseignant=request.user)
    content_data = request.data.get("contents", []) # List of {id, order}
    for item in content_data:
        Contenu.objects.filter(id=item['id'], module=module).update(order=item['order'])
    return Response({"message": "Content reordered"})


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
        contenu.module.cours
    )

    if progress == 100:
        from users.models import Notification
        Notification.objects.create(
            user=contenu.module.cours.enseignant,
            message=f"Student {request.user.username} has completed {contenu.module.cours.titre}!"
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
# RETAKE COURSE
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@student_required
def retake_course(request, cours_id):
    cours = get_object_or_404(Cours, id=cours_id)
    
    if not Inscription.objects.filter(etudiant=request.user, cours=cours).exists():
        return Response({"error": "Not enrolled"}, status=status.HTTP_403_FORBIDDEN)
        
    Resultat.objects.filter(etudiant=request.user, cours=cours).delete()
    Progression.objects.filter(etudiant=request.user, cours=cours).delete()
    CompletedContent.objects.filter(etudiant=request.user, contenu__module__cours=cours).delete()
    
    from quiz.models import Tentative
    Tentative.objects.filter(etudiant=request.user, quiz__module__cours=cours).delete()
    Certificat.objects.filter(etudiant=request.user, cours=cours).delete()

    return Response({"message": "Course progress reset successfully."})

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
        and contenu.module.cours.enseignant == request.user
    )

    is_enrolled_student = Inscription.objects.filter(
        etudiant=request.user,
        cours=contenu.module.cours
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

        if result.note < 80:
            return Response(
                {"error": "Insufficient grade"},
                status=status.HTTP_403_FORBIDDEN
            )

        certificat, created = Certificat.objects.get_or_create(
            etudiant=request.user,
            cours_id=cours_id,
            defaults={"score": result.note}
        )

        # Update score if re-fetching
        if not created and certificat.score != result.note:
            certificat.score = result.note
            certificat.save()

        return Response({
            "message": "Certificate generated",
            "created": created,
            "certificate_id": str(certificat.certificate_id),
            "student": request.user.get_full_name() or request.user.username,
            "course": result.cours.titre,
            "score": certificat.score,
            "date": certificat.date_obtention.strftime('%B %d, %Y'),
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

        if result.note < 80:
            return Response(
                {"error": "Insufficient grade"},
                status=status.HTTP_403_FORBIDDEN
            )

        certificat, _ = Certificat.objects.get_or_create(
            etudiant=request.user,
            cours_id=cours_id,
            defaults={"score": result.note}
        )

        from reportlab.lib.pagesizes import A4, landscape
        from reportlab.lib.units import cm
        from reportlab.lib import colors
        from reportlab.lib.styles import ParagraphStyle
        from reportlab.platypus import Table, TableStyle
        from reportlab.pdfgen import canvas
        import io

        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=landscape(A4))
        width, height = landscape(A4)

        # Background gradient (dark blue)
        c.setFillColorRGB(0.05, 0.08, 0.18)
        c.rect(0, 0, width, height, fill=True, stroke=False)

        # Decorative border
        c.setStrokeColorRGB(0.42, 0.38, 0.85)
        c.setLineWidth(4)
        c.rect(1.5*cm, 1.5*cm, width - 3*cm, height - 3*cm, fill=False, stroke=True)
        c.setLineWidth(1)
        c.setStrokeColorRGB(0.62, 0.58, 1.0)
        c.rect(1.8*cm, 1.8*cm, width - 3.6*cm, height - 3.6*cm, fill=False, stroke=True)

        # Title
        c.setFillColorRGB(0.85, 0.82, 1.0)
        c.setFont("Helvetica-Bold", 36)
        c.drawCentredString(width / 2, height - 4.5*cm, "CERTIFICATE OF ACHIEVEMENT")

        # Subtitle line
        c.setFillColorRGB(0.62, 0.58, 1.0)
        c.setFont("Helvetica", 14)
        c.drawCentredString(width / 2, height - 5.5*cm, "This certificate is proudly presented to")

        # Student name
        student_name = request.user.get_full_name() or request.user.username
        c.setFillColorRGB(1.0, 1.0, 1.0)
        c.setFont("Helvetica-BoldOblique", 40)
        c.drawCentredString(width / 2, height - 8*cm, student_name)

        # Divider
        c.setStrokeColorRGB(0.42, 0.38, 0.85)
        c.setLineWidth(1.5)
        c.line(width*0.2, height - 8.8*cm, width*0.8, height - 8.8*cm)

        # Course
        c.setFillColorRGB(0.7, 0.7, 1.0)
        c.setFont("Helvetica", 15)
        c.drawCentredString(width / 2, height - 10*cm,
            f"for successfully completing the course")
        c.setFillColorRGB(0.9, 0.85, 1.0)
        c.setFont("Helvetica-Bold", 20)
        c.drawCentredString(width / 2, height - 11.2*cm, result.cours.titre)

        # Score & Date row
        c.setFillColorRGB(0.6, 0.6, 0.9)
        c.setFont("Helvetica", 13)
        c.drawCentredString(width * 0.35, height - 13*cm, f"Score: {certificat.score:.0f}%")
        c.drawCentredString(width * 0.65, height - 13*cm,
            f"Date: {certificat.date_obtention.strftime('%B %d, %Y')}")

        # Certificate ID
        c.setFillColorRGB(0.4, 0.4, 0.6)
        c.setFont("Helvetica", 9)
        c.drawCentredString(width / 2, 2.8*cm,
            f"Certificate ID: {certificat.certificate_id}")

        # LearnUp watermark
        c.setFillColorRGB(0.62, 0.58, 1.0)
        c.setFont("Helvetica-Bold", 16)
        c.drawCentredString(width / 2, 2.0*cm, "LearnUp Learning Platform")

        c.save()
        buffer.seek(0)

        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = (
            f'attachment; filename="certificate_{cours_id}.pdf"'
        )
        return response

    except Resultat.DoesNotExist:
        return Response(
            {"error": "No result found"},
            status=status.HTTP_404_NOT_FOUND
        )


# =====================================================
# TEACHER ANALYTICS  (detailed with filters)
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@teacher_required
def teacher_analytics(request):
    """
    Enhanced analytics endpoint.
    Query params:
      course_id  - filter by specific course
      status     - 'passed' | 'failed'
      sort       - 'highest' | 'lowest' | 'name'
    """
    from results.models import Resultat

    course_id = request.query_params.get('course_id')
    filter_status = request.query_params.get('status')   # 'passed' | 'failed'
    sort_by = request.query_params.get('sort', 'name')   # 'highest' | 'lowest' | 'name'

    if course_id:
        teacher_courses = Cours.objects.filter(id=course_id, enseignant=request.user)
    else:
        teacher_courses = Cours.objects.filter(enseignant=request.user)

    inscriptions = Inscription.objects.filter(cours__in=teacher_courses).select_related('etudiant', 'cours')

    rows = []
    for ins in inscriptions:
        result = Resultat.objects.filter(etudiant=ins.etudiant, cours=ins.cours).first()
        score = result.note if result else 0
        prog = Progression.objects.filter(etudiant=ins.etudiant, cours=ins.cours).first()
        progression = prog.progression if prog else 0
        cert_exists = Certificat.objects.filter(etudiant=ins.etudiant, cours=ins.cours).exists()

        rows.append({
            "student": ins.etudiant.username,
            "student_name": ins.etudiant.get_full_name() or ins.etudiant.username,
            "email": ins.etudiant.email,
            "course": ins.cours.titre,
            "course_id": ins.cours.id,
            "score": score,
            "progression": progression,
            "status": "Passed" if score >= 80 else "Failed",
            "completed": progression >= 100,
            "certificate": cert_exists,
        })

    # Filter by status
    if filter_status == 'passed':
        rows = [r for r in rows if r['status'] == 'Passed']
    elif filter_status == 'failed':
        rows = [r for r in rows if r['status'] == 'Failed']

    # Sort
    if sort_by == 'highest':
        rows.sort(key=lambda r: r['score'], reverse=True)
    elif sort_by == 'lowest':
        rows.sort(key=lambda r: r['score'])
    else:
        rows.sort(key=lambda r: r['student'])

    # Summary stats per course
    course_stats = []
    for course in teacher_courses:
        course_results = Resultat.objects.filter(cours=course)
        enrolled = Inscription.objects.filter(cours=course).count()
        passed = course_results.filter(note__gte=80).count()
        avg = round(sum(r.note for r in course_results) / course_results.count(), 1) if course_results.exists() else 0
        course_stats.append({
            "id": course.id,
            "titre": course.titre,
            "enrolled": enrolled,
            "passed": passed,
            "failed": enrolled - passed,
            "average_score": avg,
        })

    return Response({
        "students": rows,
        "course_stats": course_stats,
        "total_students": len(rows),
        "passed_count": sum(1 for r in rows if r['status'] == 'Passed'),
        "failed_count": sum(1 for r in rows if r['status'] == 'Failed'),
    })


# =====================================================
# TEACHER STUDENTS
# =====================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@teacher_required
def teacher_students(request):
    teacher_courses = Cours.objects.filter(enseignant=request.user)
    inscriptions = Inscription.objects.filter(cours__in=teacher_courses).select_related('etudiant', 'cours')

    from results.models import Resultat
    data = []
    seen = set()
    for ins in inscriptions:
        key = (ins.etudiant.id, ins.cours.id)
        if key in seen:
            continue
        seen.add(key)
        result = Resultat.objects.filter(etudiant=ins.etudiant, cours=ins.cours).first()
        data.append({
            "student": ins.etudiant.username,
            "email": ins.etudiant.email,
            "course": ins.cours.titre,
            "score": result.note if result else 0,
            "status": "Passed" if (result and result.note >= 80) else "Failed",
        })

    return Response(data)