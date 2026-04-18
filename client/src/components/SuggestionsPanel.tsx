import type { CarbonResponse } from '../lib/types';

interface SuggestionsPanelProps {
  report: CarbonResponse | null;
}

export default function SuggestionsPanel({ report }: SuggestionsPanelProps) {
  const suggestions = report?.suggestions ?? [];

  return (
    <section className="app-panel h-full p-5">
      <h2 className="section-label">Gemini suggestions</h2>
      <p className="mt-2 subtle-text">Ranked actions with estimated CO2e savings per month.</p>

      {suggestions.length === 0 ? (
        <p className="mt-4 subtle-text">No suggestions yet. Run a carbon calculation first.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {suggestions.map((item, index) => (
            <article key={`${item.title}-${index}`} className="rounded-[8px] border border-[#252825] bg-[#121413] p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-[500] leading-6 text-[#e6e8e6]">{item.title}</h3>
                <span className="inline-flex w-fit items-center whitespace-nowrap rounded-[20px] border border-[#4a6b3e] bg-[#4a6b3e] px-[10px] py-[3px] text-[13px] leading-none text-[#0f1010]">
                  -{item.savingKg.toFixed(1)} kg
                </span>
              </div>
              <p className="mt-2 text-sm text-[#8f968f]">{item.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
