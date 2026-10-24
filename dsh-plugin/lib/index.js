/**
 * dsh-mc-skill —— MC AI Coding Assistant 的 DSH 原生插件。
 *
 * 它买到两件事（设计依据 doc/dsh-plugin-design.md §1）：
 *   (a) **按当前模组工程自动定档、只挂该档 skill**：57 个平台档里有大量同名 skill，
 *       平铺必然撞名；按 cwd 定档后一次只列一档，且不需要把 1257 份镜像拷进用户工程。
 *   (b) **把该档底座规则（00/01/09）作为一段 system prompt 注入**：免掉手动
 *       `activate_platform_pack action=session`，档位一变规则自动换。
 *
 * 明确不做：
 *   · 不重宿 89 个 MCP 工具（MCP 工具本来就是 ctx.tools 原生注册，schema token 一样）；
 *   · 不写仓库、不跑 Gradle、不拷 jar（仓库铁律）；
 *   · 不碰 agent-instructions 的 maxBytes（那会牺牲工程自己的 AGENTS.md）。
 *
 * 装载：package.json 的 `dsh.bundle.patch` + README.md。
 */
import { createProvider, describeTier } from "./provider.js";
import { listTierLibSkillsSync, listTierSkillsSync, readTierRulesSync, resolveTierSync, prepare, isReady, BASE_RULE_IDS, normalizeRuleIdSync, allRuleIdsSync } from "./pack.js";
import { buildRulesText, resolveActiveRuleIds, SECTION_NAME, SECTION_ORDER } from "./rules.js";
import { docsReady, prepareDocs, searchDocs } from "./docs.js";

export const name = "mc-skill";

/**
 * 用到的服务。每一项都是「没有它这一支就不工作」：
 *   skills            → 注册 provider（(a)）
 *   systemPrompt      → 注册规则段落（(b)）
 *   commands          → /mc-skill 命令
 *   workingDirectory  → 拿会话 cwd（定档的唯一输入）
 *   tools             → 注册 mc_skill_detect_project
 *   fs                → 只读工程文件（走沙箱的读通道；读不受围栏限制）
 */
export const inject = ["skills", "systemPrompt", "commands", "workingDirectory", "tools", "fs"];

const COMMAND_NAME = "mc-skill";

// 注意：DSH 的 schema 子集要求 required 是**对象级的字符串数组**，
// 不能写成属性上的 required: true（那是 defineTool 的 author 方言，不是 raw JSON Schema）。
const DETECT_OUTPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["ok", "status", "platform", "minecraftVersion", "packDir", "note"],
  properties: {
    ok: { type: "boolean" },
    status: { type: "string" },
    platform: { type: "string" },
    minecraftVersion: { type: "string" },
    packDir: { type: "string" },
    note: { type: "string" },
  },
};

/**
 * 每个 session 的 topics（本会话追加的规则话题）。
 *
 * 为什么用 WeakMap 而不是全局 Map：session 不在了就该被回收，插件不该持有它的生命周期。
 * 为什么不是寄存器/投影：topics 是**本会话的临时状态**，不进会话日志、不跨重启 —— 用投影反而
 * 要求 stateSchema 与事件，代价远大于收益。
 * @type {WeakMap<object, string[]>}
 */
const sessionTopics = new WeakMap();

function topicsOf(agent) {
  const session = agent && agent.session;
  if (session === void 0 || session === null) return [];
  const got = sessionTopics.get(session);
  return Array.isArray(got) ? got : [];
}

function addTopics(agent, tokens) {
  const session = agent && agent.session;
  if (session === void 0 || session === null) return { added: [], all: [] };
  const current = topicsOf(agent);
  const next = [...current];
  const added = [];
  for (const t of tokens) {
    const norm = String(t || "").trim().toLowerCase();
    if (norm.length === 0 || next.includes(norm)) continue;
    next.push(norm);
    added.push(norm);
  }
  sessionTopics.set(session, next);
  return { added, all: next };
}

function clearTopics(agent) {
  const session = agent && agent.session;
  if (session === void 0 || session === null) return [];
  const had = topicsOf(agent);
  sessionTopics.set(session, []);
  return had;
}

/**
 * @param {any} ctx
 * @param {{repoRoot?: string}} [config]
 */
export async function apply(ctx, config = {}) {
  const repoRoot = String(config.repoRoot || "").trim();
  if (!repoRoot) {
    throw new Error("mc-skill: 配置缺 repoRoot（指向 MC_skill 仓库根的绝对路径）");
  }

  // 预加载 dist：之后所有取数都是同步的（systemPrompt.section 的 text 必须同步）。
  const prepared = await prepare(repoRoot);
  if (!prepared.ok) {
    ctx.logger.warn("mc-skill: " + prepared.reason + " —— 插件已加载但暂不提供 skill/规则；修好后重启会话即可。");
  }

  // 文档检索桥（/mc-skill doc）。失败不影响 skill / 规则面，单独降级。
  const docsPrepared = await prepareDocs({
    repoRoot,
    dataDir: repoRoot.replace(/\\/g, "/") + "/data",
    communityDir: repoRoot.replace(/\\/g, "/") + "/community_knowledge",
  });
  if (!docsPrepared.ok) {
    ctx.logger.warn("mc-skill: 文档检索不可用（" + docsPrepared.reason + "）—— /mc-skill doc 会报错，其余功能不受影响。");
  }

  const cwdOf = (agent) => {
    try {
      return ctx.workingDirectory.get(agent.session);
    } catch {
      return undefined;
    }
  };

  // ── (a) skill provider：按 cwd 定档 ───────────────────────────────────────
  ctx.skills.registerProvider(() => createProvider({ logger: ctx.logger }));

  // ── (b) 规则段落：每次 assemble 按当前档重算（同步） ──────────────────────
  ctx.systemPrompt.section({
    name: SECTION_NAME,
    order: SECTION_ORDER,
    interpolate: false,
    text: (context) => {
      const agent = context && context.agent;
      if (agent === undefined || agent === null || !isReady()) return "";
      const cwd = cwdOf(agent);
      if (typeof cwd !== "string" || cwd.length === 0) return "";
      try {
        return buildRulesText(cwd, topicsOf(agent));
      } catch (error) {
        ctx.logger.warn("mc-skill: 规则注入失败，本步不注入：" + (error && error.message ? error.message : String(error)));
        return "";
      }
    },
  });

  // ── /mc-skill 命令：纯 UI 面，零 token ────────────────────────────────────
  ctx.commands.register({
    name: COMMAND_NAME,
    description: "MC Skill：查档位/技能/规则；也可临时追加规则（rule）或按话题加规则（topic）",
    input: { hint: "[status|skills|libs|rules|rule <NN>|topic <词|clear>]" },
    async handler({ agent, rawInput }) {
      const cwd = cwdOf(agent);
      if (typeof cwd !== "string" || cwd.length === 0) {
        return { kind: "error", text: "读不到会话工作目录。" };
      }
      if (!isReady()) {
        return { kind: "error", text: "mc-skill: 知识库不可用（mcp-server/dist 未构建？先 cd mcp-server && npm run build）。" };
      }
      const raw = String(rawInput || "").trim();
      const mode = raw.toLowerCase();
      try {
        const tier = resolveTierSync(cwd);
        if (mode === "doc" || mode.startsWith("doc ")) {
          // 直接调仓库文档检索，回显摘要。零 MCP 依赖，也不唤醒模型。
          const query = raw.length > 3 ? raw.slice(4).trim() : "";
          if (query.length === 0) {
            return { kind: "error", text: "用法：/mc-skill doc <关键词>　例：/mc-skill doc DeferredRegister" };
          }
          if (!docsReady()) {
            return { kind: "error", text: "文档检索不可用（mcp-server/dist 未构建？先 cd mcp-server && npm run build）。" };
          }
          const hit = await searchDocs({
            platform: tier.platform || "",
            version: tier.minecraftVersion || "",
            query,
            limit: 5,
          });
          if (!hit.ok) return { kind: "error", text: hit.reason };
          const d = hit.data || {};
          if (d.ok === false) {
            return { kind: "error", text: "检索未通过：" + String(d.error?.message ?? d.error ?? "未知原因").slice(0, 240) };
          }
          const lines = [];
          const head = tier.status === "ok"
            ? describeTier(tier) + " · 检索「" + query + "」"
            : "（未定档，按 " + (tier.platform || "?") + " " + (tier.minecraftVersion || "?") + " 检索）· 「" + query + "」";
          lines.push(head);
          if (d.versionFallback === true) lines.push("⚠ 版本回退：请求 " + (tier.minecraftVersion || "?") + "，实读 " + d.resolvedVersion);
          lines.push(
            "命中 " + (d.total ?? 0) + " / 候选池 " + (d.totalPool ?? 0) +
            (d.truncated === true ? "（已截断，放宽 limit 可看更多）" : "") +
            " · 语义检索：" + (d.semantic === true ? "开" : "关（L0/FTS 降级）"),
          );
          const results = Array.isArray(d.results) ? d.results : [];
          // 检索是**召回型**：总会返回若干条，不表示"相关"。这里按「命中片段里是否真出现查询词」
          // 做一次诚实性检查，避免把无关结果当成命中报给用户。
          const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length >= 3);
          const touched = results.filter((r) => {
            const hay = [
              String(r.label || ""),
              String(r.id || ""),
              ...(Array.isArray(r.matches) ? r.matches.map((m) => String(m.snippet || "") + " " + String(m.sectionHeading || "")) : []),
            ].join(" ").toLowerCase();
            return terms.some((t) => hay.includes(t));
          }).length;
          if (results.length === 0) {
            lines.push("", "没有命中。换个词，或用 /mc-skill skills 看该档有哪些技能。");
          } else if (terms.length > 0 && touched === 0) {
            lines.push("", "⚠ 以下 " + results.length + " 条**没有一条真正包含**「" + query + "」——检索是召回型的，这是它凑出来的池底。换个更具体的词（类名 / 事件名 / 方法名），或直接问具体问题。");
            lines.push("");
          } else {
            lines.push("");
            results.forEach((r, i) => {
              lines.push((i + 1) + ". " + (r.label ?? r.id) + "　[" + r.id + "]");
              if (Array.isArray(r.tags) && r.tags.length > 0) lines.push("   tags：" + r.tags.join(", "));
              const m = Array.isArray(r.matches) ? r.matches[0] : undefined;
              if (m && m.snippet) {
                const snip = String(m.snippet).replace(/\s+/g, " ").trim();
                lines.push("   " + (m.sectionHeading ? "§ " + m.sectionHeading + "：" : "") + (snip.length > 220 ? snip.slice(0, 217) + "…" : snip));
              } else if (r.url) {
                lines.push("   " + r.url);
              }
            });
          }
          lines.push("", "取全文：MCP 的 get_doc_full（或 CLI：node mcp-server/dist/cli.js get_doc_full --platform=… --version=… --id=…）");
          return { kind: "success", text: lines.join("\n") };
        }
        if (mode === "rule" || mode.startsWith("rule ")) {
          // 本步注入：把指定规则作为一条 user 消息塞进下一个被接纳的步骤，不唤醒驱动器。
          const raw = mode.length > 4 ? mode.slice(5).trim() : "";
          if (raw.length === 0) {
            return { kind: "error", text: "用法：/mc-skill rule <NN|名字|all>　例：/mc-skill rule 10 或 /mc-skill rule gui" };
          }
          const one = normalizeRuleIdSync(raw);
          const ids = one === "all" ? allRuleIdsSync() : one === "" ? [] : [one];
          if (ids.length === 0) {
            return { kind: "error", text: "不认识的规则号：" + raw + "（可用：" + allRuleIdsSync().join(" / ") + "，或名字如 block/gui/registry，或 all）" };
          }
          const rules = readTierRulesSync(tier, ids);
          if (rules.ids.length === 0) {
            return { kind: "error", text: "本档没有这些规则：" + ids.join(" / ") };
          }
          const text = [
            "## MC Skill — 追加规则 " + rules.ids.join(" / "),
            "",
            "（这条是用户用 /mc-skill rule 为本步骤显式追加的，不是常驻规则。）",
            "",
            rules.text,
          ].join("\n");
          try {
            agent.inject({ content: [{ type: "text", text }], source: { kind: "mc-skill", form: "rule-append" } });
          } catch (error) {
            return { kind: "error", text: "注入失败：" + (error && error.message ? error.message : String(error)) };
          }
          const bytes = Buffer.byteLength(text, "utf8");
          return { kind: "success", text: "已把规则 " + rules.ids.join(" / ") + "（" + bytes + " 字节）排进下一个被接纳的步骤。" };
        }
        if (mode === "topic" || mode.startsWith("topic ")) {
          const raw = mode.length > 5 ? mode.slice(6).trim() : "";
          if (raw.length === 0) {
            const cur = topicsOf(agent);
            return { kind: "success", text: cur.length === 0 ? "本会话没有登记 topic。" : "本会话 topics：" + cur.join(" / ") };
          }
          if (raw === "clear" || raw === "reset") {
            const had = clearTopics(agent);
            return { kind: "success", text: had.length === 0 ? "本来就没有 topic。" : "已清空 topics（原：" + had.join(" / ") + "）。常驻底座 00/01/09 仍在。" };
          }
          const tokens = raw.split(/[\s,]+/).filter((x) => x.length > 0);
          // 先解析一遍：认不出的词不进 topics（免得状态里挂着永远不生效的词）。
          const probe = resolveActiveRuleIds([...topicsOf(agent), ...tokens]);
          const unknown = tokens.filter((tk) => {
            const one = resolveActiveRuleIds([tk]);
            return one.extra.length === 0 && one.skillHints.length === 0;
          });
          const usable = tokens.filter((tk) => !unknown.includes(tk));
          const { added, all } = addTopics(agent, usable);
          const active = resolveActiveRuleIds(all);
          const lines = [
            added.length > 0
              ? "已登记 topic：" + added.join(" / ")
              : usable.length === 0
                ? "没有可登记的 topic。"
                : "这些 topic 之前就登记过了。",
            "本会话 topics（累计）：" + (all.length > 0 ? all.join(" / ") : "（无）"),
            "当前注入规则：" + active.ids.join(" / "),
          ];
          if (unknown.length > 0) {
            lines.push("无法识别的 topic（未登记）：" + unknown.join(" / ") + "　可用形如 02 / gui / block / mixin / registry");
          }
          if (active.warnings.length > 0) lines.push("警告：" + active.warnings.join("；"));
          if (active.skillHints.length > 0) lines.push("另建议技能：" + active.skillHints.join(" / "));
          lines.push("（改动从下一个请求起生效；/mc-skill topic clear 可清空）");
          return { kind: "success", text: lines.join("\n") };
        }
        if (mode === "skills") {
          const skills = listTierSkillsSync(tier);
          const libs = listTierLibSkillsSync(tier);
          if (skills.length === 0 && libs.length === 0) return { kind: "success", text: describeTier(tier) + "\n无可用 skill。" };
          const out = [describeTier(tier) + "\n平台技能 " + skills.length + " 个："];
          out.push(...skills.map((s) => "- " + s.name + "：" + s.description));
          if (libs.length > 0) {
            out.push("", "库模组技能 " + libs.length + " 个（knowledge/libs 源稿，同名时平台档优先）：");
            out.push(...libs.map((s) => "- " + s.name + "：" + s.description));
          }
          return { kind: "success", text: out.join("\n") };
        }
        if (mode === "libs") {
          const libs = listTierLibSkillsSync(tier);
          if (libs.length === 0) return { kind: "success", text: describeTier(tier) + "\n本档无库模组技能。" };
          const lines = libs.map((s) => "- " + s.name + "：" + s.description);
          return { kind: "success", text: describeTier(tier) + "\n共 " + libs.length + " 个库模组技能：\n" + lines.join("\n") };
        }
        if (mode === "rules") {
          const rules = readTierRulesSync(tier, BASE_RULE_IDS);
          if (rules.ids.length === 0) return { kind: "success", text: describeTier(tier) + "\n无底座规则可注入。" };
          const bytes = Buffer.byteLength(rules.text, "utf8");
          const warn = rules.warnings.length > 0 ? "\n警告：" + rules.warnings.join("；") : "";
          return { kind: "success", text: describeTier(tier) + "\n底座规则：" + rules.ids.join(" / ") + "（" + bytes + " 字节，每个请求都重复计入）" + warn };
        }
        const lines = [
          "仓库根：" + repoRoot,
          "会话 cwd：" + cwd,
          "档位：" + describeTier(tier),
        ];
        if (tier.packDir) lines.push("规则包：" + tier.packDir);
        if (tier.note) lines.push("说明：" + tier.note);
        if (tier.status === "ok") {
          const skills = listTierSkillsSync(tier);
          const libs = listTierLibSkillsSync(tier);
          const cur = topicsOf(agent);
          const active = resolveActiveRuleIds(cur);
          // 报的是**实际注入段的字节数**（含标题头与尾注），不是裸规则正文 —— 与 system prompt 里看到的一致。
          const injectedText = buildRulesText(cwd, cur);
          lines.push("平台技能：" + skills.length + " 个" + (libs.length > 0 ? "（另有库模组技能 " + libs.length + " 个）" : ""));
          lines.push("注入规则：" + active.ids.join(" / ") + "（" + Buffer.byteLength(injectedText, "utf8") + " 字节）" +
            (cur.length > 0 ? "　话题：" + cur.join(" / ") : ""));
          if (active.extra.length > 0) lines.push("话题追加：" + active.extra.join(" / "));
          lines.push("提示：/mc-skill skills | libs | rules | rule <NN> | topic <词> | topic clear");
        }
        return { kind: "success", text: lines.join("\n") };
      } catch (error) {
        return { kind: "error", text: "mc-skill: " + (error && error.message ? error.message : String(error)) };
      }
    },
  });

  // ── 原生小工具：免掉 MCP 版 detect_mod_project 的 PROJECT_ROOT_REQUIRED 摩擦 ──
  //
  // 为什么直接给 schema 而不用 defineTool()：defineTool 来自 `@deepseek-ai/dsh-tools`，
  // 第三方插件从自己的目录解析不到这个裸包名（profile 的 node_modules 里没有 @deepseek-ai）。
  // ctx.tools.register 的硬要求只有三条（dsh-tools/lib/index.js 的 register）：
  //   ① output 是对象且 output.render 是函数；② output.schema 通过 assertSupportedJsonSchema；
  //   ③ parameters 是 lossless JSON。参数校验自己写在 execute 里。
  ctx.tools.register({
    name: "mc_skill_detect_project",
    description:
      "探测当前（或指定）模组工程用的是哪个平台与精确 MC 版本，并回报本仓库对应的规则包档位。" +
      "只读、不写盘、不跑 Gradle。需要文档/API 时再走 MCP 的 search_*_docs 工具。",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "要探测的工程目录绝对路径；省略则用当前会话工作目录" },
      },
      additionalProperties: false,
    },
    output: {
      schema: DETECT_OUTPUT_SCHEMA,
      render: (_args, value) => [{ type: "text", text: JSON.stringify(value) }],
    },
    execute(args, exec) {
      if (args && args.path !== undefined && typeof args.path !== "string") {
        return { ok: false, status: "invalid", platform: "", minecraftVersion: "", packDir: "", note: "path 必须是字符串" };
      }
      let cwd = args && typeof args.path === "string" ? args.path.trim() : "";
      if (cwd.length === 0) {
        const agent = exec && exec.agent;
        if (agent === undefined || agent === null) {
          return { ok: false, status: "unknown", platform: "", minecraftVersion: "", packDir: "", note: "没有会话上下文：请显式传 path" };
        }
        cwd = cwdOf(agent);
      }
      if (!isReady()) {
        return { ok: false, status: "norepo", platform: "", minecraftVersion: "", packDir: "", note: "知识库不可用（mcp-server/dist 未构建？）" };
      }
      const tier = resolveTierSync(cwd);
      return {
        ok: tier.status === "ok",
        status: tier.status,
        platform: tier.platform || "",
        minecraftVersion: tier.minecraftVersion || "",
        packDir: tier.packDir || "",
        note: tier.note || "",
      };
    },
  });
}
