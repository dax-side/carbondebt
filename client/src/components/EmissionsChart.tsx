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
    <section className="glass-panel p-5">
      <h2 className="font-display text-2xl text-white">Emissions by service</h2>

      {breakdown.length === 0 ? (
        <p className="mt-4 text-sm text-mist">Run a calculation to see service-level emissions.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {breakdown.map((item) => {
            const width = max > 0 ? Math.max((item.co2eKg / max) * 100, 4) : 0;
            const serviceLabel = item.service[0].toUpperCase() + item.service.slice(1);

            return (
              <div key={item.service} className="grid grid-cols-[90px_1fr_auto] items-center gap-3 text-sm">
                <span className="text-mist">{serviceLabel}</span>
                <div className="h-3 overflow-hidden rounded-full bg-black/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-lime to-limeDark"
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="min-w-[68px] text-right text-white">{formatKg(item.co2eKg)}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
