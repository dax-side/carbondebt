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
      unit: 'kg per month',
    },
    {
      label: 'Grid intensity',
      value: report ? formatValue(report.gridIntensity, 0) : '--',
      unit: 'gCO2e / kWh',
    },
    {
      label: 'Best region saving',
      value: report ? formatValue(report.bestRegion.savingKg, 1) : '--',
      unit: report ? `kg if you switch to ${report.bestRegion.name}` : 'kg / month',
    },
    {
      label: 'Equivalent to',
      value: report ? formatValue(report.equivalentKmDriven, 0) : '--',
      unit: 'km driven by car',
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.label} className="metric-card">
          <p className="section-label">{card.label}</p>
          <p className="mt-3 text-[22px] font-medium leading-tight text-[#e6e8e6]">{card.value}</p>
          <p className="mt-3 text-sm text-[#8f968f]">{card.unit}</p>
        </article>
      ))}
    </div>
  );
}
