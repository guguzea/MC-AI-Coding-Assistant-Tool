/** 写盘脚本默认 dry-run；显式 `--write` 才落盘。 */
export function wantWrite(argv = process.argv) {
  return argv.includes("--write");
}

export function logDryRunBanner(scriptName) {
  console.log(`[${scriptName}] dry-run：不会写盘。确认后加 --write。`);
}
