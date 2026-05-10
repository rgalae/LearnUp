from django.urls import path

from . import views

urlpatterns = [

    # courses
    path('', views.get_courses),
    path('create/', views.create_course),

    path('<int:id>/', views.cours_detail),
    path('teacher/<int:id>/', views.teacher_course_detail),

    # manage courses
    path('<int:id>/update/', views.update_course),
    path('<int:id>/delete/', views.delete_course),

    # enrollment
    path('inscription/', views.inscrire),

    # content
    path('<int:cours_id>/add-content/', views.add_content),
    path('complete/', views.complete_content),
    path('download/<int:contenu_id>/', views.download_content),

    # progress
    path('progress/', views.get_progress),
]