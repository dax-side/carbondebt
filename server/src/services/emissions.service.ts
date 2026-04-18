import { UpstreamServiceError } from '../shared/errors/index';
import { ErrorMessages } from '../shared/messages/index';

interface EmissionsResult {
  co2eKg: number;
  gridIntensity: number;
}

function asFiniteNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function calcElectricity(regionCode: string, kwhMonthly: number): Promise<EmissionsResult> {
  const apiKey = process.env.EMISSIONS_API_KEY?.trim();
  const emissionsApiUrl = process.env.EMISSIONS_API_URL?.trim();

  if (!apiKey) {
    throw new UpstreamServiceError(ErrorMessages.CARBON.EMISSIONS_API_KEY_MISSING);
  }

  if (!emissionsApiUrl) {
    throw new UpstreamServiceError(ErrorMessages.CARBON.EMISSIONS_API_URL_MISSING);
  }

  let response: Response;

  try {
    response = await fetch(emissionsApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        region: regionCode,
        energy: {
          value: kwhMonthly,
          unit: 'kWh',
        },
      }),
    });
  } catch (error) {
    throw new UpstreamServiceError(ErrorMessages.CARBON.EMISSIONS_API_FAILED, {
      reason: error instanceof Error ? error.message : String(error),
    });
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    const upstreamStatusCode = response.status >= 400 && response.status < 600 ? response.status : 502;

    throw new UpstreamServiceError(ErrorMessages.CARBON.EMISSIONS_API_FAILED, {
      status: response.status,
      statusText: response.statusText,
      body: body.slice(0, 300),
    }, upstreamStatusCode);
  }

  const payload = (await response.json()) as Record<string, unknown>;
  const co2eKg = asFiniteNumber(payload.co2e ?? (payload.data as Record<string, unknown> | undefined)?.co2e);
  const gridIntensity = asFiniteNumber(
    payload.gridIntensity ?? (payload.data as Record<string, unknown> | undefined)?.gridIntensity
  );

  if (co2eKg === null || gridIntensity === null) {
    throw new UpstreamServiceError(ErrorMessages.CARBON.EMISSIONS_API_FAILED, {
      reason: 'Invalid emissions response format',
      payload,
    });
  }

  return {
    co2eKg: Number(co2eKg.toFixed(3)),
    gridIntensity: Number(gridIntensity.toFixed(2)),
  };
}
