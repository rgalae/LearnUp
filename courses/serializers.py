from rest_framework import serializers

from .models import (
    Cours,
    Contenu,
    Progression,
   
)


# =====================================================
# CONTENT SERIALIZER
# =====================================================

class ContenuSerializer(serializers.ModelSerializer):

    completed = serializers.BooleanField(read_only=True)

    class Meta:
        model = Contenu
        fields = [
            'id',
            'titre',
            'video_url',
            'fichier',
            'completed'
        ]


# =====================================================
# COURSE LIST SERIALIZER
# =====================================================

class CourseListSerializer(serializers.ModelSerializer):

    enseignant = serializers.CharField(
        source='enseignant.username',
        read_only=True
    )

    class Meta:
        model = Cours
        fields = [
            'id',
            'titre',
            'description',
            'enseignant'
        ]


# =====================================================
# MODULE SERIALIZER
# =====================================================

from .models import Module
from quiz.models import Quiz

class ModuleSerializer(serializers.ModelSerializer):
    contenus = ContenuSerializer(
        many=True,
        read_only=True
    )
    
    quizzes = serializers.SerializerMethodField()
    
    class Meta:
        model = Module
        fields = [
            'id',
            'titre',
            'description',
            'order',
            'contenus',
            'quizzes'
        ]

    def get_quizzes(self, obj):
        quizzes = Quiz.objects.filter(module=obj).order_by('order')
        return [{"id": q.id, "titre": q.titre} for q in quizzes]

# =====================================================
# COURSE DETAIL SERIALIZER
# =====================================================

class CourseDetailSerializer(serializers.ModelSerializer):

    modules = ModuleSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Cours
        fields = [
            'id',
            'titre',
            'description',
            'modules'
        ]


# =====================================================
# CREATE COURSE SERIALIZER
# =====================================================

class CreateCourseSerializer(serializers.Serializer):

    titre = serializers.CharField(max_length=255)

    description = serializers.CharField()


# =====================================================
# CREATE MODULE SERIALIZER
# =====================================================

class CreateModuleSerializer(serializers.Serializer):
    cours_id = serializers.IntegerField()
    titre = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)


# =====================================================
# ENROLL SERIALIZER
# =====================================================

class EnrollSerializer(serializers.Serializer):

    cours_id = serializers.IntegerField()


# =====================================================
# COMPLETE CONTENT SERIALIZER
# =====================================================

class CompleteContentSerializer(serializers.Serializer):

    contenu_id = serializers.IntegerField()


# =====================================================
# PROGRESSION SERIALIZER
# =====================================================

class ProgressionSerializer(serializers.ModelSerializer):

    cours = serializers.CharField(
        source='cours.titre'
    )

    class Meta:
        model = Progression
        fields = [
            'cours',
            'progression'
        ]


