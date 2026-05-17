from django.urls import path

from .views import (
    login_view,
    refresh_token_view,
    logout_view,
    register_view,
    teacher_results,
    student_results
)

urlpatterns = [

    # =====================================================
    # AUTH
    # =====================================================

    path(
        'register/',
        register_view
    ),

    path(
        'login/',
        login_view
    ),

    path(
        'refresh/',
        refresh_token_view
    ),

    path(
        'logout/',
        logout_view
    ),

    # =====================================================
    # STUDENT
    # =====================================================



    path(
        'student-results/',
        student_results
    ),

    # =====================================================
    # TEACHER
    # =====================================================

    path(
        'teacher-results/',
        teacher_results
    ),
]