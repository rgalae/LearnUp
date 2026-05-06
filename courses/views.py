from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import (
    Cours, Inscription, Contenu,
    Resultat, Certificat, Progression, CompletedContent
)

from functools import wraps
from django.http import JsonResponse


def teacher_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if request.user.role != "teacher":
            return JsonResponse({"error": "Teacher only"}, status=403)
        return view_func(request, *args, **kwargs)
    return wrapper


def student_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if request.user.role != "student":
            return JsonResponse({"error": "Student only"}, status=403)
        return view_func(request, *args, **kwargs)
    return wrapper


# ---------------------------
# COMPLETE CONTENT
# ---------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_content(request):
    contenu_id = request.data.get("contenu_id")

    try:
        contenu = Contenu.objects.get(id=contenu_id)
    except Contenu.DoesNotExist:
        return JsonResponse({"error": "Contenu not found"}, status=404)

    CompletedContent.objects.get_or_create(
        etudiant=request.user,
        contenu=contenu
    )

    return JsonResponse({"message": "Content marked as completed"})


# ---------------------------
# PDF RESULTS
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_pdf(request):
    results = Resultat.objects.filter(etudiant=request.user)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{request.user.username}_results.pdf"'

    doc = SimpleDocTemplate(response)
    styles = getSampleStyleSheet()

    content = [Paragraph("Résultats de l'étudiant", styles["Title"])]

    for r in results:
        content.append(Paragraph(f"{r.cours.titre} : {r.note}", styles["Normal"]))

    doc.build(content)
    return response


# ---------------------------
# PDF CERTIFICAT
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def certificat_pdf(request, cours_id):
    try:
        result = Resultat.objects.get(etudiant=request.user, cours_id=cours_id)

        if result.note < 10:
            return JsonResponse({"error": "Note insuffisante"}, status=403)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="certificat_{cours_id}.pdf"'

        doc = SimpleDocTemplate(response)
        styles = getSampleStyleSheet()

        content = [
            Paragraph("CERTIFICAT DE RÉUSSITE", styles["Title"]),
            Spacer(1, 20),
            Paragraph(f"Étudiant: {request.user.username}", styles["Normal"]),
            Paragraph(f"Cours: {result.cours.titre}", styles["Normal"]),
            Paragraph(f"Note: {result.note}", styles["Normal"]),
        ]

        doc.build(content)
        return response

    except Resultat.DoesNotExist:
        return JsonResponse({"error": "Aucun résultat"}, status=404)


# ---------------------------
# GET COURSES
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_courses(request):
    courses = Cours.objects.all()

    data = [{
        "id": c.id,
        "titre": c.titre,
        "description": c.description,
        "enseignant": str(c.enseignant),
    } for c in courses]

    return JsonResponse(data, safe=False)


# ---------------------------
# INSCRIPTION
# ---------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@student_required
def inscrire(request):
    cours_id = request.data.get("cours_id")

    try:
        cours = Cours.objects.get(id=cours_id)
    except Cours.DoesNotExist:
        return JsonResponse({"error": "Cours not found"}, status=404)

    inscription, created = Inscription.objects.get_or_create(
        etudiant=request.user,
        cours=cours
    )

    return JsonResponse({
        "message": "Inscription successful",
        "created": created
    })

# ---------------------------
# COURSE DETAIL
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cours_detail(request, id):
    try:
        cours = Cours.objects.get(id=id)
    except Cours.DoesNotExist:
        return JsonResponse({"error": "Cours not found"}, status=404)

    if not Inscription.objects.filter(etudiant=request.user, cours=cours).exists():
        return JsonResponse({"error": "Not enrolled"}, status=403)

    contenus = Contenu.objects.filter(cours=cours)

    data = [{
        "id": c.id,
        "titre": c.titre,
        "video_url": c.video_url,
        "fichier": c.fichier.url if c.fichier else None
    } for c in contenus]

    return JsonResponse({
        "id": cours.id,
        "titre": cours.titre,
        "description": cours.description,
        "contenus": data
    })


# ---------------------------
# RESULTS
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_results(request):
    results = Resultat.objects.filter(etudiant=request.user)

    data = [{
        "cours": r.cours.titre,
        "note": r.note,
        "grade": r.grade,
        "gpa": r.gpa
    } for r in results]

    return JsonResponse(data, safe=False)


# ---------------------------
# CGPA
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cgpa(request):
    results = Resultat.objects.filter(etudiant=request.user)

    if not results.exists():
        return JsonResponse({"cgpa": 0})

    total = sum(r.gpa or 0 for r in results)
    cgpa = total / results.count()

    return JsonResponse({"cgpa": round(cgpa, 2)})


# ---------------------------
# CERTIFICAT JSON
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_certificat(request, cours_id):
    try:
        result = Resultat.objects.get(etudiant=request.user, cours_id=cours_id)

        if result.note >= 10:
            certificat, created = Certificat.objects.get_or_create(
                etudiant=request.user,
                cours_id=cours_id
            )

            return JsonResponse({
                "message": "Certificat généré",
                "cours_id": cours_id,
                "note": result.note,
                "created": created
            })

        return JsonResponse({"error": "Note insuffisante"}, status=403)

    except Resultat.DoesNotExist:
        return JsonResponse({"error": "Aucun résultat"}, status=404)


# ---------------------------
# PROGRESSION
# ---------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_progress(request):
    user = request.user
    data = []

    for course in Cours.objects.all():
        total = Contenu.objects.filter(cours=course).count()

        completed = CompletedContent.objects.filter(
            etudiant=user,
            contenu__cours=course
        ).count()

        progress = int((completed / total) * 100) if total > 0 else 0

        data.append({
            "cours": course.titre,
            "progression": progress
        })

    return JsonResponse(data, safe=False)

# ---------------------------
# CREATE COURSE (TEACHER ONLY)
# ---------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@teacher_required
def create_course(request):
    titre = request.data.get("titre")
    description = request.data.get("description")

    if not titre:
        return JsonResponse({"error": "Title required"}, status=400)

    cours = Cours.objects.create(
        titre=titre,
        description=description,
        enseignant=request.user
    )

    return JsonResponse({
        "message": "Course created",
        "id": cours.id
    })