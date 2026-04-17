import { Router } from 'express';

import { getProviderRegions, REGIONS } from '../data/regions.js';
import { CarbonRequestSchema, type CarbonRequestInput, validateBody } from '../middleware/validate.js';
import { breakdown, equivalentKmDriven, estimateMonthlyKwh } from '../services/calculator.js';
import { calcElectricity } from '../services/emissions.js';
import { getSuggestions } from '../services/gemini.js';
import { BadRequestError } from '../shared/errors/index.js';
import { ErrorMessages } from '../shared/messages/index.js';
import type { CarbonResponse } from '../types/carbon.js';

const carbonRouter = Router();

carbonRouter.post('/carbon', validateBody(CarbonRequestSchema), async (req, res, next) => {
  try {
    const payload = req.body as CarbonRequestInput;
    const region = REGIONS[payload.region];

    if (!region || region.provider !== payload.provider) {
      throw new BadRequestError(ErrorMessages.CARBON.INVALID_PROVIDER_REGION);
    }

    const monthlyKwh = estimateMonthlyKwh(payload);
    const emissions = await calcElectricity(payload.region, monthlyKwh);
    const serviceBreakdown = breakdown(emissions.co2eKg);

    const providerRegions = getProviderRegions(payload.provider);
    const bestRegion = providerRegions[0];
    const bestRegionCo2e = Number(((monthlyKwh * bestRegion.intensity) / 1000).toFixed(3));
    const bestRegionSaving = Number(Math.max(emissions.co2eKg - bestRegionCo2e, 0).toFixed(2));

    const reportForGemini = {
      provider: payload.provider,
      region: payload.region,
      totalCo2eKg: emissions.co2eKg,
      gridIntensity: emissions.gridIntensity,
      breakdown: serviceBreakdown,
      bestRegion: {
        code: bestRegion.code,
        name: bestRegion.name,
        savingKg: bestRegionSaving,
      },
    };

    const suggestions = await getSuggestions(reportForGemini);

    const response: CarbonResponse = {
      totalCo2eKg: Number(emissions.co2eKg.toFixed(2)),
      gridIntensity: Number(emissions.gridIntensity.toFixed(0)),
      equivalentKmDriven: equivalentKmDriven(emissions.co2eKg),
      bestRegion: {
        name: `${bestRegion.code} (${bestRegion.name})`,
        savingKg: bestRegionSaving,
      },
      breakdown: serviceBreakdown,
      suggestions,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default carbonRouter;
