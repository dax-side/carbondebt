# carbondebt

carbondebt is a cloud emissions dashboard for developers.
It takes backend workload inputs, fetches carbon data, and returns action-focused suggestions.

This README is the full project reference. The separate docs folder is not used.

## Why this project exists

Infrastructure has a carbon cost that rarely shows up in day to day development.
carbondebt makes that cost visible with one API call and one dashboard view.

## What the app shows

- Total monthly CO2e for the submitted workload
- Grid intensity for the selected region
- Emissions split by service category
- Best lower-carbon region inside the selected cloud provider
- Gemini suggestions ranked by estimated monthly savings

## Data policy

- No fake emissions fallback. If emissions.dev is unavailable, the API returns an upstream error.
- No fake Gemini suggestions. If Gemini fails, suggestions return as an empty list.
- No simulated history bars. Trend is shown as current month only until real snapshots are stored.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Carbon source: emissions.dev
- AI source: Google Gemini
- Logging: Morgan piped into Winston

## Monorepo layout

- client: Dashboard frontend
- server: API, validation, service integrations
- server/src/shared: shared errors, messages, response helpers, logger

## Request flow

1. Client sends a typed POST request to /api/carbon.
2. Server validates payload with Zod middleware.
3. Server requests emissions from emissions.dev.
4. Server computes service breakdown and best-region savings.
5. Server requests ranked suggestions from Gemini.
6. Server returns one response envelope consumed by the dashboard.

## API

### GET /api/health

Returns service status in the shared success envelope.

Response shape:

```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "ok",
    "uptime": 123,
    "timestamp": "2026-04-17T00:00:00.000Z"
  }
}
```

### POST /api/carbon

Request body:

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

Success response envelope:

```json
{
  "success": true,
  "message": "Carbon report calculated successfully",
  "data": {
    "totalCo2eKg": 125.75,
    "gridIntensity": 415,
    "equivalentKmDriven": 579,
    "bestRegion": {
      "name": "eu-north-1 (Stockholm)",
      "savingKg": 96.05
    },
    "breakdown": [
      {
        "service": "compute",
        "co2eKg": 65.387,
        "pct": 52
      }
    ],
    "suggestions": [
      {
        "title": "Migrate workloads to Stockholm",
        "description": "...",
        "savingKg": 96
      }
    ]
  }
}
```

Error response:

```json
{
  "success": false,
  "error": "Failed to fetch emissions data from emissions.dev.",
  "details": {
    "status": 403,
    "statusText": "Forbidden"
  }
}
```

## Shared layer in use

Shared modules are active in runtime paths.

- Shared errors are thrown from validation and upstream services.
- Shared success helper formats health and carbon responses.
- Shared messages supply API message text.
- Shared logger receives HTTP logs from Morgan and app logs from Winston.

## Environment variables

- EMISSIONS_API_KEY
- GEMINI_API_KEY
- GEMINI_MODEL
- PORT
- CLIENT_ORIGIN

## Known operational notes

- emissions.dev can block some local IP addresses through Cloudflare. In that case, the API returns a 502 upstream error with details.
- Gemini model availability changes with quota and traffic. The selected model is read from GEMINI_MODEL.
- Carbon endpoint responses are wrapped in the shared envelope. Frontend code unwraps the data payload.