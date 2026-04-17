import type { CarbonResponse } from '../lib/types';

interface MetricCardsProps {
  report: CarbonResponse | null;
}

function formatValue(value: number, digits = 1): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

export default function MetricCards({ report }: MetricCardsProps) {
  const cards = [
    {
      label: 'Total CO2e',
      value: report ? formatValue(report.totalCo2eKg, 1) : '--',
      unit: 'kg / month',
      className: 'text-amber-400',
    },
    {
      label: 'Grid intensity',
      value: report ? formatValue(report.gridIntensity, 0) : '--',
      unit: 'gCO2e / kWh',
      className: 'text-white',
    },
    {
      label: 'Potential saving',
      value: report ? formatValue(report.bestRegion.savingKg, 1) : '--',
      unit: report ? `kg if you switch to ${report.bestRegion.name}` : 'kg / month',
      className: 'text-lime',
    },
    {
      label: 'Equivalent to',
      value: report ? formatValue(report.equivalentKmDriven, 0) : '--',
      unit: 'km driven by car',
      className: 'text-white',
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.label} className="metric-card">
          <p className="text-sm text-mist/90">{card.label}</p>
          <p className={`mt-2 font-display text-4xl leading-none ${card.className}`}>{card.value}</p>
          <p className="mt-2 text-sm text-mist">{card.unit}</p>
        </article>
      ))}
    </div>
  );
}
