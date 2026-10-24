/**
 * DSH skill provider：按**当前会话 cwd** 定档，只列该档的 skill。
 *
 * 为什么这样做（设计依据见 doc/dsh-plugin-design.md §0/§1）：
 *   · 57 个平台档里有大量同名 skill（mc-block / mc-registry …）⇒ 若全部平铺，
 *     同一根命名空间下必然撞名，且 1257 份镜像要拷进用户工程。
 *   · `list(options)` 拿得到 `options.cwd`（会话 cwd，由工具侧
 *     `ctx.workingDirectory.ensure(agent, signal)` 提供）⇒ 一次只列**一档**，
 *     同名冲突按构造消失，档位随 cwd 变化自动重算（collect 缓存 key 含 cwd）。
 *
 * 契约（dsh-skill/lib/index.js 的 validateCandidate）：
 *   name 必须 kebab-case；description 非空；source / rank / provider 必填；
 *   `provider` 必须 === 注册名；invocation 可省略（省略 = 两个都可调）。
 */
import { dirname } from "node:path";
import { listTierLibSkillsSync, listTierSkillsSync, readSkillBodySync, resolveTierSync } from "./pack.js";

/** 本 provider 的注册名（同时用作候选的 provider 字段，二者必须逐字相等）。 */
export const PROVIDER_NAME = "mc-skill";

/**
 * 为什么是 700：
 *   · 100–500 是 dsh-skill-filesystem 的默认根（700 排在其后，同层内让位给用户工程里的镜像）；
 *   · 600 是 BUNDLED_SKILL_RANK（随包 skill 先于本插件）；
 *   · 跨层 rank 无效（collectFresh 逐层 merged.set，最近的 scope 层直接赢）⇒ 这个数字只影响同层。
 */
export const TIER_RANK = 700;

/**
 * @typedef {object} PackSkill
 * @property {string} name
 * @property {string} description
 * @property {string} absPath
 * @property {string} relPosix
 * @property {string} [skillBanner]
 * @property {string} [mappingNote]
 * @property {string} [source]
 */

/** 给用户/模型看的一句话档位描述。 */
export function describeTier(tier) {
  if (tier.status === "ok") return "mc-skill " + tier.platform + " " + tier.minecraftVersion + "（按当前工程自动定档）";
  if (tier.status === "draft") return "mc-skill " + tier.platform + " " + tier.minecraftVersion + "（draft 档，未注入）";
  if (tier.status === "nopack") return "mc-skill（" + tier.platform + " " + tier.minecraftVersion + " 本仓库无规则树）";
  if (tier.status === "norepo") return "mc-skill（知识库不可用）";
  return "mc-skill（未判定为模组工程）";
}

function toCandidate(skill, tier) {
  const source = "mc-skill:" + tier.platform + "/" + tier.minecraftVersion + (skill.source ? "+" + skill.source : "");
  // 库 skill 的描述加前缀：它们与平台 skill 同名空间，但来源不同（knowledge/libs 源稿）。
  const description = skill.lib ? "[库] " + skill.description : skill.description;
  return {
    name: skill.name,
    description,
    // 两个开关都 true：模型可主动 skill 加载，用户也可 /mc-block 之类显式调用。
    invocation: { modelInvocable: true, userInvocable: true },
    source,
    rank: TIER_RANK,
    provider: PROVIDER_NAME,
    path: skill.absPath,
    locator: { absPath: skill.absPath, tier, skillBanner: skill.skillBanner, mappingNote: skill.mappingNote, lib: skill.lib === true },
  };
}

/**
 * 注册到 ctx.skills 的 provider 工厂。
 * @param {{logger?: any}} options
 */
export function createProvider(options) {
  const logger = options && options.logger;
  const warn = (message) => {
    try {
      if (logger && typeof logger.warn === "function") logger.warn("mc-skill: " + message);
    } catch {
      /* 日志失败不得影响发现 */
    }
  };

  return {
    name: PROVIDER_NAME,
    /**
     * @param {{cwd?: string}} lookup
     */
    list(lookup) {
      const cwd = lookup && typeof lookup.cwd === "string" ? lookup.cwd : process.cwd();
      try {
        const tier = resolveTierSync(cwd);
        if (tier.status !== "ok") return { candidates: [], complete: true };
        const skills = listTierSkillsSync(tier);
        // 库 skill 追加在后面；同名时平台档优先（先 push 的赢不了，所以库侧去重）。
        const taken = new Set(skills.map((s) => s.name));
        const libs = listTierLibSkillsSync(tier).filter((s) => !taken.has(s.name));
        const all = [...skills, ...libs];
        return { candidates: all.map((s) => toCandidate(s, tier)), complete: true };
      } catch (error) {
        // 不完整观测：注册表不缓存、且保留上一份可用视图（不得塌成「没有 skill」）。
        warn("list 失败，按不完整观测返回：" + (error && error.message ? error.message : String(error)));
        return { candidates: [], complete: false };
      }
    },
    /**
     * @param {any} candidate list() 产出的候选
     */
    get(candidate) {
      try {
        const locator = candidate.locator || {};
        const absPath = locator.absPath || candidate.path;
        if (!absPath) return undefined;
        const content = readSkillBodySync({
          absPath,
          skillBanner: locator.skillBanner,
          mappingNote: locator.mappingNote,
        });
        if (typeof content !== "string" || content.length === 0) {
          warn("skill 正文为空：" + absPath);
          return undefined;
        }
        return {
          name: candidate.name,
          description: candidate.description,
          invocation: candidate.invocation,
          provider: PROVIDER_NAME,
          source: candidate.source,
          resourceBase: { kind: "directory", path: dirname(absPath) },
          path: absPath,
          content,
        };
      } catch (error) {
        warn("get 失败：" + (error && error.message ? error.message : String(error)));
        return undefined;
      }
    },
  };
}
