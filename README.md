# carbondebt

A developer-first carbon footprint tracker for cloud workloads.

## Stack
- Client: React + Vite + TypeScript + Tailwind CSS
- Server: Node.js + Express + TypeScript
- Carbon data: emissions.dev (with safe regional fallback)
- Suggestions: Google Gemini (with deterministic fallback)

## Monorepo structure
- client/: Dashboard frontend
- server/: REST API and carbon calculation logic

## API endpoints
- GET /api/health
- POST /api/carbon

Sample POST body:

```json
{
  "provider": "aws",
  "region": "us-east-1",
  "computeHours": 720,
  "dbInstances": 1,
  "storageGB": 250,
  "lambdaInvocations": 1500000
}
```
