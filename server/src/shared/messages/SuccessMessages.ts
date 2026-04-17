export interface SuccessResponse {
  statusCode: number;
  message: string;
}

/**
 * Centralized success messages for consistent API responses.
 */
export class SuccessMessages {
  static readonly HEALTH = {
    OK: { statusCode: 200, message: 'Service is healthy' },
  };

  static readonly CARBON = {
    CALCULATED: { statusCode: 200, message: 'Carbon report calculated successfully' },
  };

  static readonly GENERIC = {
    SUCCESS: { statusCode: 200, message: 'Operation completed successfully' },
    CREATED: { statusCode: 201, message: 'Resource created successfully' },
    UPDATED: { statusCode: 200, message: 'Resource updated successfully' },
    DELETED: { statusCode: 200, message: 'Resource deleted successfully' },
    RETRIEVED: { statusCode: 200, message: 'Resource retrieved successfully' },
  };
}
