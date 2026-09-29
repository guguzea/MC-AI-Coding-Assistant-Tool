/**
 * generate_playtest_driver —— 游玩自测骨架生成（只吐文本；默认 driverMode=external_bridge）。
 *
 * 口径单源：`community_knowledge/authored/ingame-playtest-automation.md`。
 * 桥契约（源码级 as-of 2026-09-29）：
 *   POST /execute  CommandMessage{id,action,params,delay,target?} → ResponseMessage{id,status,message,data}（HTTP 恒 200）
 *   GET  /status   {status,version,platform,httpPort,actions,ready}；ready = player!=null && world!=null
 *   超时：服务端 responseTimeoutMs 默认 10000ms ⇒ status:"failure" + "Timeout after Nms"（无专用码 ⇒ 调用侧映射 PLAYTEST_TIMEOUT）
 * 诚实边界：本生成器产出**结构壳**；`in_jvm_player_agent` 的玩家挂接 API 全部 `// TODO(未核实)`（需用户自备 jar 反编译后填）。
 */
import { eraUpperBoundError, exactMcVersion, toPascalCase, type GeneratorResult } from "./common.js";

export const PLAYTEST_DRIVER_MODES = ["external_bridge", "in_jvm_player_agent", "temporary_client_tick_driver"] as const;
export const PLAYTEST_CAPABILITY_PROFILES = ["strict_survival", "operator", "creative"] as const;
export const PLAYTEST_POSTCONDITIONS = ["block_state", "entity_count", "inventory_contains", "marker_log", "screen_present"] as const;
export const PLAYTEST_PLATFORMS = ["forge", "neoforge", "fabric", "quilt"] as const;

export type PlaytestDriverMode = (typeof PLAYTEST_DRIVER_MODES)[number];
export type PlaytestCapabilityProfile = (typeof PLAYTEST_CAPABILITY_PROFILES)[number];
export type PlaytestPostcondition = (typeof PLAYTEST_POSTCONDITIONS)[number];

export interface PlaytestDriverInput {
  platform: string;
  version: string;
  modId?: string;
  driverMode?: PlaytestDriverMode;
  capabilityProfile?: PlaytestCapabilityProfile;
  goal?: string;
  postconditions?: PlaytestPostcondition[];
  useGameTestSourceSet?: boolean;
  evidenceDir?: string;
}

const sanitizeId = (s: string) => s.replace(/[^A-Za-z0-9_-]/g, "");
const javaIdent = (s: string) => {
  const cleaned = sanitizeId(s).replace(/-/g, "_");
  return /^[A-Za-z_]/.test(cleaned) ? cleaned : `_${cleaned}`;
};

export function generatePlaytestDriver(input: PlaytestDriverInput): GeneratorResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const platform = String(input.platform ?? "").trim().toLowerCase();
  const version = String(input.version ?? "").trim();

  if (!platform) errors.push("platform 必填（forge | neoforge | fabric | quilt）。");
  else if (!(PLAYTEST_PLATFORMS as readonly string[]).includes(platform)) {
    errors.push(`未知 platform "${platform}"：只支持 forge | neoforge | fabric | quilt。`);
  }
  if (!version) errors.push("version 必填：传精确 Minecraft 版本（如 1.21.11），禁止默认 1.20.1。");
  else if (!exactMcVersion(version)) errors.push(`必须是精确 MC 版本（x.y.z / 26.x.y），收到 ${version}。`);
  else {
    const era = eraUpperBoundError(version);
    if (era) errors.push(era);
  }
  if (errors.length > 0) return { code: null, errors, warnings };

  const mode: PlaytestDriverMode = input.driverMode ?? "external_bridge";
  if (!(PLAYTEST_DRIVER_MODES as readonly string[]).includes(mode)) {
    return { code: null, errors: [`未知 driverMode "${mode}"：只支持 ${PLAYTEST_DRIVER_MODES.join(" | ")}。`], warnings };
  }
  const profile: PlaytestCapabilityProfile = input.capabilityProfile ?? "strict_survival";
  if (!(PLAYTEST_CAPABILITY_PROFILES as readonly string[]).includes(profile)) {
    return { code: null, errors: [`未知 capabilityProfile "${profile}"：只支持 ${PLAYTEST_CAPABILITY_PROFILES.join(" | ")}。`], warnings };
  }

  const modId = sanitizeId(input.modId?.trim() || "") || "examplemod";
  const pkg = `com.example.${javaIdent(modId)}`;
  const cls = toPascalCase(modId) || "ExampleMod";
  const post = input.postconditions?.length ? input.postconditions : (["inventory_contains", "marker_log"] as PlaytestPostcondition[]);
  const evidenceDir = input.evidenceDir?.trim() || "playtest-evidence/<runId>";
  const goal = input.goal?.trim() || "<一句话：本次要验证的模组功能>";

  const actions = {
    schemaNote:
      "BlackBoxPro /execute 骨架。参数名标 _unverified 的须先按桥 -sources.jar 的 ActionCatalog（或 /execute 实测）现核再跑；screenshot{testId,prefix} 已源码核实。",
    goal,
    capabilityProfile: profile,
    driverMode: mode,
    waitReady: { via: "GET /status", until: "ready == true", timeoutMs: 120000 },
    steps: [
      { action: "chat_command", params: { command: `give @s ${modId}:<item> 1` }, _unverified: ["params.command"] },
      { action: "wait", params: { ticks: 20 } },
      { action: "use_item", params: {}, _unverified: ["params 是否为空"] },
      { action: "query_inventory_slot", params: { slot: 36 } },
      { action: "query_player_state", params: {} },
      { action: "screenshot", params: { testId: "playtest-main", prefix: "after-use" } },
    ],
    postconditions: post,
    evidence: {
      dir: evidenceDir,
      calls: "calls.jsonl",
      screenshots: "screenshots/blackboxpro/<player>/<testId>/",
    },
    bridgeSafety: "桥无鉴权 + 通配绑定（0.0.0.0）⇒ 仅本机、短会话；调用侧只连 127.0.0.1。",
  };

  const readme = `# 游玩自测骨架（${mode} / ${platform} ${version}）

> 生成物为**结构壳**：桥契约与坑位以 \`community_knowledge/authored/ingame-playtest-automation.md\` 为准；API 名一律先 \`search_*_docs\` 核对。

## 前置
1. 授权（三通道，见根 \`AGENTS.md\`「人在环例外：游玩自测」）：\`MC_SKILL_PLAYTEST_ALLOW=1\` + \`MC_SKILL_PLAYTEST_ROOT=<绝对路径>\`。
2. 桥安装（宽松许可 + 来源/版本/sha256 记账）：BlackBoxPro 对应端 jar + 依赖（fabric 端需 fabric-api 与 fabric-language-kotlin）。
3. 起游戏后先探活：\`playtest_bridge action=status\` → \`ready=true\` 才算"已进世界"。

## 跑
- 单步：\`playtest_bridge action=execute command={"action":"...","params":{...}}\`（\`confirmed=true\`）。
- 等条件：\`playtest_bridge action=await condition=ready\`（桥**没有** \`wait_until\`；超时 ⇒ \`PLAYTEST_TIMEOUT\`，不会塌成"没失败"）。
- 动作序列见 \`playtest/actions.json\`（把 \`<item>\` 等占位换成真值）。

## 证据
- 截图：\`screenshots/blackboxpro/<player>/<testId>/<NNN>_<prefix>.png\`（桥按 001 起单调编号）。
- 调用轨迹：\`${evidenceDir}/calls.jsonl\`。
- 汇总判读：\`inspect_playtest_evidence evidenceDir=<...>\` → 三态 \`present|absent|unreadable\`。
- 判读用"两遍法"：先看改动方向，再整帧像玩家一样读；跨查询非原子 ⇒ 断言只认条件，不认两条读数相等。

## 失败回灌
改码 → \`mc-build-mod\` 重建 → 换 jar → 重跑本序列；桥不可用时第二腿走 GameTest（见本仓 \`mc-gametest\` 工作流）。

## 安全
桥**无鉴权**且默认通配绑定 ⇒ 只在可信网络、短会话；不上传、不改系统网络栈/证书；证据与驱动代码不入正式实例。
`;

  const files: Record<string, string> = {
    "playtest/actions.json": JSON.stringify(actions, null, 2) + "\n",
    "playtest/README.playtest.md": readme,
  };

  if (mode !== "external_bridge") {
    warnings.push(
      `driverMode=${mode} 的玩家挂接 API 未核实（TODO）：本壳含 \`// TODO(未核实)\` 占位，编译前须先取证（自备 jar 反编译 / search_*_docs）。`,
    );
    files["playtest/PlaytestQaDriver.java"] = `// TODO(未核实)：本壳不含任何已核实的玩家挂接 / tick 钩子 / 截图 API 签名。
// 取证顺序：① 该档 search_*_docs 核 tick 钩子与截图 API；② 需要玩家行为 AI 时，对用户自备的 mc_aiplayer jar 走 decompile_mod_jar 后按签名填。
package ${pkg}.playtest;

public final class PlaytestQaDriver {
    private PlaytestQaDriver() {}

    /** 桩：把 ${goal} 拆成确定性动作序列；每步执行后写证据。 */
    public static void register() {
        // TODO(未核实): register a client tick hook here (per-loader API, verify via search_*_docs first)
        // TODO(未核实): drive the goal step by step; after each step emit [QA] markers + state snapshot
        // TODO(未核实): on completion emit "[QA] DONE"; on failure emit "[QA] ERROR: <reason>"
    }
}
`;
    files["playtest/REVERT.md"] = `# 驱动代码撤除清单（${mode}）

- 本模式测完必须把驱动代码从工程里撤掉（绝不提交）：
  - \`playtest/PlaytestQaDriver.java\`
  - 在客户端初始化处添加的 \`PlaytestQaDriver.register()\` 调用行
- 证据（截图 / state / calls）不入正式分支，放独立 evidence 目录。
`;
  }

  return { code: null, files, warnings, experimental: true };
}
