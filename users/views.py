from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            # Vérification de l'utilisateur dans la base de données
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                return JsonResponse({"status": "success", "message": "Logged in successfully"}, status=200)
            else:
                return JsonResponse({"status": "error", "message": "Invalid username or password"}, status=401)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
            
    return JsonResponse({"status": "error", "message": "Only POST requests are allowed"}, status=405)