/**
 * Centralized error messages for consistent API responses.
 */
export class ErrorMessages {
  static readonly COMMON = {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'You do not have permission to perform this action',
    NOT_FOUND: 'Resource not found',
    INTERNAL_SERVER_ERROR: 'An unexpected error occurred',
    VALIDATION_FAILED: 'Validation failed',
    INVALID_REQUEST: 'Invalid request',
  };

  static readonly CARBON = {
    INVALID_PROVIDER_REGION: 'Selected region does not belong to selected provider.',
    CALCULATION_FAILED: 'Failed to calculate carbon report',
    EMISSIONS_API_KEY_MISSING: 'EMISSIONS_API_KEY is not configured on the server.',
    EMISSIONS_API_URL_MISSING: 'EMISSIONS_API_URL is not configured on the server.',
    EMISSIONS_API_FAILED: 'Failed to fetch emissions data from emissions.dev.',
    GEMINI_API_KEY_MISSING: 'GEMINI_API_KEY is not configured on the server.',
    GEMINI_API_FAILED: 'Failed to fetch Gemini suggestions.',
  };
}
