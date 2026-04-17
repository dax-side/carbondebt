import type { Provider } from './types';

export interface RegionOption {
  code: string;
  name: string;
  intensity: number;
  provider: Provider;
}

export const PROVIDER_LABELS: Record<Provider, string> = {
  aws: 'AWS',
  gcp: 'Google Cloud',
  azure: 'Azure',
};

const REGIONS: RegionOption[] = [
  { code: 'us-east-1', name: 'N. Virginia', intensity: 415, provider: 'aws' },
  { code: 'us-west-2', name: 'Oregon', intensity: 136, provider: 'aws' },
  { code: 'eu-west-1', name: 'Ireland', intensity: 316, provider: 'aws' },
  { code: 'eu-north-1', name: 'Stockholm', intensity: 98, provider: 'aws' },
  { code: 'ap-southeast-1', name: 'Singapore', intensity: 493, provider: 'aws' },
  { code: 'us-central1', name: 'Iowa', intensity: 360, provider: 'gcp' },
  { code: 'europe-north1', name: 'Finland', intensity: 92, provider: 'gcp' },
  { code: 'europe-west1', name: 'Belgium', intensity: 167, provider: 'gcp' },
  { code: 'eastus', name: 'Virginia', intensity: 415, provider: 'azure' },
  { code: 'northeurope', name: 'Ireland', intensity: 316, provider: 'azure' },
  { code: 'swedencentral', name: 'Sweden', intensity: 98, provider: 'azure' },
];

export function getRegionsByProvider(provider: Provider): RegionOption[] {
  return REGIONS
    .filter((region) => region.provider === provider)
    .sort((a, b) => a.intensity - b.intensity);
}
