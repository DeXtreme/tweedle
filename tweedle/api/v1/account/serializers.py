from rest_framework import serializers
from .models import Account,Trophy

class TrophySerializer(serializers.ModelSerializer):
    class Meta:
        model = Trophy
        exclude = ["account"]


class RanksSerializer(serializers.ModelSerializer):
    trophies = TrophySerializer(many=True)
    rank = serializers.IntegerField()
    class Meta:
        model = Account
        exclude = ["user"]

class AccountSerializer(serializers.ModelSerializer):
    trophies = TrophySerializer(many=True)
    ranks = RanksSerializer(many=True)
    class Meta:
        model = Account
        exclude = ["user"]

class LeaderboardSerializer(serializers.ModelSerializer):
    trophies = TrophySerializer(many=True)
    class Meta:
        model = Account
        exclude = ["user"]    

class SigninSerializer(serializers.Serializer):
    token = serializers.CharField()

class LikeSerializer(serializers.Serializer):
    like = serializers.BooleanField()