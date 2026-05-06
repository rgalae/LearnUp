from rest_framework import serializers

from .models import (
    Cours,
    Contenu,
    Progression,
    Resultat
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
# COURSE DETAIL SERIALIZER
# =====================================================

class CourseDetailSerializer(serializers.ModelSerializer):

    contenus = ContenuSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Cours
        fields = [
            'id',
            'titre',
            'description',
            'contenus'
        ]


# =====================================================
# CREATE COURSE SERIALIZER
# =====================================================

class CreateCourseSerializer(serializers.Serializer):

    titre = serializers.CharField(max_length=255)

    description = serializers.CharField()


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


# =====================================================
# RESULT SERIALIZER
# =====================================================

class ResultSerializer(serializers.ModelSerializer):

    cours = serializers.CharField(
        source='cours.titre'
    )

    class Meta:
        model = Resultat
        fields = [
            'cours',
            'note',
            'grade',
            'gpa'
        ]