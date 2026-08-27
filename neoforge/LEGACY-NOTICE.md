# ⚠️ LEGACY — 此目录为遗留共享树，禁止当现行版本档激活

> 2026-08 审计标注（B-1）：本目录是「单一 1.20.4 包」时代的遗物（约 3885 个文件），保留仅作历史参考。

- **现行架构**：各版本档位于 `neoforge/<version>/`（1.20.1 / 1.20.4 / … / 26.1），每档自带 `AGENTS.md` + `.cursor/rules` + knowledge + scaffold。
- **禁止**把本目录顶层 `.cursor/rules`、`.cursor/skills`、`knowledge/`、`code-patterns/`、`scaffold/` 当任何版本的规则源读取；工具侧已在 `mcp-server/src/platform-pack/catalog.ts` 将其注册为 trap（识别为分发说明，不激活）。
- `sync-skills.ps1`、顶层 AGENTS.md / CLAUDE.md 均为旧单包时代产物，不再维护。
- 本目录无代码消费方；如需彻底清理，须同步调整 catalog.ts 的仓库根识别逻辑后再删。
