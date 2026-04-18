import type { CarbonResponse } from '../lib/types';

interface EmissionsChartProps {
  report: CarbonResponse | null;
}

function formatKg(value: number): string {
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value)} kg`;
}

export default function EmissionsChart({ report }: EmissionsChartProps) {
  const breakdown = report?.breakdown ?? [];
  const max = Math.max(...breakdown.map((item) => item.co2eKg), 0);

  return (
    <section className="app-panel p-5">
      <h2 className="section-label">Emissions by service</h2>

      {breakdown.length === 0 ? (
        <p className="mt-4 subtle-text">Run a calculation to see service-level emissions.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {breakdown.map((item) => {
            const width = max > 0 ? Math.max((item.co2eKg / max) * 100, 4) : 0;
            const serviceLabel = item.service[0].toUpperCase() + item.service.slice(1);
            const isActive = item.co2eKg === max;

            return (
              <div key={item.service} className="grid grid-cols-[90px_1fr_auto] items-center gap-3 text-sm">
                <span className="text-[#8f968f]">{serviceLabel}</span>
                <div className="h-3 overflow-hidden rounded-full bg-[#202420]">
                  <div
                    className={`h-full rounded-full ${isActive ? 'bg-[#6b8f5e]' : 'bg-[#3a4039]'}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="min-w-[68px] text-right text-[#d7dbd7]">{formatKg(item.co2eKg)}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
