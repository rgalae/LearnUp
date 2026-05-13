from django.urls import path

from . import views

urlpatterns = [

    # =====================================================
    # PUBLIC COURSES
    # =====================================================

    path(
        '',
        views.get_courses
    ),

    # =====================================================
    # STUDENT COURSES
    # =====================================================

    path(
        'my-courses/',
        views.my_courses
    ),

    # =====================================================
    # TEACHER COURSES
    # =====================================================

    path(
        'teacher-courses/',
        views.teacher_courses
    ),

    # =====================================================
    # CREATE COURSE
    # =====================================================

    path(
        'create/',
        views.create_course
    ),

    # =====================================================
    # COURSE DETAIL
    # =====================================================

    path(
        '<int:id>/',
        views.cours_detail
    ),

    path(
        'teacher/<int:id>/',
        views.teacher_course_detail
    ),

    # =====================================================
    # TEACHER STUDENTS
    # =====================================================

    path(
        'teacher/students/',
        views.teacher_students
    ),

    # =====================================================
    # UPDATE / DELETE COURSE
    # =====================================================

    path(
        '<int:id>/update/',
        views.update_course
    ),

    path(
        '<int:id>/delete/',
        views.delete_course
    ),

    # =====================================================
    # ENROLLMENT
    # =====================================================

    path(
        'inscription/',
        views.inscrire
    ),

    path(
    'desinscription/',
    views.desinscrire
),

    # =====================================================
    # CONTENT
    # =====================================================

    path(
        '<int:cours_id>/add-content/',
        views.add_content
    ),

    path(
        'complete/',
        views.complete_content
    ),

    path(
        'download/<int:contenu_id>/',
        views.download_content
    ),

    # =====================================================
    # CERTIFICATES
    # =====================================================

   # =====================================================
# CERTIFICATES
# =====================================================

    path(
        'certificat/<int:cours_id>/',
        views.get_certificat
    ),

    path(
        'certificat/<int:cours_id>/pdf/',
        views.certificat_pdf
    ),
    # =====================================================
    # PROGRESS
    # =====================================================

    path(
        'progress/',
        views.get_progress
    ),
]