from django.urls import path
from . import views

urlpatterns = [

    # courses
    path('', views.get_courses),
    path('create/', views.create_course),
    path('<int:id>/', views.cours_detail),

    # enrollment
    path('inscription/', views.inscrire),

    # content
    path('<int:cours_id>/add-content/', views.add_content),
    path('complete/', views.complete_content),
    path('download/<int:contenu_id>/', views.download_content),

    # results
    path('results/', views.get_results),
    path('results/pdf/', views.generate_pdf),
    path('resultat/pdf/', views.generate_pdf),

    # progress
    path('progress/', views.get_progress),
    path('cgpa/', views.get_cgpa),

    # certificates
    path('certificat/<int:cours_id>/', views.get_certificat),
    path('certificat/<int:cours_id>/pdf/', views.certificat_pdf),
]