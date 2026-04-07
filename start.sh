#!/bin/bash

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Iniciando Back-end..."
bash -c "cd '$ROOT/backend' && source venv/bin/activate && python manage.py runserver" &
BACKEND_PID=$!

echo "Iniciando Front-end..."
bash -c "cd '$ROOT/frontend' && npm run dev" &
FRONTEND_PID=$!

echo "Aguardando servidores iniciarem..."
sleep 4
xdg-open http://localhost:5173 2>/dev/null

echo ""
echo "Servidores rodando. Pressione Ctrl+C para encerrar."

# Garante que ambos os processos são encerrados ao sair
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
