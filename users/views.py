from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import json

from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

@csrf_exempt
def login_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = data.get("username")
    password = data.get("password")

    user = authenticate(username=username, password=password)

    if user is None:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    refresh = RefreshToken.for_user(user)

    return JsonResponse({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    })
# ---------------------------
# REFRESH TOKEN
# ---------------------------
@csrf_exempt
def refresh_token_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        data = json.loads(request.body)
        refresh_token = data.get("refresh")
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)

        return JsonResponse({
            "access": access_token
        })

    except Exception:
        return JsonResponse({"error": "Invalid refresh token"}, status=401)


# ---------------------------
# LOGOUT (BLACKLIST)
# ---------------------------
@csrf_exempt
def logout_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=400)

    try:
        data = json.loads(request.body)
        refresh_token = data.get("refresh")

        token = RefreshToken(refresh_token)
        token.blacklist()

        return JsonResponse({"message": "Logged out successfully"})

    except Exception:
        return JsonResponse({"error": "Invalid token"}, status=400)