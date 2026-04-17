import { useEffect, useState } from 'react';

import EmissionsChart from './components/EmissionsChart';
import InputForm from './components/InputForm';
import MetricCards from './components/MetricCards';
import SuggestionsPanel from './components/SuggestionsPanel';
import TrendChart from './components/TrendChart';
import { calcCarbon } from './lib/api';
import { getRegionsByProvider } from './lib/regions';
import type { CarbonRequest, CarbonResponse } from './lib/types';

const DEFAULT_PROVIDER = 'aws' as const;

const INITIAL_REQUEST: CarbonRequest = {
  provider: DEFAULT_PROVIDER,
  region: getRegionsByProvider(DEFAULT_PROVIDER)[0].code,
  computeHours: 720,
};

export default function App() {
  const [request, setRequest] = useState<CarbonRequest>(INITIAL_REQUEST);
  const [report, setReport] = useState<CarbonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCalculation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await calcCarbon(request);
      setReport(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while calculating carbon data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void runCalculation();
  }, []);

  return (
    <div className="relative min-h-screen px-4 pb-8 pt-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Carbon debt tracker</h1>
            <p className="mt-2 text-mist">
              Measure cloud emissions in seconds and get ranked optimisation moves powered by Gemini.
            </p>
          </div>
          <span className="rounded-full border border-lime/40 bg-lime/15 px-4 py-1 text-sm text-lime">
            Earth Day build
          </span>
        </header>

        <InputForm value={request} onChange={setRequest} onSubmit={runCalculation} loading={loading} />

        {error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
        ) : null}

        <MetricCards report={report} />

        <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
          <div className="grid gap-4">
            <EmissionsChart report={report} />
            <TrendChart totalCo2eKg={report?.totalCo2eKg ?? null} />
          </div>
          <SuggestionsPanel report={report} />
        </div>
      </div>
    </div>
  );
}
