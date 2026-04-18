import { useCallback, useEffect, useState } from 'react';

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

  const runCalculation = useCallback(async (payload: CarbonRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await calcCarbon(payload);
      setReport(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while calculating carbon data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleManualSubmit = () => {
    void runCalculation(request);
  };

  useEffect(() => {
    void runCalculation(request);
  }, [request.provider, request.region, runCalculation]);

  return (
    <div className="min-h-screen px-4 pb-8 pt-6 text-[#e6e8e6] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-5xl font-medium tracking-tight sm:text-6xl">
              <span className="text-[#eef0ee]">carbon</span>
              <span className="text-[#6b8f5e]">debt</span>
            </h1>
            <p className="mt-2 subtle-text">Measure cloud emissions. Get ranked fixes.</p>
          </div>
          <span className="rounded-full border border-[#252825] bg-[#121413] px-4 py-1 text-sm text-[#8f968f]">
            Earth Day 2026
          </span>
        </header>

        <InputForm value={request} onChange={setRequest} onSubmit={handleManualSubmit} loading={loading} error={error} />

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
