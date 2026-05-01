from django.contrib import admin
from .models import Cours, Inscription, Contenu, Certificat, Progression, Resultat


admin.site.register(Cours)
admin.site.register(Inscription)
admin.site.register(Contenu)
admin.site.register(Certificat)
admin.site.register(Progression)
admin.site.register(Resultat)
