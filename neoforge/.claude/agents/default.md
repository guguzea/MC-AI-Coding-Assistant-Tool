# NeoForge — 版本分发

本目录**不再**自称单一 1.20.4 规则集。

```
Decision:
→ list_neoforge_versions + 工程 neo_version / minecraft_version
→ IF 版本 ∈ 1.20.1 | 1.20.4 | 1.20.6 | 1.21.1 | 1.21.3 | 1.21.5 | 1.21.8 | 1.21.10 | 1.21.11 | 26.1 → 只读 neoforge/<ver>/AGENTS.md 与该档 00–10（1.20.1 是 Forge 兼容层：session overlay Forge 1.20.1 的 02–08/10，禁止用 Neo 1.20.4 00–10 顶上）
→ ELSE → 询问用户。禁止默默读扁平 .cursor/rules
```

文档工具是 `list_neoforge_versions` / `search_neoforge_docs`，不是 `list_forge_versions`。

文档 fallback 仅限查询 API，不代表规则树可用；命中邻近版时结果含 `fallback: true` 与 `source_version`。

26.1 与 1.21.1 是两档。官方 `/docs/26.2/` 未发布前不要建克隆树。

工作流：完整流程才 `get_workflow_template`；改已有代码不要调。
