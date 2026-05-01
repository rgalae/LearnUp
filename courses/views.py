from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Resultat, Certificat


@login_required
def get_results(request):
    user = request.user
    results = Resultat.objects.filter(etudiant=user)

    data = []
    for r in results:
        data.append({
            "cours": r.cours.titre,
            "note": r.note
        })

    return JsonResponse(data, safe=False)


@login_required
def get_certificat(request, cours_id):
    user = request.user

    try:
        result = Resultat.objects.get(etudiant=user, cours_id=cours_id)

        if result.note >= 10:
            certificat, created = Certificat.objects.get_or_create(
                etudiant=user,
                cours_id=cours_id
            )

            return JsonResponse({
                "message": "Certificat généré",
                "cours_id": cours_id,
                "note": result.note,
                "created": created
            })

        else:
            return JsonResponse({
                "error": "Note insuffisante"
            }, status=403)

    except Resultat.DoesNotExist:
        return JsonResponse({
            "error": "Aucun résultat"
        }, status=404)