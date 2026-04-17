import { getRegionsByProvider, PROVIDER_LABELS } from '../lib/regions';
import type { CarbonRequest, Provider } from '../lib/types';

interface InputFormProps {
  value: CarbonRequest;
  loading: boolean;
  onChange: (next: CarbonRequest) => void;
  onSubmit: () => void;
}

function parseNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseOptionalNumber(value: string): number | undefined {
  if (value.trim() === '') {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export default function InputForm({ value, loading, onChange, onSubmit }: InputFormProps) {
  const providerRegions = getRegionsByProvider(value.provider);

  const updateField = <K extends keyof CarbonRequest>(field: K, fieldValue: CarbonRequest[K]) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const handleProviderChange = (provider: Provider) => {
    const nextRegions = getRegionsByProvider(provider);

    onChange({
      ...value,
      provider,
      region: nextRegions[0]?.code ?? value.region,
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="glass-panel p-4 md:p-5"
    >
      <div className="grid gap-3 md:grid-cols-3">
        <label className="field-block">
          <span className="field-label">Cloud provider</span>
          <select
            className="field-input"
            value={value.provider}
            onChange={(event) => handleProviderChange(event.target.value as Provider)}
          >
            {Object.entries(PROVIDER_LABELS).map(([provider, label]) => (
              <option key={provider} value={provider}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="field-block">
          <span className="field-label">Region</span>
          <select
            className="field-input"
            value={value.region}
            onChange={(event) => updateField('region', event.target.value)}
          >
            {providerRegions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.code} ({region.name})
              </option>
            ))}
          </select>
        </label>

        <label className="field-block">
          <span className="field-label">Monthly compute hours</span>
          <input
            className="field-input"
            type="number"
            min={1}
            value={value.computeHours}
            onChange={(event) => updateField('computeHours', parseNumber(event.target.value))}
          />
        </label>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <label className="field-block">
          <span className="field-label">DB instances (optional)</span>
          <input
            className="field-input"
            type="number"
            min={0}
            value={value.dbInstances ?? ''}
            onChange={(event) => updateField('dbInstances', parseOptionalNumber(event.target.value))}
          />
        </label>

        <label className="field-block">
          <span className="field-label">Storage GB (optional)</span>
          <input
            className="field-input"
            type="number"
            min={0}
            value={value.storageGB ?? ''}
            onChange={(event) => updateField('storageGB', parseOptionalNumber(event.target.value))}
          />
        </label>

        <label className="field-block">
          <span className="field-label">Lambda invocations/month (optional)</span>
          <input
            className="field-input"
            type="number"
            min={0}
            value={value.lambdaInvocations ?? ''}
            onChange={(event) => updateField('lambdaInvocations', parseOptionalNumber(event.target.value))}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-xl border border-lime/35 bg-black/60 py-3 font-display text-lg text-lime transition hover:border-lime/60 hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Calculating...' : 'Connect to emissions.dev API'}
      </button>
    </form>
  );
}
