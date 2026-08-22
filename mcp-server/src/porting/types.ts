import { z } from "zod";

// ── 输入类型 ────────────────────────────────────────────────────────────────

export const analyzePortingPathSchema = z.object({
  projectPath: z.string().describe("项目根目录（绝对或相对路径）"),
  targetPlatform: z.enum(["fabric", "neoforge", "forge", "quilt", "liteloader", "rift", "modloader", "bedrock"]).optional().describe("目标平台（可选，未指定则自动推断）"),
  targetVersion: z.string().optional().describe("目标 MC 版本（如 1.20.4）"),
});

export type AnalyzePortingPathInput = z.infer<typeof analyzePortingPathSchema>;

export const portProjectSchema = z.object({
  projectPath: z.string().describe("项目根目录"),
  targetPlatform: z.enum(["fabric", "neoforge", "forge", "quilt", "liteloader", "rift", "modloader", "bedrock"]).optional().describe("目标平台"),
  targetVersion: z.string().optional().describe("目标 MC 版本"),
  modId: z
    .string()
    .regex(/^[a-z][a-z0-9_]*$/, "modId 须为小写字母开头，仅含 a-z0-9_")
    .optional()
    .describe("init_architectury 使用的 modId；未指定时从目录名推导"),
  dryRun: z.boolean().optional().default(true).describe("默认 true：仅输出 diff 预览，不写入任何文件"),
  confirmed: z.boolean().optional().describe("仅在 dryRun=false 时有效，用户显式确认后才实际写入"),
  action: z.enum(["init_architectury", "extract_common", "apply_version_migration"]).describe("要执行的动作"),
});

export type PortProjectInput = z.infer<typeof portProjectSchema>;

// ── 平台证据 ────────────────────────────────────────────────────────────────

export interface PlatformEvidence {
  forge: number;
  fabric: number;
  neoforge: number;
  quilt: number;
}

// ── analyze_porting_path 输出 ────────────────────────────────────────────────

export interface PortingStats {
  javaFiles: number;
  kotlinFiles: number;
  registryCalls: number;
  eventSubscriptions: number;
  networkUsages: number;
  mixinConfigs: number;
  clientOnlyAnnotations: number;
}

export interface RiskItem {
  level: "low" | "medium" | "high";
  affectedFiles: number;
  reason: string;
}

export interface RiskAssessment {
  registry: RiskItem;
  events: RiskItem;
  network: RiskItem;
  mixin: RiskItem;
  config: RiskItem;
}

export type QueryApiSuggestion =
  | {
      action: "query_api";
      targetClass: string;
      targetVersion: string;
      reason: string;
    }
  | {
      action: "search_neoforge_docs";
      query: string;
      version: string;
      reason: string;
    };

export interface ReferenceLink {
  title: string;
  url: string;
}

export interface CurrentInfo {
  platform: string;
  platformEvidence: PlatformEvidence;
  ambiguous: boolean;
  platformVersion: string | null;
  mcVersion: string | null;
  mappings: string | null;
  modId: string | null;
  isArchitectury: boolean;
  stats: PortingStats;
}

export interface TargetInfo {
  platform: string | null;
  mcVersion: string | null;
  mappings: string | null;
  java: number | null;
}

export interface AnalyzePortingOutput {
  ok: true;
  analysis: {
    current: CurrentInfo;
    target: TargetInfo;
    knowledgeGaps: string[];
    riskAssessment: RiskAssessment;
    recommendedRoute: string;
    routeSteps: string[];
    referenceLinks: ReferenceLink[];
    queryApiSuggestions: QueryApiSuggestion[];
  };
}

export interface AnalyzePortingError {
  ok: false;
  error: {
    code: string;
    message: string;
    hint?: string;
    next?: string[];
  };
}

// ── extract_common 输出 ──────────────────────────────────────────────────────

export type CandidateStatus = "safe_to_move" | "has_loader_calls" | "review_required";

export interface FileCandidate {
  relPath: string;
  status: CandidateStatus;
  loaderCalls: string[];
  searchPatterns?: { pattern: string; lineRange: [number, number] }[];
}

export interface RecommendedAction {
  action: string;
  files: string[];
  reason: string;
  searchPattern?: string;
}

export interface ExtractCommonOutput {
  ok: true;
  precision: {
    note: string;
    limitations: string[];
  };
  candidates: FileCandidate[];
  recommendedActions: RecommendedAction[];
}

export interface ExtractCommonError {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}

// ── init_architectury 输出 ─────────────────────────────────────────────────

export interface InitArchitecturyOutput {
  ok: true;
  dryRun: boolean;
  conflicts: {
    existingFiles: string[];
    mode: "skip" | "overwrite";
  } | null;
  filesToWrite: string[];
  diffPreview?: Record<string, string>;
  /** 未传 targetVersion 时提示 Architectury 模板默认 1.20.4 */
  warnings?: string[];
}

export interface InitArchitecturyError {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}

// ── apply_version_migration 输出 ────────────────────────────────────────────

export interface ApplyMigrationOutput {
  ok: true;
  dryRun: boolean;
  /** 真写模式下实际改写成功的源文件（dryRun 为空） */
  modifiedFiles?: string[];
  changes: {
    buildGradleUpdates: string[];
    gradlePropertiesUpdates: string[];
    packageRenames: { from: string; to: string; affectedFiles: number }[];
    /** reserved, always [] until implemented */
    todoBlocksAdded: { file: string; lines: number }[];
    unreviewedCandidates: { file: string; reason: string }[];
    /** Notes for humans — gradle files are NOT modified by this tool */
    manualFollowUps?: string[];
  };
}

export interface ApplyMigrationError {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}
