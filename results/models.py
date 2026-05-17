from django.db import models

from django.conf import settings

from courses.models import Cours

User = settings.AUTH_USER_MODEL


class Resultat(models.Model):

    etudiant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='resultats'
    )

    cours = models.ForeignKey(
        Cours,
        on_delete=models.CASCADE,
        related_name='resultats'
    )

    note = models.FloatField()

    grade = models.CharField(
        max_length=2,
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.etudiant} - {self.cours} ({self.note})"

    def save(self, *args, **kwargs):

        if self.note >= 16:
            self.grade = "A"

        elif self.note >= 14:
            self.grade = "B"

        elif self.note >= 12:
            self.grade = "C"

        elif self.note >= 10:
            self.grade = "D"

        else:
            self.grade = "F"

        super().save(*args, **kwargs)