import { analyzeCrash } from "../crash/index.js";
import { actionable, ActionCodes } from "../utils/actionable.js";

export interface AnalyzeLogInput {
  logText: string;
  version?: string;
}

export function analyzeLog(input: AnalyzeLogInput): Record<string, unknown> {
  const version = input.version ?? "1.20.1";
  const text = input.logText;
  const lines = text.split(/\r?\n/);
  const errors = lines.filter((l) => /ERROR|Exception|Caused by:/i.test(l)).slice(0, 30);
  const warnings = lines.filter((l) => /WARN/i.test(l)).slice(0, 20);

  let crash = null;
  if (text.includes("---- Minecraft Crash Report ----")) {
    crash = analyzeCrash({ crashReport: text, version });
  }

  return {
    ok: true,
    version,
    errorLines: errors,
    warnLines: warnings,
    crashAnalysis: crash,
    relatedTools: ["crash_analyze", "search_community_docs", "validate_project"],
  };
}

const MIGRATION_GUIDES: Record<string, { title: string; bullets: string[] }> = {
  "1.20.1->1.20.4": {
    title: "Forge 1.20.1 → 1.20.4",
    bullets: ["检查 ForgeGradle 与 Java 17", "FluidType API 变更", "考虑迁移 NeoForge 1.20.4"],
  },
  "1.20.4->1.21.1": {
    title: "NeoForge 1.21.x",
    bullets: ["Data Components 替代部分 NBT", "网络 StreamCodec", "CreativeTab 注册变更"],
  },
  "forge->neoforge": {
    title: "Forge → NeoForge",
    bullets: ["包名 net.minecraftforge → net.neoforged", "mods.toml → neoforge.mods.toml", "Capability → Data Attachments（部分）"],
  },
};

export function getMigrationGuide(route: string): Record<string, unknown> {
  const key = route.trim().toLowerCase().replace(/\s+/g, "");
  const guide = MIGRATION_GUIDES[key];
  if (!guide) {
    return {
      found: false,
      availableRoutes: Object.keys(MIGRATION_GUIDES),
      action: actionable(ActionCodes.NOT_FOUND, "未内置该迁移路线", [
        "使用 analyze_porting_path 扫描项目",
        "查阅 knowledge/version-changes",
      ], ["analyze_porting_path", "search_docs"]),
    };
  }
  return { found: true, route: key, ...guide, relatedTools: ["analyze_porting_path", "port_project"] };
}

export function checkDependencies(buildGradle: string, modsToml?: string): Record<string, unknown> {
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (!/minecraft|forge|neoforge|fabric/i.test(buildGradle)) {
    issues.push("build.gradle 未检测到 minecraft/loader 依赖");
  }
  if (/forge/i.test(buildGradle) && modsToml && !/modLoader\s*=\s*"javafml"/i.test(modsToml)) {
    issues.push("Forge 项目但 mods.toml modLoader 不是 javafml");
  }
  if (/dependencies\s*\{[^}]*\}/s.test(buildGradle) && !/implementation|modImplementation/i.test(buildGradle)) {
    suggestions.push("确认使用 implementation / modImplementation 声明依赖");
  }

  return {
    ok: issues.length === 0,
    issues,
    suggestions,
    relatedTools: ["diagnose_gradle", "analyze_porting_path"],
  };
}
