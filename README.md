# danny devito url

Um encurtador de URL de alta performance com funcionalidade de expiração (TTL), desenvolvido com **FastAPI** e **Redis** no backend, e **React** com **TailwindCSS** no frontend.

O nome do projeto é uma homenagem ao lendário Danny DeVito.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Docker e Docker Compose](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Python 3.10+](https://www.python.org/)

---

### 1. Iniciar o Banco de Dados (Redis)

Suba o container do Redis utilizando o Docker Compose na raiz do projeto:

```bash
docker compose up -d
```

O Redis estará disponível na porta padrão `6379`.

---

### 2. Executar o Backend (FastAPI)

Navegue até o diretório do backend, crie o ambiente virtual, instale as dependências e inicie o servidor:

```bash
cd backend

# Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar o servidor de desenvolvimento
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- A API estará disponível em: [http://localhost:8000](http://localhost:8000)
- Documentação interativa (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)

#### Executando Testes Unitários
Para rodar os testes unitários do backend:
```bash
pytest test_main.py
```

---

### 3. Executar o Frontend (React + Vite)

Navegue até o diretório do frontend, instale as dependências e inicie o servidor de desenvolvimento:

```bash
cd ../frontend

# Instalar dependências
npm install

# Iniciar o Vite
npm run dev -- --host 0.0.0.0 --port 5173
```

O frontend estará disponível em: [http://localhost:5173](http://localhost:5173)

---

## 🛠️ Detalhes do Desenvolvimento

### Backend (FastAPI + Redis)
- **FastAPI**: Escolhido pela alta performance, tipagem estática integrada (Pydantic) e auto-geração de documentação.
- **Redis**: Armazenamento rápido em memória. A expiração das URLs é gerenciada de forma nativa usando o TTL (`time-to-live`) do Redis com o comando `SETEX`.
- **Rotas**:
  - `POST /api/shorten`: Encurta a URL original e define a expiração em horas (`expiration_hours`).
  - `GET /{short_code}`: Redireciona o usuário para a URL original com status `307 (Temporary Redirect)`. Caso a URL tenha expirado ou não exista, retorna erro `404`.

### Frontend (React + TailwindCSS)
- Criado via **Vite** para inicialização rápida.
- Estilização premium baseada em Dark Mode com efeitos em vidro (*glassmorphism*), gradientes de cor modernos (indigo/cyan) e micro-animações elegantes baseadas em keyframes do Tailwind (fade-in, slide-up).
- Seletor simples para escolha da expiração da URL (1h, 12h, 24h e 72h).
- Funcionalidade para cópia direta da URL encurtada.

---

## 📝 Licença
Este projeto está sob a licença MIT.
