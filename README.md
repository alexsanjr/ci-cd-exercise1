# 🚀 API em JavaScript

## 📌 Sobre o Projeto
API simples desenvolvida em JS como forma de treinamento para criação do dockerfile, compose e ci/cd

Pré-requisitos
- Node instalado

Passo a passo
- npm i
- Configurar o Banco de dados
  - Configurar arquivo `.env` (base: `.env.example`)
  - Windows (PowerShell/cmd): `copy .env.example .env`
  - Linux/macOS (bash): `cp .env.example .env`
- node index.js

A API estará disponível em:
- http://localhost:3000

## 🐳 (Atividade 1) Rodando com Docker

Você deverá criar um Dockerfile para essa aplicação

### Requisitos:

- Utilizar imagem oficial do Node
- Build da aplicação
- Expor porta 3000
- Executar a API

### Como rodar

- Build da imagem:
  - `docker build -t api-js .`
- Subir o container:
  - `docker run --rm -p 3000:3000 --env-file .env api-js`

Obs.: copie `.env.example` para `.env` e ajuste as variáveis.


## 🐳 (Atividade 2) Rodando com Compose

Você deverá modificar a aplicação para fazer acesso ao banco de dados. Crie um docker compose para executar o PostreSQL, o PGAdmin e a aplicação em Node atraves do dockerfile que você criou

### Requisitos:

- Utilizar o dockerfile criado na atividade 1
- Criar um docker compose com:
  - A aplicação em Node
  - O banco PostgreSQL
  - O PGAdmin

### Como rodar

- (Recomendado) crie o `.env` a partir do exemplo e ajuste valores:
  - Windows: `copy .env.example .env`
  - Linux/macOS: `cp .env.example .env`
- Suba os serviços:
  - `docker compose up -d --build`

URLs:
- API: http://localhost:3000
- PGAdmin: http://localhost:5050

Credenciais PGAdmin (padrão, pode sobrescrever via `.env`):
- Email: `admin@admin.com`
- Senha: `admin`

Para conectar no Postgres via PGAdmin:
- Host: `postgres`
- Porta: `5432`
- Database/User/Password: os mesmos do `.env`

## ⚙️ (DESAFIO) CI/CD

Crie um CI/CD no github actions com as seguintes etapas

- CI (Integração Contínua)
  - Build da aplicação
  - Testes unitários
  - Testes de integração
  - Lint
  - Análise de qualidade de código (SonarQube)
  - SAST (Semgrep ou Checkmarx ou Fortify, etc)

- Container
  - Docker Lint
  - Build da imagem
  - Scan de vulnerabilidades (Trivy)
  - Push da imagem no dockerhub

- CD (Entrega Contínua)
   - Deploy em homologação com Render
   - DAST (OWASP ZAP)
   - Criação da aprovação manual
   - Deploy em produção

### Implementação

O workflow está em `.github/workflows/ci-cd.yml` e roda em `pull_request` e em `push` para `main`.

### Secrets necessários (Settings → Secrets and variables → Actions)

DockerHub (para push):
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

SonarQube/SonarCloud (opcional; o job só roda se existir `SONAR_TOKEN`):
- `SONAR_TOKEN`
- `SONAR_HOST_URL` (ex.: `https://sonarcloud.io` ou sua URL do SonarQube)
- `SONAR_PROJECT_KEY`

Semgrep (opcional; o job só roda se existir `SEMGREP_APP_TOKEN`):
- `SEMGREP_APP_TOKEN`

Render (CD):
- `RENDER_STAGING_DEPLOY_HOOK`
- `RENDER_PRODUCTION_DEPLOY_HOOK`

DAST (ZAP) em homologação:
- `STAGING_URL` (ex.: `https://sua-app-hml.onrender.com`)

### Aprovação manual

A etapa "Aprovação Manual" usa `environment: production`.
Para exigir aprovação, configure o ambiente `production` no GitHub (Settings → Environments) com required reviewers.