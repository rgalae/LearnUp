from django.db import models
from django.conf import settings
from courses.models import Cours

User = settings.AUTH_USER_MODEL


class Quiz(models.Model):
    titre = models.CharField(max_length=255)
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE)

    def __str__(self):
        return self.titre

    class Meta:
        verbose_name = "Quiz"
        verbose_name_plural = "Quiz"


class Question(models.Model):
    TYPE_CHOIX = 'choix'
    TYPE_OUVERTE = 'ouverte'

    TYPE_CHOICES = [
        (TYPE_CHOIX, 'Choix multiple'),
        (TYPE_OUVERTE, 'Ouverte'),
    ]

    texte = models.TextField()
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    type_question = models.CharField(max_length=20, choices=TYPE_CHOICES)

    def __str__(self):
        return self.texte

    class Meta:
        verbose_name = "Question"
        verbose_name_plural = "Questions"


class Reponse(models.Model):
    texte = models.CharField(max_length=255)
    est_correcte = models.BooleanField(default=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    def __str__(self):
        return self.texte

    class Meta:
        verbose_name = "Reponse"
        verbose_name_plural = "Reponses"


class Tentative(models.Model):
    etudiant = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    date_debut = models.DateTimeField(auto_now_add=True)
    date_fin = models.DateTimeField(null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.etudiant} - {self.quiz}"

    class Meta:
        verbose_name = "Tentative"
        verbose_name_plural = "Tentatives"


