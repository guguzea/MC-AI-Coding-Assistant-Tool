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
  WRONG_TOOL: "WRONG_TOOL",
  VERSION_REQUIRED: "VERSION_REQUIRED",
  PICK_PLATFORM: "PICK_PLATFORM",
} as const;

export function missingMcVersion(version: string | undefined | null): boolean {
  return !String(version ?? "").trim();
}

export function versionRequiredAction(): ActionEnvelope {
  return actionable(
    ActionCodes.VERSION_REQUIRED,
    "请指定版本（VERSION_REQUIRED），禁止默认 1.20.1",
    [
      "传入精确 Minecraft 版本，例如 1.20.1、1.21.1、26.1",
      "不要假设默认 1.20.1",
    ],
  );
}
