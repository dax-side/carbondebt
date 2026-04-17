import type { ApiSuccessEnvelope, CarbonRequest, CarbonResponse } from './types';

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';

function getCarbonUrl(): string {
  return apiBaseUrl ? `${apiBaseUrl}/api/carbon` : '/api/carbon';
}

export async function calcCarbon(req: CarbonRequest): Promise<CarbonResponse> {
  const response = await fetch(getCarbonUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    let detail = 'Failed to calculate carbon report.';

    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) {
        detail = payload.error;
      }
    } catch {
      const text = await response.text();
      if (text) {
        detail = text;
      }
    }

    throw new Error(detail);
  }

  const payload = (await response.json()) as CarbonResponse | ApiSuccessEnvelope<CarbonResponse>;

  if ('success' in payload && payload.success) {
    return payload.data;
  }

  return payload as CarbonResponse;
}
