from django.contrib import admin
from .models import Quiz, Question, Reponse, Tentative

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Reponse)
admin.site.register(Tentative)
