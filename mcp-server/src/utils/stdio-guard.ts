/**
 * CLI 双入口共享的 stdio / 崩溃守卫（审计 M3/M4，2026-09-17）。
 *
 * - installStdioErrorGuard()：下游管道早关（EPIPE）时结束进程，退出码按
 *   「已置的 process.exitCode（非零优先）> 失败已标记(1) > 0」取（审计 NP-2，2026-09-17：
 *   此前一律 exit(0)，会把已置的 2/1 洗白成假成功）；其它 IO 错误只打一行 stderr（不吐栈）。
 * - markFailureExit()：标记「失败已发生」（崩溃兜底路径），供 EPIPE 出口取码。
 * - installCrashGuards()：未处理拒绝 / 未捕获异常 → 用调用方注入的 emitEnvelope
 *   输出 JSON 信封（stdout 保持纯 JSON、字段沿用既有集合）后 exit（默认 1）。
 *   信封 flush 保证：emitEnvelope 返回后以「空写回调」为屏障，回调触发才退出（防半截 JSON）。
 *
 * 两个守卫须在 CLI 入口最早处安装（对齐 src/index.ts 的 MCP 入口兜底意图，
 * 但输出走 CLI 的 JSON 契约而非 console.error 裸栈）。
 */
let failureMarked = false;

/** 标记失败已发生（NP-2）：EPIPE 出口据此避免把非零语义洗成 0；不指定具体码，优先沿用已置的 process.exitCode。 */
export function markFailureExit(): void {
  failureMarked = true;
}

/** EPIPE 出口的退出码：已置非零 > 失败标记(1) > 0（成功路径被 `| head` 早关仍算成功）。 */
function epipeExitCode(): number {
  const code = process.exitCode;
  if (typeof code === "number" && code !== 0) return code;
  return failureMarked ? 1 : 0;
}

export function installStdioErrorGuard(): void {
  const onErr = (stream: "stdout" | "stderr") => (err: NodeJS.ErrnoException) => {
    if (err?.code === "EPIPE") process.exit(epipeExitCode());
    process.stderr.write(`[${stream}] ${err?.code ?? ""} ${err?.message ?? String(err)}\n`);
  };
  process.stdout.on("error", onErr("stdout"));
  process.stderr.on("error", onErr("stderr"));
}

export function installCrashGuards(opts: {
  /** 由调用方注入信封输出（保 stdout 纯 JSON、字段与 errorKind 走既有集合） */
  emitEnvelope: (err: unknown) => void;
  exitCode?: number; // 默认 1
}): void {
  let exiting = false;
  const fail = (err: unknown) => {
    if (exiting) return; // 只处理第一起，避免信封输出自身失败时递归
    exiting = true;
    markFailureExit(); // NP-2：信封输出期间撞上 EPIPE 时，退出码必须非零
    try {
      opts.emitEnvelope(err);
    } catch (e) {
      process.stderr.write(`crash（信封输出失败）: ${e instanceof Error ? e.message : String(e)}\n`);
    }
    // 以空写为 flush 屏障：确保信封已交给管道后才退出（B1）。
    process.stdout.write("", () => process.exit(opts.exitCode ?? 1));
  };
  process.on("unhandledRejection", fail);
  process.on("uncaughtException", fail);
}
