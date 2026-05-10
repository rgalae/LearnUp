from django.urls import path

from .views import (
    get_results,
    get_cgpa,
    generate_pdf
)

urlpatterns = [

    path(
        '',
        get_results
    ),

    path(
        'cgpa/',
        get_cgpa
    ),

    path(
        'pdf/',
        generate_pdf
    ),
]