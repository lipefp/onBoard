from django.db import models
from django.contrib.auth.models import User


class Equipamento(models.Model):
    CATEGORIAS = [
        ('SWITCH', 'Switch de Rede'),
        ('ROUTER', 'Roteador / Gateway'),
        ('AP', 'Access Point'),
        ('CONECTIVIDADE', 'Transceiver / SFP'),
    ]
    GERENCIAMENTO = [
        ('L2', 'Layer 2 (Gerenciável)'),
        ('L3', 'Layer 3 (Gerenciável/Routing)'),
        ('UNMANAGED', 'Não Gerenciado (Plug-and-Play)'),
        ('SMART', 'Smart/Inteligent (Configuração Básica)'),
    ]
    VELOCIDADES = [
        ('1G', '1 Gbps (Standard)'),
        ('10G', '10 Gbps (SFP+)'),
        ('40G', '40 Gbps (QSFP+)'),
        ('100G', '100 Gbps (QSFP28)'),
    ]

    # Informações Básicas
    nome = models.CharField(max_length=100)
    categoria = models.CharField(max_length=20, choices=CATEGORIAS, default='SWITCH')
    quantidade = models.PositiveIntegerField(default=1)  # <- corrigido: só uma vez

    # Especificações Técnicas
    gerenciamento = models.CharField(max_length=15, choices=GERENCIAMENTO, default='L2')
    velocidade_uplink = models.CharField(max_length=10, choices=VELOCIDADES, default='1G')

    # PoE
    suporta_poe = models.BooleanField(default=False, verbose_name="Possui PoE?")
    potencia_poe = models.PositiveIntegerField(
        default=0, help_text="Potência total em Watts (ex: 370W)", blank=True, null=True
    )

    # Características Físicas
    quantidade_portas = models.PositiveIntegerField(default=24)
    serial_number = models.CharField(max_length=100, unique=True, blank=True, null=True, verbose_name="Número de Série")

    # Status e Localização
    estado = models.CharField(
        max_length=15,
        choices=[('ESTOQUE', 'Disponível em Estoque'), ('USO', 'Em Uso / Operação')],
        default='ESTOQUE'
    )
    local = models.CharField(max_length=100, default="Sede Piratininga")
    observacoes = models.TextField(blank=True, null=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)
    data_atualizacao = models.DateTimeField(auto_now=True)
    cadastrado_por = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipamentos'
    )

    def __str__(self):
        return f"{self.nome} - {self.velocidade_uplink} ({self.serial_number})"

    class Meta:
        verbose_name = "Equipamento"
        verbose_name_plural = "Equipamentos"
        ordering = ['-data_cadastro']


class LoginLog(models.Model):
    """Registra logs de login e logout dos usuários."""
    ACAO_CHOICES = [
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
    ]
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='logs')
    acao = models.CharField(max_length=10, choices=ACAO_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.acao} em {self.timestamp}"

    class Meta:
        verbose_name = "Log de Acesso"
        verbose_name_plural = "Logs de Acesso"
        ordering = ['-timestamp']