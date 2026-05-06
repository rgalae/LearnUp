from django.urls import path

from .views import (
    get_quiz,
    submit_quiz,
    create_quiz,
    create_question,
    create_response
)

urlpatterns = [

    # student
    path(
        '<int:cours_id>/',
        get_quiz
    ),

    path(
        'submit/',
        submit_quiz
    ),

    path(
        'reponse/',
        submit_quiz
    ),

    # teacher
    path(
        'create/',
        create_quiz
    ),

    path(
        'question/create/',
        create_question
    ),

    path(
        'response/create/',
        create_response
    ),
]