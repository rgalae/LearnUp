from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["role"] = user.role
        token["username"] = user.username
        token["email"] = user.email
        
        # Add profile picture if it exists
        if user.profile_picture:
            token["profile_picture"] = user.profile_picture.url
        else:
            token["profile_picture"] = None

        return token