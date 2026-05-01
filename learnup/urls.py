from django.contrib import admin
from django.urls import path, include  # 👈 ADD include

urlpatterns = [
    path('admin/', admin.site.urls),

    # 👇 ADD THIS LINE
    path('courses/', include('courses.urls')),
]