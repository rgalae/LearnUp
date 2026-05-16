from django.urls import path

from .views import (
    get_quiz,
    submit_quiz,
    create_quiz,
    create_question,
    create_response,
    delete_quiz
)

urlpatterns = [

    # student
    path(
        '<int:quiz_id>/',
        get_quiz
    ),

    path(
        'submit/',
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

    path(
        '<int:quiz_id>/delete/',
        delete_quiz
    ),
]