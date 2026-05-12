from django.urls import path

from .views import (
    login_view,
    refresh_token_view,
    logout_view,
    register_view,
    teacher_dashboard
)

urlpatterns = [

    path('register/', register_view),

    path('login/', login_view),

    path('refresh/', refresh_token_view),

    path('logout/', logout_view),

    path('teacher-dashboard/', teacher_dashboard),
]