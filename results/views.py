from django.http import HttpResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import getSampleStyleSheet

from .models import Resultat

from .serializers import ResultSerializer


# =====================================================
# GET RESULTS
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

    total = sum(
        r.gpa or 0 for r in results
    )

    cgpa = total / results.count()

    return Response({
        "cgpa": round(cgpa, 2)
    })


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
        Paragraph(
            "Student Results",
            styles["Title"]
        )
    ]

    for r in results:

        content.append(
            Spacer(1, 12)
        )

        content.append(
            Paragraph(
                f"{r.cours.titre} : {r.note}",
                styles["Normal"]
            )
        )

    doc.build(content)

    return response