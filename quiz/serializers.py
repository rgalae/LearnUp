from rest_framework import serializers

from .models import (
    Quiz,
    Question,
    Reponse
)


# =====================================================
# ANSWER SERIALIZER
# =====================================================

class ReponseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Reponse
        fields = [
            'id',
            'texte'
        ]


# =====================================================
# QUESTION SERIALIZER
# =====================================================

class QuestionSerializer(serializers.ModelSerializer):

    reponses = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            'question_id',
            'contenu',
            'type_question',
            'reponses'
        ]

    question_id = serializers.IntegerField(
        source='id'
    )

    contenu = serializers.CharField(
        source='texte'
    )

    def get_reponses(self, obj):
        responses = Reponse.objects.filter(
            question=obj
        )

        return ReponseSerializer(
            responses,
            many=True
        ).data


# =====================================================
# GET QUIZ SERIALIZER
# =====================================================

class QuizSerializer(serializers.ModelSerializer):

    questions = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'quiz_id',
            'titre',
            'questions'
        ]

    quiz_id = serializers.IntegerField(
        source='id'
    )

    def get_questions(self, obj):

        questions = Question.objects.filter(
            quiz=obj
        )

        return QuestionSerializer(
            questions,
            many=True
        ).data


# =====================================================
# SUBMIT ANSWER SERIALIZER
# =====================================================

class SubmitAnswerSerializer(serializers.Serializer):

    question_id = serializers.IntegerField()

    reponse_id = serializers.IntegerField()


# =====================================================
# SUBMIT QUIZ SERIALIZER
# =====================================================

class SubmitQuizSerializer(serializers.Serializer):

    quiz_id = serializers.IntegerField()

    answers = SubmitAnswerSerializer(
        many=True
    )


# =====================================================
# CREATE QUIZ SERIALIZER
# =====================================================

class CreateQuizSerializer(serializers.Serializer):

    cours_id = serializers.IntegerField()

    titre = serializers.CharField(
        max_length=255
    )


# =====================================================
# CREATE QUESTION SERIALIZER
# =====================================================

class CreateQuestionSerializer(serializers.Serializer):

    quiz_id = serializers.IntegerField()

    texte = serializers.CharField()

    type_question = serializers.CharField()


# =====================================================
# CREATE RESPONSE SERIALIZER
# =====================================================

class CreateResponseSerializer(serializers.Serializer):

    question_id = serializers.IntegerField()

    texte = serializers.CharField()

    est_correcte = serializers.BooleanField()