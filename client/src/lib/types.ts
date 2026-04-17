export type Provider = 'aws' | 'gcp' | 'azure';

export interface CarbonRequest {
  provider: Provider;
  region: string;
  computeHours: number;
  dbInstances?: number;
  storageGB?: number;
  lambdaInvocations?: number;
}

export interface ApiSuccessEnvelope<T> {
  success: true;
  message: string;
  data: T;
}

export interface CarbonResponse {
  totalCo2eKg: number;
  gridIntensity: number;
  equivalentKmDriven: number;
  bestRegion: {
    name: string;
    savingKg: number;
  };
  breakdown: Array<{
    service: string;
    co2eKg: number;
    pct: number;
  }>;
  suggestions: Array<{
    title: string;
    description: string;
    savingKg: number;
  }>;
}
