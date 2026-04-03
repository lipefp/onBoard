from django.db import models

class Equipamento(models.Model):
    CATEGORIAS = [
        ('SWITCH', 'Switch de Rede'),
        ('Router', 'Roteador / Gateway'),
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
    # Informações Basicas
    nome = models.CharField(max_length= 100, help_text= 'Switch JetStream 8 Portas Gigabit PoE+ com 2 Slots SFP')
    categoria = models.CharField(max_length=20, choices=CATEGORIAS, default='SWITCH')
    quantidade = models.PositiveIntegerField(default=0)

    # Especificações Técnicas 
    gerenciamento = models.CharField(max_length=15, choices=GERENCIAMENTO, default='L2')
    velocidade_uplink  = models.CharField(max_length=10, choices=VELOCIDADES, default='1G')

    # (PoE)
    suporta_poe = models.BooleanField(default=False, verbose_name="Possui PoE?")
    potencia_poe = models.PositiveIntegerField(default=0, help_text="Potência total em Watts (ex: 370W)", blank=True, null=True)
    
    # Caracteristicas  Físicas
    quantidade_portas = models.PositiveIntegerField(default=24)
    serial_number = models.CharField(max_length=100, unique=True, verbose_name="Número de Série")
    
    # Status e Localização
    estado = models.CharField(
        max_length=15, 
        choices=[('ESTOQUE', 'Disponível em Estoque'), ('USO', 'Em Uso / Operação')], 
        default='ESTOQUE'
    )
    local = models.CharField(max_length=100, default="Sede Piratininga")
    quantidade = models.PositiveIntegerField(default=1)

    observacoes = models.TextField(blank=True, null=True, help_text="Notas sobre VLANs, STP ou versão de Firmware")
    data_cadastro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} - {self.velocidade_uplink} ({self.serial_number})"



    