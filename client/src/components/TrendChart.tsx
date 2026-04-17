interface TrendChartProps {
  totalCo2eKg: number | null;
}

export default function TrendChart({ totalCo2eKg }: TrendChartProps) {
  return (
    <section className="glass-panel p-5">
      <h2 className="font-display text-2xl text-white">Monthly trend</h2>
      <p className="mt-1 text-sm text-mist">Real historical trend is disabled until monthly snapshots are stored.</p>

      {totalCo2eKg === null ? (
        <p className="mt-4 text-sm text-mist">Run a calculation to view current monthly CO2e.</p>
      ) : (
        <div className="mt-5 rounded-xl border border-white/10 bg-panelAlt/55 p-4">
          <p className="text-sm text-mist">Current month CO2e</p>
          <p className="mt-2 font-display text-3xl text-lime">{totalCo2eKg.toFixed(2)} kg</p>
          <p className="mt-2 text-xs text-mist">
            Historical bars are intentionally hidden in no-fake-data mode.
          </p>
        </div>
      )}
    </section>
  );
}
