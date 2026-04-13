# 🚀 API em JavaScript

## 📌 Sobre o Projeto
API simples desenvolvida em JS como forma de treinamento para criação do dockerfile, compose e ci/cd

Pré-requisitos
- Node instalado

Passo a passo
- cd api-js
- npm i
- Configurar o Banco de dados
  - Arquivo database.js
  - Configurar arquivo .env
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

### Como configurar no GitHub Actions

O workflow já está em [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml).

#### Secrets/variáveis

- **DockerHub** (para push da imagem)
  - `DOCKERHUB_USERNAME`: seu usuário do DockerHub
  - `DOCKERHUB_TOKEN`: um Access Token do DockerHub (Settings → Security → New Access Token)

- **Render (deploy hooks)**
  - `RENDER_STAGING_DEPLOY_HOOK`: Deploy Hook URL do serviço de homologação
  - `RENDER_PRODUCTION_DEPLOY_HOOK`: Deploy Hook URL do serviço de produção

- **DAST (OWASP ZAP)**
  - `STAGING_URL`: URL pública da homologação (ex.: `https://seu-app-staging.onrender.com`)

- **SonarQube/SonarCloud** (opcional)
  - `SONAR_HOST_URL`: ex.: `https://sonarcloud.io` (ou a URL do seu SonarQube)
  - `SONAR_PROJECT_KEY`: key do projeto
  - `SONAR_TOKEN`: token de acesso

- **SAST (Semgrep)**
  - `SEMGREP_APP_TOKEN`: token do Semgrep (opcional). Se não informar, o pipeline roda Semgrep em modo OSS com regras `p/ci`.

#### Aprovação manual (produção)

O job “Aprovação Manual” usa `environment: production`. Para realmente pausar aguardando aprovação:

- Vá em **Settings → Environments → New environment**
- Crie o ambiente `production`
- Marque **Required reviewers** e selecione quem aprova

#### Como o pipeline roda

- Em **PR**: executa CI + Container (build/scan), mas não faz push nem deploy.
- Em **push na main**: executa CI + Container (push no DockerHub) + CD (Render staging → ZAP → aprovação manual → Render produção).