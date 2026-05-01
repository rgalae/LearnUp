from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL


# ---------------------------
# PROGRAMME
# ---------------------------
class Programme(models.Model):
    titre = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.titre

    class Meta:
        verbose_name = "Programme"
        verbose_name_plural = "Programmes"


# ---------------------------
# COURS
# ---------------------------
class Cours(models.Model):
    titre = models.CharField(max_length=255)
    description = models.TextField()
    enseignant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cours_enseignes')
    programme = models.ForeignKey(Programme, on_delete=models.CASCADE, null=True, blank=True, related_name='cours')

    def __str__(self):
        return self.titre

    class Meta:
        verbose_name = "Cours"
        verbose_name_plural = "Cours"


# ---------------------------
# INSCRIPTION
# ---------------------------
class Inscription(models.Model):
    etudiant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inscriptions')
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE, related_name='inscriptions')
    date_inscription = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.etudiant} inscrit à {self.cours}"

    class Meta:
        verbose_name = "Inscription"
        verbose_name_plural = "Inscriptions"
        unique_together = ('etudiant', 'cours')


# ---------------------------
# CONTENU
# ---------------------------
class Contenu(models.Model):
    titre = models.CharField(max_length=255)
    fichier = models.FileField(upload_to='contenus/', null=True, blank=True)
    video_url = models.URLField(null=True, blank=True)
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE, related_name='contenus')
    date_upload = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titre

    class Meta:
        verbose_name = "Contenu"
        verbose_name_plural = "Contenus"


# ---------------------------
# RESULTAT (MISSING BEFORE)
# ---------------------------
class Resultat(models.Model):
    etudiant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resultats')
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE, related_name='resultats')
    note = models.FloatField()

    def __str__(self):
        return f"{self.etudiant} - {self.note}"

    class Meta:
        verbose_name = "Résultat"
        verbose_name_plural = "Résultats"
        unique_together = ('etudiant', 'cours')


# ---------------------------
# PROGRESSION (MISSING BEFORE)
# ---------------------------
class Progression(models.Model):
    etudiant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progressions')
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE, related_name='progressions')
    progression = models.FloatField(default=0)  # percentage

    def __str__(self):
        return f"{self.etudiant} - {self.cours} ({self.progression}%)"

    class Meta:
        verbose_name = "Progression"
        verbose_name_plural = "Progressions"
        unique_together = ('etudiant', 'cours')


# ---------------------------
# CERTIFICAT
# ---------------------------
class Certificat(models.Model):
    etudiant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='certificats')
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE, related_name='certificats')
    date_obtention = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.etudiant} - {self.cours}"

    class Meta:
        verbose_name = "Certificat"
        verbose_name_plural = "Certificats"
        unique_together = ('etudiant', 'cours')