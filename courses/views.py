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

    modules = Module.objects.filter(cours=cours).order_by('order')
    modules_data = []

    for module in modules:
        contenus = Contenu.objects.filter(module=module).order_by('order')
        contenus_data = []
        for contenu in contenus:
            completed = CompletedContent.objects.filter(etudiant=request.user, contenu=contenu).exists()
            contenus_data.append({
                "id": contenu.id,
                "titre": contenu.titre,
                "video_url": contenu.video_url,
                "fichier": contenu.fichier.url if contenu.fichier else None,
                "completed": completed
            })
            
        quizzes = Quiz.objects.filter(module=module).order_by('order')
        quizzes_data = []
        for q in quizzes:
            quizzes_data.append({
                "id": q.id,
                "titre": q.titre
            })

        modules_data.append({
            "id": module.id,
            "titre": module.titre,
            "description": module.description,
            "contenus": contenus_data,
            "quizzes": quizzes_data
        })

    result = Resultat.objects.filter(etudiant=request.user, cours=cours).first()
    progress = Progression.objects.filter(etudiant=request.user, cours=cours).first()
    
    # Global quiz exists flag (can be removed if frontend iterates modules)
    quiz_exists = Quiz.objects.filter(module__cours=cours).exists()

    return Response({
        "id": cours.id,
        "titre": cours.titre,
        "description": cours.description,
        "enseignant": cours.enseignant.username,
        "progress": progress.progression if progress else 0,
        "score": result.note if result else 0,
        "quiz_exists": quiz_exists,
        "modules": modules_data
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

    if progress == 100:
        from users.models import Notification
        Notification.objects.create(
            user=contenu.cours.enseignant,
            message=f"Student {request.user.username} has completed {contenu.cours.titre}!"
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

        if result.note < 80:

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