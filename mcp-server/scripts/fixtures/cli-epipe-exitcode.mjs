// 门夹具（NP-2 防回归，2026-09-17）：验证 EPIPE 出口不得洗白已置的非零退出码。
//
// CLI_EPIPE_MODE=fail（默认）：置 process.exitCode=2 + markFailureExit()，再向已关闭的管道写 1MB
//   ⇒ stdio-guard 的 EPIPE 分支必须 exit 2（修复前恒 exit 0 = 假成功）。
// CLI_EPIPE_MODE=ok：不置失败码，同样写坏管道 ⇒ 仍应 exit 0（成功路径被 `| head` 早关不算失败）。
import { installStdioErrorGuard, markFailureExit } from "../../dist/utils/stdio-guard.js";

const mode = process.env.CLI_EPIPE_MODE ?? "fail";
installStdioErrorGuard();
if (mode === "fail") {
  process.exitCode = 2;
  markFailureExit();
}
process.stdout.write("x".repeat(1 << 20));
