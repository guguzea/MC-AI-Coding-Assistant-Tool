# sweep81 · `sectionless` 逐族定性（as-of 2026-09-18）

- 口径：`sectionless` = 该篇正文里没有 `## ` 小节（单 `#`/`###`/setext/扁平文本都算）。
- 方法：逐树抽样（≤5 篇/树），记录标题层级直方图（`#`/`##`/`###`）、下划线标题（`= / -`）、正文首 3 行；完整原始输出见 `logs/sectionless.log`、样本清单见 `SECTIONLESS-TRIAGE.json`。
- 目的：判定「无 `##`」是**采集/内容缺口**还是**上游体例差异**，决定 `assert-corpus-semantics` 是否把它升级为判据。

## 逐族结论

| 族（树） | sectionless | 抽样看到的形态 | 判定 |
|---|---|---|---|
| `bedrock_stable/bedrock-docs/stable` | **20/20（100%）** | 全篇无任何 markdown 标题：`> 来源：…/ > 抓取时间：…/ > 警告：…` 块 + 厚正文（中位 **11,323** 字符） | **体例**（Learn 文档转储为扁平文本，标题未保留；内容完整） |
| `liteloader_*/liteloader-docs/*`（3 档） | **27/30（90%）** | 上游 wiki 用 `#` + `###`（**跳过 `##`**）或 `#`+扁平；`verified-api.md` 是「已核实」表页（`#`+表格） | **体例**（标题层级选择不同） |
| `forge_*/forge-docs/*`（10 档） | 5–12/档（12–21%） | 两类：① `#` + `###`（如 `conventions_locations.md` `###×6`）；② 单 `#` + 厚散文（`networking.md`/`legacy_porting.md`/`index.md`） | **体例**（上游 docs 的排版；正文 977–3,995 中位） |
| `fabric_*/fabric-docs/*`（7 档） | 1–4/档（2–6%） | 索引页（`develop_index.md`）、VS Code 指南、Loom 选项页：用 **setext 下划线标题**或 MDX 头 | **体例**（上游页体裁） |
| `neoforge_*/neoforge-docs/*`（8 档） | 1–4/档（1–7%） | 单 `#` + 散文（`networking.md`/`datagen_glm.md`/`networking_payload.md`） | **体例** |
| `quilt_*/quilt-docs/*`（6 档） | 1/档（25–33%） | `qsl-qfapi.md` 扁平文本（`> 来源` 头 + 散文） | **体例** |
| `modloader_*/modloader-docs/*` | 1/1 | `safe-api.md`：「**空表。** 未打开 MCP named。禁止输出 func_*」——**设计如此**的空表页 | **体例（设计）** |
| `rift_1.13.2/rift-docs/1.13.2` | 1/6 | `wiki_home.md`：上游 wiki Home 只有一句欢迎语（已是具名 `residue`） | **体例（上游空页）** |
| `fabric-*/fabric-wiki/*`、其余 | 0 | — | — |

## 结论（写入门与台账）

**全部为体例差异，没有一篇属于内容缺失**：每篇要么正文厚度达标（扁平/`#`/`###`/setext 体裁），要么本身就是「空表」说明页（modloader）或上游空页（rift Home，已具名 residue）。

⇒ **决定：`sectionless` 不升级为判据**，保持「只打印」；本结论存档并写进 `assert-corpus-semantics.mjs` 的诚实边界（若未来某族改为「应当有 `##`」的体裁，再按族加判据）。
