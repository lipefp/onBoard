from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EquipamentoViewSet,
    RegisterView,
    LoginView,
    LogoutView,
    LoginLogListView,
)

router = DefaultRouter()
router.register(r'equipamentos', EquipamentoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/logs/', LoginLogListView.as_view(), name='login-logs'),
]