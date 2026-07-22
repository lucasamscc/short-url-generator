# danny devito url

Um encurtador de URL de alta performance com funcionalidade de expiração (TTL), desenvolvido com **FastAPI** e **Redis** no backend, e **React** com **TailwindCSS** no frontend.

Toda a aplicação está conteinerizada, facilitando a execução e testes locais.

---

## 🚀 Como Executar o Projeto com Docker (Recomendado)

### Pré-requisitos
- [Docker e Docker Compose](https://docs.docker.com/get-docker/)

Para subir toda a pilha de serviços (Redis, Backend FastAPI e Frontend React), basta executar na raiz do projeto:

```bash
docker compose up -d --build
```

Isso inicializará os seguintes serviços:
- **Frontend (React)**: [http://localhost:5173](http://localhost:5173)
- **Backend (FastAPI)**: [http://localhost:8000](http://localhost:8000)
- **Redis**: Porta `6379` (usado internamente pelo backend)

A documentação interativa da API (Swagger) estará disponível em [http://localhost:8000/docs](http://localhost:8000/docs).

Para derrubar os containers:
```bash
docker compose down
```

---

## 🛠️ Desenvolvimento e Execução Local (Alternativo)

Caso queira rodar os serviços fora dos containers para desenvolvimento rápido:

### 1. Iniciar apenas o Redis
```bash
docker compose up -d redis
```

### 2. Iniciar o Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- Para rodar os testes unitários no backend: `pytest test_main.py`

### 3. Iniciar o Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

---

## 📝 Detalhes da Arquitetura

- **Redis**: Armazenamento rápido em memória que lida nativamente com a expiração das chaves através do seu TTL (`SETEX`).
- **FastAPI**: Backend leve, rápido e com tipagem estática integrada (Pydantic).
- **React**: Interface interativa moderna criada via Vite, estilizada com TailwindCSS no modo escuro (*glassmorphism*), gradiente indigo/cyan e micro-animações (fade-in, slide-up).
