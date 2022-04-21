from rest_framework import serializers
from .models import Account,Trophy

class TrophySerializer(serializers.ModelSerializer):
    class Meta:
        model = Trophy
        exclude = ["account"]

class AccountSerializer(serializers.ModelSerializer):
    trophies = TrophySerializer(many=True)
    class Meta:
        model = Account
        exclude = ["user",]


class SigninSerializer(serializers.Serializer):
    token = serializers.CharField()