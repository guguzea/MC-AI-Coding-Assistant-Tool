import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { dirname, isAbsolute, join, resolve, sep } from "path";
import { actionable } from "../utils/actionable.js";
import { resolveRepoRoot } from "../utils/path.js";
import {
  assertCreatableDir,
  assertWritablePath,
  isInsideReal,
  nativeReal,
  ProjectPathError,
  resolveWriteAllowRoot,
} from "../utils/project-sandbox.js";
import {
  findPack,
  inspectPack,
  isMcSkillKnowledgeRepo,
  listMergedPackSkills,
  mappingNoteForFabricSkill,
  FORGE_COMPAT_BANNER,
  QSL_OVERLAY_BANNER,
  resolvePackRules,
  wrapDonorSkillBody,
  wrapSkillBody,
  readText,
} from "./catalog.js";
import { ALL_RULE_IDS } from "./session.js";
import { detectModProject } from "./detect.js";
import { packNotFoundRelatedTools } from "./pack-not-found.js";
import {
  entryBody,
  expandHosts,
  hostLayout,
  PACK_HOSTS,
  removeHostMarker,
  upsertHostMarker,
  type PackHost,
} from "./hosts.js";

export const packWriteTestHooks: { failBeforeRel?: string } = {};

export type WriteArgs = {
  action: "write" | "deactivate";
  platform?: string;
  minecraftVersion?: string;
  hosts?: string[];
  includeSkills?: boolean;
  writeSkillStubs?: boolean;
  includeSkillBodies?: boolean;
  dryRun?: boolean;
  confirmed?: boolean;
  projectPath?: string;
};

type Manifest = {
  platform: string;
  minecraftVersion: string;
  hosts: string[];
  createdFiles: string[];
  patchedFiles: string[];
  hostFiles: Record<string, { created: string[]; patched: string[] }>;
};

type PlannedFile =
  | { kind: "create"; rel: string; content: string; host: PackHost }
  | { kind: "upsertMarker"; rel: string; host: PackHost; platform: string; version: string; body: string };

function posixRel(rel: string): string {
  return rel.replace(/\\/g, "/");
}

export function isKnowledgeRepo(root: string): boolean {
  if (isMcSkillKnowledgeRepo(root)) return true;
  // 整个知识库树禁写：版本子目录（如 <repo>/forge/1.20.1）不含根特征，
  // 但向其写入 stub/marker 会污染后续所有 agent 读取的规则源（F-B05）
  try {
    const repoReal = nativeReal(resolveRepoRoot());
    const rootReal = nativeReal(root);
    return isInsideReal(rootReal, repoReal);
  } catch {
    return false;
  }
}

function resolveUserProject(projectPath?: string): {
  ok: true;
  root: string;
  from: string;
  envDiffers?: boolean;
} | { ok: false; action: ReturnType<typeof actionable> } {
  const fromArg = projectPath?.trim() || "";
  const fromEnv = (process.env.MC_SKILL_PROJECT_ROOT || "").trim();
  const raw = fromArg || fromEnv;
  if (!raw) {
    return {
      ok: false,
      action: actionable("PROJECT_ROOT_REQUIRED", "write 需要用户模组工程绝对路径（session 仍可用）。", [
        "CLI：--project <绝对路径>",
        "或设置 MC_SKILL_PROJECT_ROOT",
      ]),
    };
  }
  if (!isAbsolute(raw)) {
    return {
      ok: false,
      action: actionable("PROJECT_ROOT_REQUIRED", "项目根必须是绝对路径。", ["使用 --project <abs>"]),
    };
  }
  const root = resolve(raw);
  if (!existsSync(root)) {
    return { ok: false, action: actionable("NOT_FOUND", `项目根不存在：${root}`, ["检查路径"]) };
  }
  if (isKnowledgeRepo(root)) {
    return {
      ok: false,
      action: actionable("REFUSE_KNOWLEDGE_REPO", "拒绝写入 MC Skill 知识库根。目标必须是用户模组工程。", [
        "把 --project / MC_SKILL_PROJECT_ROOT 改成模组工程目录",
      ]),
    };
  }
  const envDiffers = Boolean(fromArg && fromEnv && resolve(fromArg) !== resolve(fromEnv));
  return { ok: true, root, from: fromArg ? "projectPath" : "MC_SKILL_PROJECT_ROOT", envDiffers };
}

function howToWriteCli(args: {
  platform: string;
  version: string;
  hosts: string[];
  project: string;
}): string {
  const hosts = args.hosts.join(",");
  return (
    `node dist/cli.js activate_platform_pack --action=write --platform=${args.platform}` +
    ` --minecraftVersion=${args.version} --hosts=${hosts} --project ${args.project} --dry-run=false --confirm`
  );
}

function ensureFrontmatter(text: string, description: string, extra: Record<string, string>): string {
  const extraLines = Object.entries(extra)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  if (text.startsWith("---")) {
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (m) {
      let fm = m[1];
      if (!/^description:/m.test(fm)) fm = `description: ${description}\n${fm}`;
      for (const [k, v] of Object.entries(extra)) {
        if (!new RegExp(`^${k}:`, "m").test(fm)) fm = `${fm}\n${k}: ${v}`;
      }
      return `---\n${fm}\n---\n${text.slice(m[0].length)}`;
    }
  }
  const head = [`---`, `description: ${description}`, extraLines, `---`, ""].filter(Boolean).join("\n");
  return `${head}\n${text}`;
}

function destRuleName(fileName: string, ext: ".mdc" | ".md"): string {
  const base = fileName.replace(/\.(mdc|md)$/i, "");
  return `mc-skill-${base}${ext}`;
}

function skillStub(
  relPosix: string,
  name: string,
  description: string,
  platform: string,
  version: string,
): string {
  const banner =
    platform === "quilt"
      ? QSL_OVERLAY_BANNER
      : platform === "neoforge" && version === "1.20.1"
        ? FORGE_COMPAT_BANNER
        : "";
  return [
    "---",
    `name: ${name}`,
    `description: "[${platform} ${version}] ${description || name}"`,
    "---",
    "",
    `# ${name}`,
    "",
    ...(banner ? [banner, ""] : []),
    `必须先 Read 知识库相对路径 \`${relPosix}\`（相对 MC Skill 仓库根，用 MCP/detect 解析的仓库根拼接）。`,
    "找不到则再调用 `activate_platform_pack action=session` 并传 `skillNames` 取 `absPath`，不要凭 stub description 写代码。",
    "禁止把本机盘符路径写死进工程。仓库根变更或换机器后本 stub 会失效。",
    "",
  ].join("\n");
}

function quiltCopiedSkill(abs: string, name: string, description: string, fabricVer: string): string {
  const raw = readFileSync(abs, "utf8");
  const note = mappingNoteForFabricSkill(fabricVer);
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) {
    return wrapDonorSkillBody(
      note,
      `---\nname: ${name}\ndescription: ${description}\nsource: fabric/${fabricVer}\n---\n\n${raw}`,
    );
  }
  let fm = m[1];
  if (!/^source:/m.test(fm)) fm += `\nsource: fabric/${fabricVer}`;
  return wrapDonorSkillBody(note, `---\n${fm}\n---\n\n${m[2]}`);
}

function skillContentForWrite(
  sk: {
    name: string;
    description: string;
    relPosix: string;
    source?: string;
    mappingNote?: string;
    skillBanner?: string;
  },
  platform: string,
  version: string,
  includeBodies: boolean,
): string {
  if (includeBodies) {
    if (platform === "quilt" && sk.source?.startsWith("fabric/")) {
      const abs = join(resolveRepoRoot(), sk.relPosix.split("/").join(sep));
      if (existsSync(abs)) {
        const fabricVer = sk.source.slice("fabric/".length);
        return quiltCopiedSkill(abs, sk.name, sk.description, fabricVer);
      }
    }
    const abs = join(resolveRepoRoot(), sk.relPosix.split("/").join(sep));
    if (existsSync(abs)) {
      const raw = readText(abs);
      if (sk.skillBanner || sk.mappingNote) return wrapSkillBody(sk, raw);
      return raw;
    }
  }
  return skillStub(sk.relPosix, sk.name, sk.description, platform, version);
}

function resolveWriteSkillStubs(args: WriteArgs): boolean {
  if (args.writeSkillStubs !== undefined) return args.writeSkillStubs;
  if (args.includeSkills !== undefined) return args.includeSkills;
  return true;
}

function loadManifest(projectRoot: string): Manifest | null {
  const p = join(projectRoot, ".mc-skill", "pack-manifest.json");
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8")) as Manifest;
  } catch {
    return null;
  }
}

function buildWritePlan(opts: {
  projectRoot: string;
  platform: string;
  version: string;
  hosts: PackHost[];
  includeSkills: boolean;
  includeSkillBodies: boolean;
}): {
  ops: PlannedFile[];
  skipped: Array<{ rel: string; reason: string; nextSteps?: string[]; relatedTools?: string[] }>;
  overlayNote?: string;
} {
  const pack = findPack(opts.platform, opts.version);
  if (!pack) {
    // 防御路径（入口已兜底）：与 session 侧同口径，带指引而非裸 reason
    return {
      ops: [],
      skipped: [
        {
          rel: "",
          reason: "PACK_NOT_FOUND",
          nextSteps: ["改用文档工具（search_*_docs），禁止读邻档规则树"],
          relatedTools: packNotFoundRelatedTools(opts.platform),
        },
      ],
    };
  }
  const resolved = resolvePackRules({
    platform: opts.platform,
    packDir: pack.packDir,
    packVersion: pack.minecraftVersion,
    ruleIds: [...ALL_RULE_IDS],
  });
  const overlay = resolved.overlay;
  const rules = resolved.ruleBodies;
  const skills = opts.includeSkills
    ? listMergedPackSkills(opts.platform, pack.minecraftVersion, pack.packDir, overlay).skills
    : [];
  const existingManifest = loadManifest(opts.projectRoot);
  const owned = new Set((existingManifest?.createdFiles ?? []).map(posixRel));
  const ops: PlannedFile[] = [];
  const skipped: Array<{ rel: string; reason: string }> = [];

  for (const host of opts.hosts) {
    const layout = hostLayout(host);
    if (layout.rulesDir) {
      for (const rule of rules) {
        const destName = destRuleName(rule.fileName, layout.rulesExt);
        const rel = posixRel(`${layout.rulesDir}/${destName}`);
        const abs = join(opts.projectRoot, rel.split("/").join(sep));
        if (existsSync(abs) && !owned.has(rel)) {
          skipped.push({ rel, reason: "SKIP_EXISTING" });
          continue;
        }
        const desc = `MC Skill ${opts.platform} ${opts.version} ${rule.id}`;
        let content = rule.text;
        const extra: Record<string, string> = {};
        if (layout.alwaysApply) extra.alwaysApply = "true";
        content = ensureFrontmatter(content, desc, extra);
        ops.push({ kind: "create", rel, content, host });
      }
    }
    if (layout.entryFile) {
      ops.push({
        kind: "upsertMarker",
        rel: posixRel(layout.entryFile),
        host,
        platform: opts.platform,
        version: opts.version,
        body: entryBody(host, opts.platform, opts.version),
      });
    }
    if (opts.includeSkills) {
      // v1：八宿主均可 Stub。若某宿主日后要求技能必须自包含，列入此集合，不写残缺 stub。
      const HOSTS_REQUIRE_INLINE_SKILLS = new Set<PackHost>([]);
      if (HOSTS_REQUIRE_INLINE_SKILLS.has(host)) {
        skipped.push({ rel: layout.skillsDir, reason: "SKILL_STUB_UNSUPPORTED" });
        continue;
      }
      for (const sk of skills) {
        const rel = posixRel(`${layout.skillsDir}/${sk.name}/SKILL.md`);
        const abs = join(opts.projectRoot, rel.split("/").join(sep));
        if (existsSync(abs) && !owned.has(rel)) {
          skipped.push({ rel, reason: "SKIP_EXISTING" });
          continue;
        }
        ops.push({
          kind: "create",
          rel,
          content: skillContentForWrite(sk, opts.platform, opts.version, opts.includeSkillBodies),
          host,
        });
      }
    }
  }
  return { ops, skipped };
}

function mkdirForFile(abs: string, allowRoot: string | null) {
  const dir = dirname(abs);
  if (existsSync(dir)) return;
  if (allowRoot) assertCreatableDir(dir, allowRoot);
  mkdirSync(dir, { recursive: true });
}

function writeManifestAtomic(projectRoot: string, manifest: Manifest, allowRoot: string) {
  const dir = join(projectRoot, ".mc-skill");
  assertCreatableDir(dir, allowRoot);
  mkdirSync(dir, { recursive: true });
  const dest = join(dir, "pack-manifest.json");
  const tmp = `${dest}.tmp`;
  assertWritablePath(tmp, allowRoot);
  try {
    writeFileSync(tmp, JSON.stringify(manifest, null, 2), "utf8");
    renameSync(tmp, dest); // Windows 下 rename 可覆盖目标（MoveFileEx REPLACE），避免先 unlink 的崩溃窗口
  } catch (err) {
    rmSync(tmp, { force: true });
    throw err;
  }
}

export function writePlatformPack(args: WriteArgs) {
  const dryRun = args.dryRun !== false;
  const confirmed = args.confirmed === true;
  const hostsOrErr = expandHosts(args.hosts);
  if ("error" in hostsOrErr) {
    return { ok: false, action: actionable("INVALID_INPUT", hostsOrErr.error, ["传入 hosts 数组，或 hosts=all"]) };
  }
  const hosts = hostsOrErr;

  const proj = resolveUserProject(args.projectPath);
  if (!proj.ok) return { ok: false, action: proj.action };

  let platform = String(args.platform ?? "").trim().toLowerCase();
  let version = String(args.minecraftVersion ?? "").trim();
  if (!platform || !version) {
    const det = detectModProject({ projectPath: proj.root });
    if (!det.ok) {
      return {
        ok: false,
        resolvedProjectRoot: proj.root,
        action: det.action,
      };
    }
    if (!det.packFound) {
      return {
        ok: false,
        resolvedProjectRoot: proj.root,
        action:
          "action" in det && det.action
            ? det.action
            : actionable("INVALID_INPUT", "write 需要 platform + minecraftVersion（或可 detect 的工程）。", [
                "传入 platform 与 minecraftVersion",
              ]),
      };
    }
    platform = String(det.platform);
    version = String(det.knowledgeVersion ?? det.minecraftVersion ?? "");
  }

  const inspected = inspectPack(platform, version);
  if (!inspected || inspected.status === "draft") {
    const draft = inspected?.status === "draft";
    return {
      ok: false,
      resolvedProjectRoot: proj.root,
      action: actionable(
        "PACK_NOT_FOUND",
        draft
          ? `${platform} ${version} 规则包 pack-status=draft，禁止 session/write。`
          : `没有 ${platform} ${version} 规则树。`,
        ["改用文档工具，禁止邻档"],
      ),
    };
  }
  const pack = inspected.pack;

  const { ops, skipped } = buildWritePlan({
    projectRoot: proj.root,
    platform: pack.platform,
    version: pack.minecraftVersion,
    hosts,
    includeSkills: resolveWriteSkillStubs(args),
    includeSkillBodies: args.includeSkillBodies === true,
  });

  const howToWrite = {
    env: { MC_SKILL_ALLOW_WRITE: "1" },
    note: "真写还需要 dryRun=false 且 confirmed=true。CLI 不要用已废弃的 --projectRoot=。",
    cli: howToWriteCli({
      platform: pack.platform,
      version: pack.minecraftVersion,
      hosts,
      project: proj.root,
    }),
  };

  if (dryRun || !confirmed) {
    return {
      ok: true,
      dryRun: true,
      dest: "project",
      resolvedProjectRoot: proj.root,
      resolvedFrom: proj.from,
      envProjectRootDiffers: proj.envDiffers === true,
      note: proj.envDiffers
        ? "projectPath 与 MC_SKILL_PROJECT_ROOT 不同：确认写入时 MC_SKILL_PROJECT_ROOT 是硬边界，projectPath 必须落在其内，否则拒绝（PATH_OUTSIDE_ALLOWLIST）。"
        : undefined,
      platform: pack.platform,
      minecraftVersion: pack.minecraftVersion,
      hosts,
      planned: ops.map((o) => ({ kind: o.kind, rel: o.rel, host: o.host })),
      skipped,
      howToWrite,
    };
  }

  let allowRoot: string;
  try {
    allowRoot = resolveWriteAllowRoot(proj.root);
  } catch (err) {
    if (err instanceof ProjectPathError) {
      return {
        ok: false,
        resolvedProjectRoot: proj.root,
        ...(err.breakingChange ? { breakingChange: true } : {}),
        action: actionable(err.code, err.message, [
          "设置 MC_SKILL_ALLOW_WRITE=1",
          ...(err.breakingChange
            ? [
                "破坏性变更：已设置 MC_SKILL_PROJECT_ROOT 时它是硬边界，projectPath 必须落在其内",
                "把 MC_SKILL_PROJECT_ROOT 改为包含目标工程的目录，或改用其内的 projectPath",
              ]
            : []),
          "确认 --project 绝对路径",
        ]),
      };
    }
    throw err;
  }

  const created: string[] = [];
  const patched: string[] = [];
  const backups = new Map<string, string | null>();
  const hostFiles: Manifest["hostFiles"] = {};
  for (const h of hosts) hostFiles[h] = { created: [], patched: [] };
  const partial: string[] = [];

  const rollback = () => {
    for (const rel of [...created].reverse()) {
      const abs = join(proj.root, rel.split("/").join(sep));
      try {
        if (existsSync(abs)) unlinkSync(abs);
      } catch {
        /* ignore */
      }
    }
    for (const [rel, prev] of backups) {
      const abs = join(proj.root, rel.split("/").join(sep));
      try {
        if (prev === null) {
          if (existsSync(abs)) unlinkSync(abs);
        } else {
          writeFileSync(abs, prev, "utf8");
        }
      } catch {
        /* ignore */
      }
    }
  };

  try {
    for (const op of ops) {
      if (packWriteTestHooks.failBeforeRel && posixRel(op.rel) === posixRel(packWriteTestHooks.failBeforeRel)) {
        throw new Error(`test inject fail before ${op.rel}`);
      }
      const abs = join(proj.root, op.rel.split("/").join(sep));
      if (op.kind === "create") {
        mkdirForFile(abs, allowRoot);
        assertWritablePath(abs, allowRoot);
        const existed = existsSync(abs);
        if (existed && !backups.has(op.rel)) {
          backups.set(op.rel, readFileSync(abs, "utf8"));
        }
        writeFileSync(abs, op.content, "utf8");
        if (existed) {
          patched.push(op.rel);
          hostFiles[op.host].patched.push(op.rel);
        } else {
          created.push(op.rel);
          hostFiles[op.host].created.push(op.rel);
        }
        partial.push(op.rel);
      } else {
        const existed = existsSync(abs);
        const prev = existed ? readFileSync(abs, "utf8") : "";
        if (!backups.has(op.rel)) backups.set(op.rel, existed ? prev : null);
        mkdirForFile(abs, allowRoot);
        assertWritablePath(abs, allowRoot);
        const next = upsertHostMarker(existed ? prev : "", op.host, op.platform, op.version, op.body);
        writeFileSync(abs, next, "utf8");
        if (!existed) {
          created.push(op.rel);
          hostFiles[op.host].created.push(op.rel);
        } else {
          patched.push(op.rel);
          hostFiles[op.host].patched.push(op.rel);
        }
        partial.push(op.rel);
      }
    }

    const prevMan = loadManifest(proj.root);
    const mergedHostFiles: Manifest["hostFiles"] = { ...(prevMan?.hostFiles ?? {}) };
    for (const h of hosts) {
      const prev = mergedHostFiles[h] ?? { created: [], patched: [] };
      const cur = hostFiles[h] ?? { created: [], patched: [] };
      mergedHostFiles[h] = {
        created: [...new Set([...prev.created, ...cur.created])],
        patched: [...new Set([...prev.patched, ...cur.patched])],
      };
    }
    const manifest: Manifest = {
      platform: pack.platform,
      minecraftVersion: pack.minecraftVersion,
      hosts: [...new Set([...(prevMan?.hosts ?? []), ...hosts])],
      createdFiles: [...new Set([...(prevMan?.createdFiles ?? []), ...created])],
      patchedFiles: [...new Set([...(prevMan?.patchedFiles ?? []), ...patched])],
      hostFiles: mergedHostFiles,
    };
    writeManifestAtomic(proj.root, manifest, allowRoot);
    return {
      ok: true,
      dryRun: false,
      dest: "project",
      resolvedProjectRoot: proj.root,
      allowRoot,
      platform: pack.platform,
      minecraftVersion: pack.minecraftVersion,
      hosts,
      createdFiles: created,
      patchedFiles: patched,
      skipped,
      manifest: posixRel(".mc-skill/pack-manifest.json"),
    };
  } catch (err) {
    rollback();
    return {
      ok: false,
      dest: "project",
      resolvedProjectRoot: proj.root,
      partial,
      rolledBack: true,
      action: actionable("WRITE_FAILED", err instanceof Error ? err.message : String(err), [
        "已回滚本工具新建文件与标记块",
        "可 dryRun 后重试",
      ]),
    };
  }
}

export function deactivatePlatformPack(args: WriteArgs) {
  const dryRun = args.dryRun !== false;
  const confirmed = args.confirmed === true;
  const hostsOrErr = expandHosts(args.hosts);
  if ("error" in hostsOrErr) {
    return { ok: false, action: actionable("INVALID_INPUT", hostsOrErr.error, ["传入要停用的 hosts"]) };
  }
  const hosts = hostsOrErr;
  const proj = resolveUserProject(args.projectPath);
  if (!proj.ok) return { ok: false, action: proj.action };
  const man = loadManifest(proj.root);
  if (!man) {
    return { ok: true, dryRun, note: "无 pack-manifest.json，无需 deactivate", resolvedProjectRoot: proj.root };
  }

  const toDelete = new Set<string>();
  const toUnpatch = new Set<string>();
  for (const h of hosts) {
    const hf = man.hostFiles?.[h];
    if (!hf) continue;
    for (const rel of hf.created) toDelete.add(posixRel(rel));
    for (const rel of hf.patched) toUnpatch.add(posixRel(rel));
  }

  if (dryRun || !confirmed) {
    return {
      ok: true,
      dryRun: true,
      resolvedProjectRoot: proj.root,
      willDelete: [...toDelete],
      willUnpatch: [...toUnpatch],
      hosts,
      howToWrite: {
        env: { MC_SKILL_ALLOW_WRITE: "1" },
        cli: `node dist/cli.js activate_platform_pack --action=deactivate --hosts=${hosts.join(",")} --project ${proj.root} --dry-run=false --confirm`,
      },
    };
  }

  let allowRoot: string;
  try {
    allowRoot = resolveWriteAllowRoot(proj.root);
  } catch (err) {
    if (err instanceof ProjectPathError) {
      return {
        ok: false,
        resolvedProjectRoot: proj.root,
        ...(err.breakingChange ? { breakingChange: true } : {}),
        action: actionable(err.code, err.message, [
          "设置 MC_SKILL_ALLOW_WRITE=1",
          ...(err.breakingChange
            ? [
                "破坏性变更：已设置 MC_SKILL_PROJECT_ROOT 时它是硬边界，projectPath 必须落在其内",
                "把 MC_SKILL_PROJECT_ROOT 改为包含目标工程的目录，或改用其内的 projectPath",
              ]
            : []),
        ]),
      };
    }
    throw err;
  }

  const unpatched: string[] = [];
  const deleted: string[] = [];
  const undo: Array<() => void> = [];
  const entryRels = new Set(
    hosts.flatMap((h) => {
      const f = hostLayout(h).entryFile;
      return f ? [posixRel(f)] : [];
    }),
  );
  try {
    for (const rel of new Set([...toUnpatch, ...[...toDelete].filter((r) => entryRels.has(r))])) {
      const abs = join(proj.root, rel.split("/").join(sep));
      if (!existsSync(abs)) continue;
      assertWritablePath(abs, allowRoot);
      const original = readFileSync(abs, "utf8");
      let text = original;
      for (const h of hosts) text = removeHostMarker(text, h);
      writeFileSync(abs, text, "utf8");
      undo.push(() => writeFileSync(abs, original, "utf8"));
      unpatched.push(rel);
    }
    const remainHosts = man.hosts.filter((h) => !hosts.includes(h as PackHost));
    for (const rel of toDelete) {
      const stillUsed = remainHosts.some((h) => {
        const hf = man.hostFiles?.[h];
        if (!hf) return false;
        return hf.created.map(posixRel).includes(rel) || hf.patched.map(posixRel).includes(rel);
      });
      if (stillUsed) continue;
      const abs = join(proj.root, rel.split("/").join(sep));
      if (!existsSync(abs)) continue;
      if (entryRels.has(rel)) {
        const left = readFileSync(abs, "utf8").trim();
        if (left.length > 0) continue;
      }
      assertWritablePath(abs, allowRoot);
      const original = readFileSync(abs, "utf8");
      unlinkSync(abs);
      undo.push(() => writeFileSync(abs, original, "utf8"));
      deleted.push(rel);
    }

    if (remainHosts.length === 0) {
      const manPath = join(proj.root, ".mc-skill", "pack-manifest.json");
      if (existsSync(manPath)) {
        assertWritablePath(manPath, allowRoot);
        const originalManifest = readFileSync(manPath, "utf8");
        unlinkSync(manPath);
        undo.push(() => writeFileSync(manPath, originalManifest, "utf8"));
      }
    } else {
      const next: Manifest = {
        ...man,
        hosts: remainHosts,
        createdFiles: man.createdFiles.filter((f) => !toDelete.has(posixRel(f))),
        patchedFiles: man.patchedFiles.filter((f) => !toUnpatch.has(posixRel(f))),
        hostFiles: { ...man.hostFiles },
      };
      for (const h of hosts) delete next.hostFiles[h];
      const manPath = join(proj.root, ".mc-skill", "pack-manifest.json");
      const originalManifest = existsSync(manPath) ? readFileSync(manPath, "utf8") : null;
      writeManifestAtomic(proj.root, next, allowRoot);
      if (originalManifest !== null) undo.push(() => writeFileSync(manPath, originalManifest, "utf8"));
    }
  } catch (err) {
    for (const fn of undo.reverse()) {
      try {
        fn();
      } catch {
        /* 回滚失败不再追加错误 */
      }
    }
    throw err;
  }

  return {
    ok: true,
    dryRun: false,
    resolvedProjectRoot: proj.root,
    allowRoot,
    deleted,
    unpatched,
    hosts,
  };
}

export { PACK_HOSTS };
