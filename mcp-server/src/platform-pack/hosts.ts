export const PACK_HOSTS = [
  "cursor",
  "claude",
  "continue",
  "trae",
  "opencode",
  "codex",
  "zcode",
  "pi",
] as const;

export type PackHost = (typeof PACK_HOSTS)[number];

export function expandHosts(raw: string[] | undefined): PackHost[] | { error: string } {
  if (!raw || raw.length === 0) {
    return { error: "hosts 必填（cursor|claude|continue|trae|opencode|codex|zcode|pi，或 all）。禁止默认 Cursor。" };
  }
  const out: PackHost[] = [];
  const seen = new Set<string>();
  let sawAll = false;
  for (const h of raw) {
    const k = h.trim().toLowerCase();
    if (k === "all") {
      sawAll = true;
      continue;
    }
    if (!(PACK_HOSTS as readonly string[]).includes(k)) {
      return { error: `未知 host：${h}。允许：${PACK_HOSTS.join(", ")} 或 all` };
    }
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(k as PackHost);
  }
  if (sawAll) return [...PACK_HOSTS];
  return out;
}

export type HostLayout = {
  rulesDir?: string;
  rulesExt: ".mdc" | ".md";
  entryFile?: string;
  skillsDir: string;
  alwaysApply?: boolean;
  piDescription?: boolean;
};

export function hostLayout(host: PackHost): HostLayout {
  switch (host) {
    case "cursor":
      return { rulesDir: ".cursor/rules", rulesExt: ".mdc", skillsDir: ".cursor/skills", alwaysApply: true };
    case "claude":
      return {
        rulesDir: ".claude/rules",
        rulesExt: ".mdc",
        entryFile: ".claude/CLAUDE.md",
        skillsDir: ".claude/skills",
      };
    case "continue":
      return { rulesDir: ".continue/rules", rulesExt: ".mdc", skillsDir: ".continue/skills" };
    case "trae":
      return {
        rulesDir: ".trae/rules",
        rulesExt: ".mdc",
        entryFile: ".trae/agents/default.md",
        skillsDir: ".trae/skills",
      };
    case "opencode":
      return { entryFile: "AGENTS.md", rulesExt: ".mdc", skillsDir: ".opencode/skills" };
    case "codex":
      return { entryFile: "AGENTS.md", rulesExt: ".mdc", skillsDir: ".agents/skills" };
    case "zcode":
      return { entryFile: "AGENTS.md", rulesExt: ".mdc", skillsDir: ".zcode/skills" };
    case "pi":
      return { rulesDir: ".pi/rules", rulesExt: ".md", skillsDir: ".pi/skills", piDescription: true };
  }
}

export function beginMarker(host: PackHost, platform: string, version: string): string {
  return `<!-- BEGIN MC_SKILL_PACK host=${host} platform=${platform} version=${version} -->`;
}

export function endMarker(host: PackHost): string {
  return `<!-- END MC_SKILL_PACK host=${host} -->`;
}

export function upsertHostMarker(text: string, host: PackHost, platform: string, version: string, body: string): string {
  const block = `${beginMarker(host, platform, version)}\n${body.trim()}\n${endMarker(host)}\n`;
  const re = new RegExp(
    `<!-- BEGIN MC_SKILL_PACK host=${host}\\b[\\s\\S]*?<!-- END MC_SKILL_PACK host=${host} -->\\s*`,
    "g",
  );
  const matches = text.match(re);
  re.lastIndex = 0;
  if (matches && matches.length > 1) {
    const stripped = text.replace(re, "");
    const base = stripped.endsWith("\n") || stripped.length === 0 ? stripped : `${stripped}\n`;
    return `${base}\n${block}`;
  }
  if (re.test(text)) {
    re.lastIndex = 0;
    return text.replace(re, block);
  }
  const base = text.endsWith("\n") || text.length === 0 ? text : `${text}\n`;
  return `${base}\n${block}`;
}

export function removeHostMarker(text: string, host: PackHost): string {
  const re = new RegExp(
    `<!-- BEGIN MC_SKILL_PACK host=${host}\\b[\\s\\S]*?<!-- END MC_SKILL_PACK host=${host} -->\\s*`,
    "g",
  );
  return text.replace(re, "");
}

export function entryBody(host: PackHost, platform: string, version: string): string {
  const layout = hostLayout(host);
  const rulesLine = layout.rulesDir
    ? `规则见 ${layout.rulesDir}/mc-skill-*${layout.rulesExt}`
    : `本宿主不落盘规则；请 action=session；不要假设 .cursor/rules；技能 stub 见 ${layout.skillsDir}`;
  return [
    `本工程已激活 MC Skill 平台包：${platform} ${version}（host=${host}）。`,
    rulesLine,
    "也可调用 activate_platform_pack action=session 取会话索引。不要读邻版 00–10。",
  ].join("\n");
}
