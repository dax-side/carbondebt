import { REGIONS } from '../data/regions';
import { BadRequestError } from '../shared/errors/index';
import { ErrorMessages } from '../shared/messages/index';

interface EmissionsResult {
  co2eKg: number;
  gridIntensity: number;
}

export async function calcElectricity(regionCode: string, kwhMonthly: number): Promise<EmissionsResult> {
  const region = REGIONS[regionCode];

  if (!region) {
    throw new BadRequestError(ErrorMessages.CARBON.INVALID_PROVIDER_REGION);
  }

  const gridIntensity = region.intensity;
  const co2eKg = Number(((kwhMonthly * gridIntensity) / 1000).toFixed(3));

  return {
    co2eKg,
    gridIntensity: Number(gridIntensity.toFixed(2)),
  };
}
