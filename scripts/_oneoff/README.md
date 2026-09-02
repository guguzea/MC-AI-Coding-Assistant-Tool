# 一次性改写器（已执行过，勿再跑）

这些脚本曾无条件覆盖规则树 / Skill / catalog。已迁出 `scripts/` 以免误跑。

现在全部经 `scripts/_lib/write-guard.mjs` 的 `emit` / `emitCopy` 落盘：**默认就是 dry-run**，不加任何参数运行只打印 `DRYRUN <仓库相对路径>`，一个文件都不写（`--dry-run` 不需要写，也没有解析）。确认预览后再加 `--write` 才真正落盘，落盘行打印 `WROTE <路径>`。

`mcp-server/test-core.mjs` 的 `[script-write-guard]` 门禁会扫本目录与 `scripts/_lib/`：出现任何裸 `writeFileSync` / `mkdirSync` / `rmSync` 等写盘原语，或新增脚本没 import write-guard，直接失败。

批量生成 / 覆盖脚本不得用来补规则树——规则树一律逐文件手写。

`indexKnowledge()` 已抽到 `scripts/_lib/index-knowledge.mjs`。
