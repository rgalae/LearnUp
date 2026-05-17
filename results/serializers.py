from rest_framework import serializers

from users.models import User

from .models import Resultat


# =====================================================
# REGISTER SERIALIZER
# =====================================================

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True
    )

    class Meta:

        model = User

        fields = [
            'username',
            'email',
            'password',
            'role'
        ]

    def create(self, validated_data):

        user = User.objects.create_user(

            username=validated_data['username'],

            email=validated_data['email'],

            password=validated_data['password'],

            role=validated_data['role']
        )

        return user


# =====================================================
# LOGIN SERIALIZER
# =====================================================

class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField()


# =====================================================
# RESULT SERIALIZER
# =====================================================

class ResultSerializer(serializers.ModelSerializer):

    cours = serializers.StringRelatedField()

    class Meta:

        model = Resultat

        fields = '__all__'