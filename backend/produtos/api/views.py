from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from ..models import Equipamento
from .serializers import EquipamentoSerializer

class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['categoria', 'gerenciamento', 'velocidade_uplink']