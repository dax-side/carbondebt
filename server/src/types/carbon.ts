export type Provider = 'aws' | 'gcp' | 'azure';

export interface CarbonRequest {
  provider: Provider;
  region: string;
  computeHours: number;
  dbInstances?: number;
  storageGB?: number;
  lambdaInvocations?: number;
}

export interface BreakdownItem {
  service: 'compute' | 'database' | 'storage' | 'network' | 'lambda';
  co2eKg: number;
  pct: number;
}

export interface Suggestion {
  title: string;
  description: string;
  savingKg: number;
}

export interface CarbonResponse {
  totalCo2eKg: number;
  gridIntensity: number;
  equivalentKmDriven: number;
  bestRegion: {
    name: string;
    savingKg: number;
  };
  breakdown: BreakdownItem[];
  suggestions: Suggestion[];
}
