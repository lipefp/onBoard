# Inventário de Equipamentos de Rede

Sistema web para cadastro e controle de equipamentos de rede, com autenticação de usuários e logs de acesso.

**Stack:** Django REST Framework + React + MySQL

---

## Pré-requisitos

- Python 3.11+
- Node.js 18+
- MySQL ou MariaDB rodando localmente

---

## Instalação

### Banco de dados

```sql
CREATE DATABASE onboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Back-end

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Linux/macOS
pip install -r requirements.txt
```

Crie o arquivo `backend/.env`:

```
SECRET_KEY=sua_chave_secreta
DEBUG=True
DB_NAME=onboard
DB_USER=root
DB_PASSWORD=sua_senha
DB_HOST=127.0.0.1
DB_PORT=3306
```

```bash
python manage.py migrate
python manage.py runserver
```

### Front-end

```bash
cd frontend
npm install
npm run dev
```

---

## Como usar

Acesse `http://localhost:5173`, crie uma conta em **Cadastre-se** e faça login. Após autenticado, você pode cadastrar, editar e remover equipamentos de rede pelo painel.

---

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `SECRET_KEY` | Chave secreta do Django |
| `DEBUG` | `True` em desenvolvimento, `False` em produção |
| `DB_NAME` | Nome do banco de dados |
| `DB_USER` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
| `DB_HOST` | Host do banco (padrão: `127.0.0.1`) |
| `DB_PORT` | Porta do banco (padrão: `3306`) |
