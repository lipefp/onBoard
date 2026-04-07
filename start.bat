@echo off
echo Iniciando Back-end...
start "Back-end" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && python manage.py runserver"

echo Iniciando Front-end...
start "Front-end" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Aguardando servidores iniciarem...
timeout /t 4 /nobreak > nul

start http://localhost:5173
