import type { CarbonResponse } from '../lib/types';

interface SuggestionsPanelProps {
  report: CarbonResponse | null;
}

export default function SuggestionsPanel({ report }: SuggestionsPanelProps) {
  const suggestions = report?.suggestions ?? [];

  return (
    <section className="glass-panel h-full p-5">
      <h2 className="font-display text-2xl text-white">Gemini suggestions</h2>
      <p className="mt-1 text-sm text-mist">Ranked actions with estimated CO2e savings per month.</p>

      {suggestions.length === 0 ? (
        <p className="mt-4 text-sm text-mist">No suggestions yet. Run a carbon calculation first.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {suggestions.map((item, index) => (
            <article key={`${item.title}-${index}`} className="rounded-xl border border-white/10 bg-panelAlt/55 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl text-white">{item.title}</h3>
                <span className="rounded-full bg-lime/20 px-3 py-1 text-sm text-lime">
                  -{item.savingKg.toFixed(1)} kg
                </span>
              </div>
              <p className="mt-2 text-sm text-mist">{item.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
