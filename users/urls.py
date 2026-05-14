from django.urls import path

from .views import (
    login_view,
    refresh_token_view,
    logout_view,
    register_view,
    teacher_dashboard,
    teacher_results,
    student_dashboard,
    student_results,
    get_notifications,
    mark_notification_read,
    update_profile
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
        'student-dashboard/',
        student_dashboard
    ),

    path(
        'student-results/',
        student_results
    ),

    # =====================================================
    # TEACHER
    # =====================================================

    path(
        'teacher-dashboard/',
        teacher_dashboard
    ),

    path(
        'teacher-results/',
        teacher_results
    ),

    # =====================================================
    # PROFILE & NOTIFICATIONS
    # =====================================================

    path(
        'profile/update/',
        update_profile
    ),

    path(
        'notifications/',
        get_notifications
    ),

    path(
        'notifications/<int:id>/read/',
        mark_notification_read
    ),
]