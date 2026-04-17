import type { Provider } from '../types/carbon';

export interface RegionConfig {
  name: string;
  intensity: number;
  provider: Provider;
}

export interface RegionWithCode extends RegionConfig {
  code: string;
}

export const REGIONS: Record<string, RegionConfig> = {
  'us-east-1': { name: 'N. Virginia', intensity: 415, provider: 'aws' },
  'us-west-2': { name: 'Oregon', intensity: 136, provider: 'aws' },
  'eu-west-1': { name: 'Ireland', intensity: 316, provider: 'aws' },
  'eu-north-1': { name: 'Stockholm', intensity: 98, provider: 'aws' },
  'ap-southeast-1': { name: 'Singapore', intensity: 493, provider: 'aws' },
  'us-central1': { name: 'Iowa', intensity: 360, provider: 'gcp' },
  'europe-north1': { name: 'Finland', intensity: 92, provider: 'gcp' },
  'europe-west1': { name: 'Belgium', intensity: 167, provider: 'gcp' },
  'eastus': { name: 'Virginia', intensity: 415, provider: 'azure' },
  'northeurope': { name: 'Ireland', intensity: 316, provider: 'azure' },
  'swedencentral': { name: 'Sweden', intensity: 98, provider: 'azure' },
};

export function getProviderRegions(provider: Provider): RegionWithCode[] {
  return Object.entries(REGIONS)
    .filter(([, region]) => region.provider === provider)
    .map(([code, region]) => ({ code, ...region }))
    .sort((a, b) => a.intensity - b.intensity);
}
