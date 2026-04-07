from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Equipamento, LoginLog


class EquipamentoSerializer(serializers.ModelSerializer):
    cadastrado_por = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Equipamento
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginLogSerializer(serializers.ModelSerializer):
    usuario = serializers.StringRelatedField()

    class Meta:
        model = LoginLog
        fields = '__all__'