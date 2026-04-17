import type { BreakdownItem, CarbonRequest } from '../types/carbon';

const SERVICE_WEIGHTS: Record<BreakdownItem['service'], number> = {
  compute: 0.52,
  database: 0.22,
  storage: 0.13,
  network: 0.09,
  lambda: 0.04,
};

const ENERGY_PROFILE = {
  computeKwhPerHour: 0.3,
  dbKwhPerInstanceHour: 0.12,
  storageKwhPerGbMonth: 0.0012,
  lambdaKwhPerInvocation: 0.0000002,
};

function roundTo(value: number, decimals = 3): number {
  return Number(value.toFixed(decimals));
}

export function estimateMonthlyKwh(input: CarbonRequest): number {
  const computeHours = input.computeHours;
  const dbInstances = input.dbInstances ?? 0;
  const storageGB = input.storageGB ?? 0;
  const lambdaInvocations = input.lambdaInvocations ?? 0;

  const computeKwh = computeHours * ENERGY_PROFILE.computeKwhPerHour;
  const dbKwh = dbInstances * 720 * ENERGY_PROFILE.dbKwhPerInstanceHour;
  const storageKwh = storageGB * ENERGY_PROFILE.storageKwhPerGbMonth;
  const lambdaKwh = lambdaInvocations * ENERGY_PROFILE.lambdaKwhPerInvocation;

  return roundTo(computeKwh + dbKwh + storageKwh + lambdaKwh, 3);
}

export function breakdown(totalCo2eKg: number): BreakdownItem[] {
  return Object.entries(SERVICE_WEIGHTS).map(([service, weight]) => ({
    service: service as BreakdownItem['service'],
    co2eKg: roundTo(totalCo2eKg * weight),
    pct: Math.round(weight * 100),
  }));
}

export function equivalentKmDriven(totalCo2eKg: number): number {
  const avgCarKgPerKm = 0.217;
  return Math.round(totalCo2eKg / avgCarKgPerKm);
}
