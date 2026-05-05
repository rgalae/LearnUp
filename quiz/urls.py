from django.urls import path
from .views import get_quiz, submit_quiz

urlpatterns = [
    path('<int:cours_id>/', get_quiz),
    path('submit/', submit_quiz),
]