from rest_framework import serializers
from ..models import Equipamento

class EquipamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipamento
        fields = '__all__'  # Enviar todos os campos para o front/react