from rest_framework import viewsets, generics, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.cache import cache
from django_filters.rest_framework import DjangoFilterBackend

from ..models import Equipamento, LoginLog
from .serializers import EquipamentoSerializer, UserSerializer, LoginLogSerializer


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0]
    return request.META.get('REMOTE_ADDR')


class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'estado', 'local', 'gerenciamento', 'suporta_poe']
    search_fields = ['nome', 'serial_number', 'local']
    ordering_fields = ['data_cadastro', 'nome']

    def perform_create(self, serializer):
        serializer.save(cadastrado_por=self.request.user)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response(
                {'detail': 'Apenas administradores podem remover equipamentos.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


MAX_LOGIN_ATTEMPTS = 5
LOCKOUT_TIME = 60 * 5  # 5 minutos


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ip = get_client_ip(request)
        cache_key = f'login_attempts_{ip}'
        attempts = cache.get(cache_key, 0)

        if attempts >= MAX_LOGIN_ATTEMPTS:
            return Response(
                {'detail': 'Muitas tentativas de login. Tente novamente em 5 minutos.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )

        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if not user:
            cache.set(cache_key, attempts + 1, LOCKOUT_TIME)
            return Response(
                {'detail': 'Usuário ou senha inválidos.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        cache.delete(cache_key)
        refresh = RefreshToken.for_user(user)
        LoginLog.objects.create(usuario=user, acao='LOGIN', ip=ip)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
            'is_staff': user.is_staff,
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            LoginLog.objects.create(
                usuario=request.user, acao='LOGOUT', ip=get_client_ip(request)
            )
            return Response({'detail': 'Logout realizado com sucesso.'})
        except Exception:
            return Response({'detail': 'Token inválido.'}, status=status.HTTP_400_BAD_REQUEST)


class LoginLogListView(generics.ListAPIView):
    queryset = LoginLog.objects.all()
    serializer_class = LoginLogSerializer
    permission_classes = [IsAuthenticated]
