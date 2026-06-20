# Arkhram — Plataforma SaaS de Automatizaciones con IA

[Describí en lenguaje natural qué querés automatizar. La IA detecta qué falta, lo pregunta de a uno, y genera la automatización lista para correr en n8n.](https://automatis.vercel.app/)

## Stack

- **Next.js 14** con App Router
- **Tailwind CSS** + **shadcn/ui**
- **Groq API** (`llama-3.3-70b-versatile`)
- **n8n** en Docker local
- **Supabase** (Postgres)

## Setup

### 1. Variables de entorno

```bash
cp .env.local.example .env.local
# Completar los valores en .env.local
```

### 2. Base de datos Supabase

Ejecutar `supabase/migration.sql` en el SQL Editor de tu proyecto Supabase.

### 3. n8n en Docker

```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_API_KEY=tu_api_key \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Habilitar la API REST en n8n: Settings → API → Enable API

### 4. Instalar y correr

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## Flujo de uso

1. El usuario describe qué quiere automatizar en el chat
2. La IA (Groq/Llama 3.3) hace preguntas de a una para completar la información
3. Cuando tiene todo, resume y pide confirmación
4. Al confirmar, genera el workflow de n8n y lo guarda en Supabase
5. El usuario puede ver, pausar y eliminar sus automatizaciones en el panel lateral

## Estructura

```
src/
  app/
    api/
      chat/          # Endpoint del chat con Groq
      generate-flow/ # Generador de workflow n8n
      automations/   # CRUD de automatizaciones en Supabase
    page.tsx         # Página principal
  components/
    chat/            # ChatInterface, ChatMessage, ChatInput, SkillChips
    automations/     # AutomationCard, AutomationDetail, AutomationsSidebar
  lib/
    types.ts         # Tipos TypeScript + SKILL_CHIPS
    groq.ts          # Cliente Groq + system prompt
    supabase.ts      # Cliente Supabase + getUserId()
    n8n.ts           # API client de n8n
    flow-generator.ts # Convierte config JSON a workflow n8n
```
