from rest_framework import serializers

from .models import Resultat


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