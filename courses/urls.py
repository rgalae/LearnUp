from django.urls import path   
from . import views            

urlpatterns = [
    path('results/', views.get_results),
    path('certificat/<int:cours_id>/', views.get_certificat),
]