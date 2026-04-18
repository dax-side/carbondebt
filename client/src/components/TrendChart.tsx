interface TrendChartProps {
  totalCo2eKg: number | null;
}

const TREND_MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const ESTIMATED_FACTORS = [0.82, 0.86, 0.88, 0.9, 0.95, 1];
const DEFAULT_ESTIMATED_TOTAL = 24;

export default function TrendChart({ totalCo2eKg }: TrendChartProps) {
  const effectiveTotal = totalCo2eKg ?? DEFAULT_ESTIMATED_TOTAL;
  const estimatedValues = ESTIMATED_FACTORS.map((factor) => Number((effectiveTotal * factor).toFixed(1)));
  const maxValue = Math.max(...estimatedValues, 0);

  return (
    <section className="app-panel p-5">
      <h2 className="section-label">Monthly trend</h2>
      <p className="mt-2 subtle-text">Estimated monthly trend based on current workload and region profile.</p>

      <div className="mt-5 rounded-[8px] border border-[#252825] bg-[#121413] p-4">
        <div className="grid grid-cols-6 gap-2">
          {estimatedValues.map((value, index) => {
            const month = TREND_MONTHS[index];
            const height = maxValue > 0 ? Math.max((value / maxValue) * 100, 28) : 28;
            const isCurrentMonth = index === estimatedValues.length - 1;

            return (
              <div key={month} className="flex flex-col items-center">
                <div className="flex h-16 w-full items-end rounded-[4px] bg-[#1a1d1a] p-1">
                  <div
                    className={`w-full rounded-[3px] ${isCurrentMonth ? 'bg-[#6b8f5e]' : 'bg-[#343a34]'}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="mt-2 text-xs text-[#6f756f]">{month}</span>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-[10px] text-[#6f756f]">
          Estimated trend shown for demo purposes{totalCo2eKg === null ? '. Run a calculation to personalize values.' : '.'}
        </p>
      </div>
    </section>
  );
}
