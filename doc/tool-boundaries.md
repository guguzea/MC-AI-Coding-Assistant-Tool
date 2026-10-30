# 工具边界细则（禁止误判）

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「工具边界（禁止误判）」的**详细内容落点**。
> 根纲保留两条最承重的边界（`total` 语义 = 本次返回条数、判据看 `totalPool`/`truncated` 与完整对照表指针）；
> 其余逐条细则（verbatim 支撑位、`found:false` 语义、加载器字段名四档出处、工具混用禁令、上游发布三态等）在本文件。
> 完整对照表仍以根目录 `README.md`「工具边界」为准。

### 工具边界（禁止误判）

完整对照表见根目录 `README.md`「工具边界」。调用前必须遵守：

- **优先语义搜索；`query_*` 是兼容工具**：查 API/文档/机制，先用 `search_forge_docs` / `search_fabric_docs` / `search_neoforge_docs` / `search_docs`（语义索引按档在盘），`query_api` / `query_loader_api` 仅作兜底——它们的每次响应都带兼容警告；`query_api` 的 `extracted/api-index.json` 缺件或 0 类时还会显式报告「索引为空」边界（含 1.14.4/1.15.2）。
- **检索命中 ≠ 该名字存在（verbatim 逐字支撑位）**：查询是**单个标识符形态**（类名 / 方法名 / FQCN / 资源路径；散文与 `|` 分组不判）时，每条命中多带一个 `verbatim`——`true` = 该名字在该页正文**逐字**出现（**点号 / FQCN 查询降级成「末段类名逐字」这一层**：语料几乎不写点号全名，所以命中层写在行级 `verbatimOn`、整体构成在 `verbatim_summary.matchedOn` = `term`／`tail`／`mixed`；读到 `tail` 就**不能**据此断言你输入的那串点号全名在语料里出现过）；`false` = 已读到该页正文且确认没有；**没有该字段 = 未判定**（薄档 / primer / porting 旁路 / 取不到正文），**未判定不等于「语料里没有这个名字」**。要签名就 `get_*_doc_full` 读正文，确认不了就留 `// TODO(未核实)`。该位只事后标注，不改命中集合、顺序与 `total`（闸：`mcp-server/scripts/assert-verbatim-support.mjs`）。
- **`found:false` ≠ 游戏里没有该类**：多半是索引覆盖范围外，或简名歧义（`Handler` 不会命中 `MouseHandler`）。1.12.2 只有 SRG 类名与 `func_/field_` 成员名（与 26.1+ 零类不同）；**1.7.10–1.15.2 是 SRG 索引档（类名写该版 SRG 路径，成员名是 `func_/field_`；1.14.4/1.15.2 的索引来自 MCPConfig `joined.tsrg`，docs 语料与语义索引也完整）**；Forge 特有类改 `query_loader_api` / `search_*_docs` 或反编译。
- **加载器/模组 API 的静态字段名不在 `query_loader_api` 能力内**（摘要只收类 + 方法签名，`fields` 恒为 0）⇒ 它**答不了字段名**，也不要用 `ingest_loader_api` 去「复现」字段名结论。字段名按**四档出处**落笔，四档不得混称：**① 语料逐字**（本仓 `data/**` 上游正文可复核 —— 仍然只有 `BLOCKS` / `ITEMS`）；**①b 官方构件逐字**（自备 jar 可复核、构件不入库）；**② 处方-only**（只有本档 rules/skills 自撰，无外部出处）；**③ 外部-only**（仓内不可复核）；**④ 证伪（不是未核实）**—— 例：1.18.2 **没有**流体类型注册表，流体走 `FLUIDS`，修法是删 / 改写那些表行，**不是**改名成 `FLUID_TYPES`。⚠️ **禁止把本档规则行当外部出处（那是循环引证）**：那只能当「现状长什么样」读。四档都给不出的名字留 `// TODO(未核实)`，禁止凭训练记忆补。逐档字段名证据与复核入口见 `CORPUS_PROVENANCE.md` §6。
- **`search_*_docs` 查 `constructor` 崩溃**：旧 bug（`Object.prototype`）；已修。改完 `mcp-server` 后必须 `npm run build` **并重载 MCP**，或用 `node mcp-server/dist/cli.js` 验证。
- **平台工具不要混用**：`get_version_info` 仍仅 Forge。`diagnose_gradle` 覆盖 ForgeGradle + Loom + Neo/MDG；liteloader 插件走轻量模式；Rift / BaseMod / 基岩仍早退。`validate_project` 对 Fabric/Quilt/NeoForge 做真检查，LiteLoader/Rift/ModLoader/基岩 skipped。基岩用 `validate_addon_manifest`。
- **文档 fallback 仅限查询 API**，不代表规则树可用；命中邻近版时结果含 `fallback: true` 与 `source_version`。本版无树则 `PACK_NOT_FOUND`。
- **「本仓没入库」≠「上游没有」**（`query_upstream_releases` 存在的理由）：`list_forge_versions` / `list_fabric_versions` / `list_neoforge_versions` / `list_doc_versions` 列的都是**本仓库已入库**的文档档位，不在清单只说明本仓没抓过。要回答「上游有没有该版本 / 最新到哪个 build」用 `query_upstream_releases`，并按三态读：`ok:false` ⇒ 没查到（网络/HTTP/解析），**禁止**据此断言上游没有；`ok:true` + `available:false` ⇒ 上游确实没有。`matchRule` 回显本次的版本归属规则（neoforge 尤其要记：MC `1.21.1` → 版本前缀 `21.1.`）。
- **文档 `id` 只用搜索结果**，不要用网站 URL；全文一次 ≤ 2 页。
- **社区短文不能当 API 规范**（`community_knowledge/AGENT_USAGE.md`）。
- **CLI 的 schema 拒绝已机读（2026-09-25 S6-②）**：`errorKind:"validation"` 的信封另带 `fieldErrors[]`（`{field, code, message, expected?, received?, enumValues?}`；缺必填折成 `MISSING_REQUIRED`，枚举违规给 `INVALID_ENUM_VALUE` + `enumValues`）。要按字段分支就读这个键，**不要再解析 `error` 里那条中文串**（串仍在，给人和旧消费者读）。`mcp-server` 内部生成器那层的机读码是 `result.action.code` + `resultKind`（见 A1），两套不是一回事。
- **人在环 / 写盘类默认 dryRun**（`port_project` / `mc_skill_update apply` / `activate_platform_pack write`）；`generate_*` 只吐文本。`get_workflow_template` 是清单不是流水线。Gradle、拷 jar、上传发布须用户确认后执行，不要当成漏实现的自动编排。
- **不要克隆版本文档**（1.21 wiki ≠ 26.1.2；26.1 ≠ 26.2）。
- **正文里的 `<<< @/…` 与 `@[code …]` 是转引标记，不是可照抄的代码**：`get_doc_full` / `get_fabric_doc_full` 返回的正文已由 reader（`mcp-server/src/docs-platform/fabric/transclude.ts`）展开成围栏代码块，块尾带 `<!-- source: … -->`。若返回正文里**仍有裸标记行** ⇒ 该页取件目标未落盘，属缺陷：不要把标记贴给用户，也不要凭训练记忆补正文，改口 `query_loader_api` / 用户自备 jar 核实。
- **「本档 docs 零命中」≠「该 API 不存在」**：官方文档的示例常写在 `<<< @/reference/...` include 内，`reference/` 是另一棵目录；检索按页面正文计。同理 `query_api` 的 `found:false` 只说明索引未覆盖。
- **口径以 [`CONTRIBUTING.md`](./CONTRIBUTING.md) §数据链口径为准**：标签读法（`[Label]` 是标签页标题、非数字花括号是选项、区段名先逐字再 `-`↔`_`）、计数器分母（`sites`/`expanded` 只算 `@[code`，`<<<` 走 `angleSites`）、台账与豁免规则、`packages` 归属与「不可当 import 依据」。
- **验证纪律见 [`CONTRIBUTING.md`](./CONTRIBUTING.md) §验证纪律**：改了 `mcp-server/scripts/**` 或 `scripts/**` 后，收口**必须**跑第 8 步（`cd mcp-server && node test-scripts.mjs`）——`npm test` 里抽跑几道门**不能**代替它；harness 里的硬钉锚点/计数只许「先对齐生产侧、再改 harness」，禁止靠删断言变绿；`npm test` 不得与语料抓取并发（4000 ms lag 门与磁盘负载耦合，会假红）。CLI 侧另有两档独立门：`npm run test:cli:quick`（`mcp-server/scripts/assert-cli-quick.mjs`，进默认门链）与 `npm run test:cli:full`（`mcp-server/scripts/assert-cli-full.mjs`，全量档（权威名单跑时现取），不默认跑；改动 CLI 入口/退出码/信封后应补跑）。
