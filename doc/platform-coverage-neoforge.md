# NeoForge 建档面（根纲「检查 NeoForge」的详细内容）

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「第一步 · 3. 检查 NeoForge」的**详细内容落点**。
> 判档与决策仍以根纲那句话为准；这里存逐档读数、1.20.1 取数说明与 Forge 侧对照。

**NeoForge 建档面（实测 `ls -d neoforge/*/` 对 `ls -d data/neoforge_*/`，2026-09-05）：**

- 规则树 10 档、每档 **11 条** `00–10`：`1.20.1` / `1.20.4` / `1.20.6` / `1.21.1` / `1.21.3` / `1.21.5` / `1.21.8` / `1.21.10` / `1.21.11` / `26.1`。语料 9 档（`data/neoforge_<ver>`）。
- **唯一差额 `data/neoforge_1.20.1` 缺失 = 按设计，不是半档**：`search_neoforge_docs version=1.20.1` → `ok:true` + `forgeCompatible:true` + `versionFallback:false` + `sourceNote` 指「使用 Forge 1.20.1 文档数据（API 语义兼容）」（走的是 `data/forge_1.20.1`，不是邻近 NeoForge 版冒充）⇒ **不计入**「有树无数据」缺陷，也**不要**为凑数建 `data/neoforge_1.20.1` 克隆树。取数说明见 `CORPUS_PROVENANCE.md` §3。
- 对比：Forge 侧 `forge/1.21.1` 实测 `.cursor/rules` 内 `00–10` 数 = **0**（draft，见步骤 5）；`1.7.10` / `1.8.9` / `1.9.4` / `1.10.2` / `1.11.2` 是 **3 条短规则树**且各自有 `data/forge_<ver>` 语料——短不是漏，禁止用 1.12.2 的 00–10 顶替。
