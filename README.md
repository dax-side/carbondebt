# carbondebt

carbondebt is a cloud emissions dashboard for developers.
Enter your workload numbers, then get a monthly footprint estimate and a ranked action list.

Live demo: [carbondebt-client.vercel.app](https://carbondebt-client.vercel.app)

## What you get

- Total monthly CO2e
- Grid intensity for the selected region
- Emissions split by service (compute, database, storage, network, lambda)
- Best lower-carbon region inside the same cloud provider
- Gemini suggestions sorted by estimated monthly savings

## How carbon is calculated

The backend uses scope 2 location-based emissions from local region intensity data.
Intensity values come from Ember Global Electricity Review 2025.

Formula:

```text
CO2e (kg) = kWh * grid_intensity (gCO2e/kWh) / 1000
```

Source file for region values: `server/src/data/regions.ts`

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Validation: Zod
- AI: Google Gemini
- Logging: Morgan + Winston

## API

### GET /api/health

Returns service status.

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

Success response includes:

- `totalCo2eKg`
- `gridIntensity`
- `equivalentKmDriven`
- `bestRegion`
- `breakdown`
- `suggestions`

Validation errors return HTTP `422` with details.

## Limits

- Scope 2 only
- Region list is curated in code
- Monthly trend is estimated for demo display
- Gemini suggestions can be empty when the model is unavailable

Built for the [DEV Weekend Challenge: Earth Day Edition](https://dev.to/challenges/weekend-2026-04-16) (April 2026).