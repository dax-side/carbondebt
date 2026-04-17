import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

import type { Suggestion } from '../types/carbon';

const SYSTEM_PROMPT = `You are a cloud infrastructure sustainability advisor.
Given a developer's cloud carbon footprint report, return exactly 3 to 5
specific, ranked optimisation recommendations as a JSON array.
Each item must have: title (string), description (string), savingKg (number).
savingKg must be a realistic estimated monthly CO2e saving in kg.
Return only the JSON array. No markdown, no preamble.`;

const SuggestionArraySchema = z
  .array(
    z.object({
      title: z.string().min(3),
      description: z.string().min(8),
      savingKg: z.number().positive(),
    })
  )
  .min(3)
  .max(5);

interface GeminiReport {
  provider: string;
  region: string;
  totalCo2eKg: number;
  gridIntensity: number;
  breakdown: Array<{
    service: string;
    co2eKg: number;
    pct: number;
  }>;
  bestRegion: {
    code: string;
    name: string;
    savingKg: number;
  };
}

function parseJsonArray(raw: string): unknown {
  const trimmed = raw.trim();

  if (trimmed.startsWith('```')) {
    const withoutFence = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    return JSON.parse(withoutFence);
  }

  return JSON.parse(trimmed);
}

export async function getSuggestions(report: GeminiReport): Promise<Suggestion[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-pro';

  if (!apiKey) {
    return [];
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({
      model: geminiModel,
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(JSON.stringify(report, null, 2));
    const raw = result.response.text();
    const parsed = parseJsonArray(raw);
    const suggestions = SuggestionArraySchema.parse(parsed);

    return suggestions
      .map((item) => ({ ...item, savingKg: Number(item.savingKg.toFixed(1)) }))
      .sort((a, b) => b.savingKg - a.savingKg);
  } catch {
    return [];
  }
}
