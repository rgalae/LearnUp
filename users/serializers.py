from rest_framework import serializers


class RegisterSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=150)

    password = serializers.CharField(max_length=128)

    role = serializers.ChoiceField(
        choices=['teacher', 'student']
    )