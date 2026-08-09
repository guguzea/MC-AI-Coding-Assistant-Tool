/**
 * Actionable error envelope shared by MCP tools.
 */

export interface ActionEnvelope {
  code: string;
  message: string;
  nextSteps: string[];
  relatedTools?: string[];
}

export function actionable(
  code: string,
  message: string,
  nextSteps: string[],
  relatedTools?: string[],
): ActionEnvelope {
  return {
    code,
    message,
    nextSteps,
    ...(relatedTools?.length ? { relatedTools } : {}),
  };
}

/** Attach `action` onto a plain result object (mutates + returns). */
export function withAction<T extends object>(
  result: T,
  action: ActionEnvelope | undefined,
): T & { action?: ActionEnvelope } {
  if (!action) return result;
  return { ...result, action };
}

export const ActionCodes = {
  NOT_FOUND: "NOT_FOUND",
  AMBIGUOUS: "AMBIGUOUS",
  SCHEMA_FIELDS_UNAVAILABLE: "SCHEMA_FIELDS_UNAVAILABLE",
  DATA_UNAVAILABLE: "DATA_UNAVAILABLE",
  INVALID_INPUT: "INVALID_INPUT",
  CSV_NO_OWNER: "CSV_NO_OWNER",
  TARGET_METHOD_MISSING: "TARGET_METHOD_MISSING",
  FALLBACK_IDENTITY: "FALLBACK_IDENTITY",
} as const;
