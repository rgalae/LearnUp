from .models import (
    Contenu,
    CompletedContent,
    Progression
)

from quiz.models import Quiz

from results.models import Resultat


def update_course_progress(user, cours):

    total_contents = Contenu.objects.filter(
        module__cours=cours
    ).count()

    completed_contents = CompletedContent.objects.filter(
        etudiant=user,
        contenu__module__cours=cours
    ).count()

    # lessons/videos/pdf = 80%
    content_progress = 0

    if total_contents > 0:
        content_progress = (
            completed_contents / total_contents
        ) * 80

    # quiz = 20%
    quiz_progress = 0

    quiz_exists = Quiz.objects.filter(
        module__cours=cours
    ).exists()

    passed_quiz = Resultat.objects.filter(
        etudiant=user,
        cours=cours,
        note__gte=50
    ).exists()

    if quiz_exists and passed_quiz:
        quiz_progress = 20

    total_progress = int(
        content_progress + quiz_progress
    )

    Progression.objects.update_or_create(
        etudiant=user,
        cours=cours,
        defaults={
            "progression": total_progress
        }
    )

    return total_progress