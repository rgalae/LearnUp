from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_courses),

    path('inscription/', views.inscrire),

    path('results/', views.get_results),
    path('results/pdf/', views.generate_pdf),
    path('resultat/pdf/', views.generate_pdf),

    path('certificat/<int:cours_id>/', views.get_certificat),
    path('certificat/<int:cours_id>/pdf/', views.certificat_pdf),

    path('progress/', views.get_progress),
    path('cgpa/', views.get_cgpa),

    path('complete/', views.complete_content),

    path('<int:id>/', views.cours_detail),

    path('create/', views.create_course),
]