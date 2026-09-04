/**
 * Actionable error envelope shared by MCP tools.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * A-27 何时置 `isError`（合同说明；本节只文档化，不改任何返回形状）
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 两条互斥的失败通道：
 *
 * 1) **带内（in-band）失败：`ok:false` + `action`（本模块）** —— 默认且压倒性多数。
 *    实测口径（**一律排除本文件自身**：合同散文里就写着 `ok: false` 字面量，计入即自指；
 *    `test-wave-bcd.mjs` 的 A-27 门按同一口径当场复算，数字脱节就翻红）：
 *    · `grep -rn "ok: false" src/ --include='*.ts' | grep -v actionable.ts | wc -l` = **304** 行 / **45** 个文件（按行计）；
 *    · 按出现次数计（含 `ok:false` 无空格与同行多次）= **306** 处 / **46** 个文件。
 *    语义 = “工具正常执行完了，但结论是否定/不完整/需要人决策”：
 *    NOT_FOUND、AMBIGUOUS、DATA_UNAVAILABLE、INVALID_INPUT、WRONG_TOOL、
 *    VERSION_REQUIRED、PACK_INCOMPLETE、VERSION_FALLBACK…（见下方 ActionCodes）。
 *    这类返回 **一律不置 isError**，MCP 层看到的是一次成功调用，模型必须去读 `action.nextSteps`。
 *
 * 2) **协议层失败：`isError: true`** —— 全仓库只有 **3 处**，都在 `src/tool-registry.ts`：
 *    · `:237` community 文档抛 `CommunityDocNotFoundError`（带 code/id/hint 的包装）；
 *    · `:250` community 处理器的兜底 `INTERNAL_ERROR`（未知异常，连返回形状都无法保证）；
 *    · `:425` `get_server_status` 的 `warmup=true` 但没传 version（VERSION_REQUIRED）。
 *    判据：**handler 没能产出它自己声明的结果对象**（抛异常、或结果通道的
 *    前置条件在注册层就被拒），才用 isError。
 *
 * 消费方（勿改，只读合同）：
 *    · MCP host：直接看 `CallToolResult.isError`。
 *    · CLI：`src/cli.ts` 的 `unwrapHandlerResult()` 先把 content[0].text 解回对象、
 *      把 isError 原样带出；再交给 `src/cli-parse.ts` 的 `isToolFailure(result, isError, failOnError)`，
 *      调用点在 `src/cli.ts` 主 dispatch 的末尾。这两个文件由并行的 CLI 会话在改，
 *      所以这里**只按符号定位、不写行号**——写死行号就是把门的可靠性押在别人的提交节奏上。
 *      审查报告里给的 cli-parse.ts 406-407 是**旧行号**（现该处落在 `UnknownFlagError`
 *      构造器里），真正的消费点就是 isToolFailure。
 *      isToolFailure 的顺序：`isError` 为真立即判失败；否则看
 *      `ok===false` / `passed===false`（`status==="skipped"` 显式豁免）/
 *      `found===false` 带 error.code / `errors[]` 非空（仅在 --fail-on-error）。
 *      两条通道在 CLI 里汇成同一个出口：`success:false` + `errorKind:"tool_failure"` + `exitCode=1`。
 *
 * 结论性规则：**不要把带内 ok:false 抬升成 isError**，也不要把 isError 降成 ok:false。
 * 抬升会让 host 把“正常的否定答案”当传输/服务端故障重试；降级会让 CLI 之外的宿主
 * 读不到失败信号。新增失败点时，先问：handler 有没有产出自己声明的结果对象？
 * 有 → ok:false + action；没有 → isError。
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
  INDEX_CORRUPT: "INDEX_CORRUPT",
  PACK_INCOMPLETE: "PACK_INCOMPLETE",
  PACK_NOT_FOUND: "PACK_NOT_FOUND",
  PICK_PLATFORM: "PICK_PLATFORM",
  VERSION_FALLBACK: "VERSION_FALLBACK",
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
      "先 list_forge_versions / list_fabric_versions / list_neoforge_versions / list_doc_versions 查看已索引版本",
      "不要假设默认 1.20.1 或 26.1",
    ],
    ["list_forge_versions", "list_fabric_versions", "list_neoforge_versions", "list_doc_versions"],
  );
}

/** validate_project / diagnose_gradle：skipped 不是失败；仅 passed===false 为失败。 */
export function isValidationFailure(result: unknown): boolean {
  if (!result || typeof result !== "object") return false;
  const r = result as Record<string, unknown>;
  if (r.status === "skipped") return false;
  return r.passed === false;
}
