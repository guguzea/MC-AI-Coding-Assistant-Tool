# 贡献指南

感谢你愿意为 **MC AI Coding Assistant Tool** 贡献力量。本文说明如何扩展规则、数据与 MCP Server。

---

## 模块总览

| 模块 | 路径 | 状态 | 适合贡献 |
|------|------|------|----------|
| Forge 规则 / Skills | `forge/<version>/` | 多版本已完成（主推 1.20.1） | 扩展规则、Skill、scaffold |
| Fabric 规则 / Skills | `fabric/<version>/` | 多版本已完成（主推 1.20.1 / 1.21.x） | 同上 + Fabric 专有 Skill |
| NeoForge 规则 | `neoforge/` | 已完成（主推 1.20.4+） | 扩展规则与知识 |
| MCP Server | `mcp-server/` | 以 list-tools / 实际注册为准 | 新工具、脚本、测试 |
| 离线数据 | `data/` | Forge / Fabric / NeoForge 多版本 | 抓取、索引、审计 |
| 根文档 | `README.md` / `AUTO_SETUP.md` / `AGENTS.md` | 持续维护 | 修正与同步 |

知识库与反模式通常位于 **各平台版本目录** 下的 `knowledge/`（不是仓库根目录）。

---

## 添加新平台或新版本

### 步骤 1：复制目录模板

以已完成的同平台版本为模板（Forge → `forge/1.20.1/`，Fabric → `fabric/1.20.1/`）：

```
平台/版本/
├── AGENTS.md
├── sync-skills.ps1          # 若该平台使用多 IDE 同步
├── .cursor/
│   ├── rules/               # 00–10 .mdc
│   ├── skills/
│   └── agents/
├── .claude/ / .continue/ / .trae/
├── .opencode/ / .agents/ / .zcode/ / .pi/   # OpenCode / Codex / ZCode / Pi（代表版本已支持）
├── scaffold/                # 可选：Gradle 骨架
├── code-patterns/           # 可选
└── knowledge/               # antipatterns / common / porting / version-changes
```

社区实务知识写在仓库根 `community_knowledge/`（不要双写进 `forge/*/knowledge/`）。库模组 Skill 源稿在 `knowledge/libs/`（见该目录 `README.md`）；社区用法见 `community_knowledge/AGENT_USAGE.md`。

### 步骤 2：改版本相关字段

- `AGENTS.md`：平台、MC 版本、Java、mappings、Decision Flow
- `scaffold/gradle.properties` / `build.gradle` / `fabric.mod.json` 或 `mods.toml`
- Skill frontmatter 中的 `platform` / `version` / `mappings`

### 步骤 3：同步多 IDE

修改 `.cursor/` 后：

```powershell
cd <平台>/<版本>
./sync-skills.ps1
```

或在仓库根目录批量同步全部版本（统一 8 IDE）：

```powershell
.\scripts\sync-skills.ps1 -All
.\scripts\sync-skills.ps1 -TargetDir .\forge\1.19.4
```

各版本下的 `sync-skills.ps1` 是对 `scripts/sync-skills.ps1` 的薄包装；逻辑以仓库根脚本为准。

### 步骤 4：数据与总览

1. 在 `data/` 下按约定建立 `forge_<ver>/`、`fabric_<ver>/` 或 `neoforge_<ver>/`
2. 用 `mcp-server/scripts/` 抓取并生成 L0/L1/L2 + processed
3. 更新根 `README.md`「平台说明」与 `AGENTS.md` 路由
4. `cd mcp-server && set MC_SKILL_DATA=<data绝对路径> && npm run audit:data`

---

## 扩展现有规则

每个 `.mdc` 建议包含：

1. **约束（Constraints）**
2. **Decision Flow**
3. **示例代码**（使用该版本正确的 mappings）

Decision Flow 格式：

```text
### Decision: 场景描述

IF 条件 A
  → 方案 A

IF 条件 B
  → 方案 B

ELSE
  → 默认或询问用户
```

反模式写在 `knowledge/antipatterns/` 或 `09-anti-patterns.mdc`，条目需含：错误写法、症状、正确方案、原因。

---

## 添加新 Skill

目录：`平台/版本/.cursor/skills/<skill-name>/`

```
mc-block/
├── SKILL.md          # 必须
├── snippets/         # 可选
└── README.md         # 可选
```

`SKILL.md` 顶部元数据示例：

```yaml
---
platform: forge         # forge / fabric / neoforge
version: "1.20.1"
dependencies: []
mappings: mcp           # mcp / yarn / parchment
---
```

创建或修改后必须跑 `sync-skills.ps1`。

Fabric 可额外贡献平台专有 Skill（如 Fabric API、Kotlin、Cloth Config）。

---

## 官方文档与映射数据

### 数据布局（示意）

```
data/
├── forge_1.20.1/
│   ├── forge-docs/<ver>/{raw,processed,index-l0.json,index-l1.json,index-l2.json}
│   ├── mappings/
│   └── extracted/
├── fabric_1.20.1/
│   ├── fabric-docs/<ver>/...
│   ├── fabric-wiki/<ver>/...
│   ├── mappings/          # yarn-*.jar/tiny、yarn-mappings.json、yarn-mappings.sqlite、parchment*
│   └── meta.json
└── neoforge_*/
    └── neoforge-docs/...
```

文档仍遵循 **L0 → L1 → L2 → L2+（processed）** 分层，不可跳层。

### 常用脚本（均在 `mcp-server/scripts/`）

| 方向 | 示例脚本 |
|------|----------|
| Forge 文档 | `fetch-forge-docs.js`、`process-forge-docs.js` |
| Fabric Docs / Wiki / Meta / Mappings | `fetch-fabric-*.js`、`process-fabric-*.js`、`reindex-all-versions.js` |
| Parchment / API 提取 | `parchment-extractor.js` 等 |
| Yarn SQLite | `npm run build:yarn-sqlite`（推荐；运行时禁止全量读 JSON） |
| 一致性审计 | `npm run audit:data` |

### 贡献注意

- **不要**把 `agent-tools/`、`临时文件*.md`、本地 audit 输出提交进仓库（见 `.gitignore`）
- 根 `.gitignore` 的 `/.cursor/` **只**排除仓库根 IDE 目录。平台包 `fabric/<ver>/.cursor/rules` 等必须入库（`activate_platform_pack session` 只从这里注入规则）。**不要**改回 `.cursor/`，否则新档规则对 clone 不可见、`rules[]` 为空却仍提示「已加载底座 00/01/09」
- **不要**假设 `mcp-server/data/` 是运行时路径；MCP 读取的是 `MC_SKILL_DATA` 指向的仓库根 `data/`
- 大体积 `*.jar` / `*.zip` 的忽略规则见根 `.gitignore`；完整包走 Release artifact + `SHA256SUMS` + `data-manifest.json`
- Redistribute `data/` 时附带 [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md)

---

## 数据链口径（官方标准，2026-09-12 裁定）

本节把 `temp/PLAN-2026-09-08-销账-*.md` 里逐条登记的**口径偏离**固化为标准。口径与数字冲突时，**以本节 + 门禁实算为准**，旧台账只作历史。

### 转引标签怎么读（`<<<` 与 `@[code`）

processed 正文里的这两行都是**转引标记**，不是可执行代码；读取期由 `mcp-server/src/docs-platform/fabric/transclude.ts` 展开成代码块。`<<<` 的完整形态：

```
<<< @/相对路径[#区段名][{行选}][[标签页标题]] [其余 attrs]
```

| 构件 | 读法 | 实测处数（26.1.2 + 1.21.x） |
|------|------|------|
| `#区段名` | 上游 VitePress 区段导入。标记行是 `// #region 名` / `// #endregion 名`（注释前缀随语言变），**首尾标记行不计入正文** | 521 |
| 无 `#` | 整份文件引用（含 `@/public/…`、`@/.github/…`） | 112 |
| `[[Label]]` 或紧跟的 `[Label]` | **标签页标题**，既不是路径也不是区段名；从两者剥掉，只留在出处注释 | 13 |
| `{5-7}` / `{2}` / `{1,3}` | 区段内（无区段则全文）**1-based 闭区间**行选，允许逗号并列 | 15 |
| `{classtweaker:no-line-numbers}` 等非纯数字花括号 | **选项**，一律忽略并整段给出（当成行号会让整个区段消失） | 3 |
| 语料写 kebab 而 blob 标 snake_case | `regionCandidates()` 先**逐字**匹配、再试 `-`↔`_` 变体；逐字命中 500 处 ⇒ 变体是兜底不是主路径 | 6 |

- **判据只有一份**：`parseAngleSpec()` / `angleResolve()` / `pickLines()` 由 `transclude.ts` 导出，G3 门 `import` 复用。**禁止**在门或探针里另写一份「区段名在不在」的正则——曾经分叉过一次，后果是同一页读者展开成功、门算成「未取件」并跳过核对（13 处）。
- 读者放行条件**同时认两种占位符**（`@[code` 或行首 `<<<`）。只认 `@[code` 会让「1.21.4+ 与 26.x 只用 `<<<`」的整页原样吐占位符。

### 计数器分工（禁止混用分母）

| 字段 | 口径 |
|------|------|
| `sites` / `expanded` / `missing` | **只算 `@[code`**。既有台账按此钉：`sites` 3344 处标记行、全局唯一目标 669 个（`assert-fabric-transcludes.mjs` 的 `EXPECTED_UNIQUE_TARGETS`）、processed 全展开 1672 篇 |
| `angleSites` / `angleMissing` / `angleRegionMiss` | `<<<` 独立字段：标记行数 / 本地镜像取不到的目标 / 目标取到但区段对不上 |
| 全部占位符 | `sites + angleSites`。判断「本页是否还有未展开残留」用 `hasUnexpandedMarker()`，它认两种形态 |
| 展开正确性归属 | `@[code` 归 `assert-fabric-transcludes.mjs`，`<<<` 归 G3 `assert-corpus-faithfulness.mjs`。**两套不重叠**，谁也别补谁 |

- 任何计数**必须写明分母口径**。中介名一例：S7 时点为 355 行命中 / 979 token 出现（一行两个名字记 1 行），今日盘面门重算后为 **288 行命中**——两个分母都对，只有钉住一个才有回归意义 ⇒ 门内注释与台账字段名都带「行命中」字样。
- 仓库级计数**整体排除 `temp/**`**（不做点名式排除：temp 下同形副本 ≥3 份，且卷抖动会让 `statSync` 结果漂）。

### 台账、豁免与债务

- **数字只能由门自己重算**：G3 `MC_SKILL_CORPUS_RELEDGER=1`、G4 `MC_SKILL_INDEX_RELEDGER=1` 转储后回填；G1/G2 的 LEDGER 常量取门成功行打印的实测值。**文档不重述会腐烂的计数**，只述口径。
- **台账外新增即红；台账条目停止复现也即红**（drain check，G1/G3/G4 均已实现双向对账）。债务清单**清空而不删除**：留空数组 = 零容忍，复发才响亮。
- 门禁**一律不删文件**。`data/` 下的残留（`db.sqlite.old` / `tmp-*`）只钉进 `DEBT_RESIDUE` 并出待删清单，删除动作归数据拥有者。
- 每个门禁条款必须**可被点名的投毒红**（`mcp-server/test-scripts.mjs` 内逐条 poison 已在册）。

### 验证纪律（2026-09-15 追加；三条都来自实测事故，不是预防性条款）

- **改了 `mcp-server/scripts/**` 或 `scripts/**`，收口必须跑第 8 步**：`cd mcp-server && node test-scripts.mjs`。
  单列的理由：`package.json` 的 `npm test` 链很长，一轮里往往只抽跑其中几道门（只跑
  `assert-lib-ownership` / `lint-skill-verified-api` / `assert-scripts-parse` 这类）。2026-09-15 实测到
  这样一轮「抽跑」之后 `test-scripts.mjs` **本身是红的**（生产者 `scripts/build-api-summaries.mjs`
  被改写、harness 里的投毒锚点没跟着同步），而那一轮销账只登记了跑过的那 5 道门 ⇒ 台账上看不出链在冒烟。
  第 8 步是门禁总入口（25 道 `assert-*` 串链 + G1–G4 全量 + 假根投毒），**它绿才叫「链上无已知红」**。
- **harness 里硬钉的文本锚点与计数必须随批次同步，且只许「先对齐生产侧、再改 harness」**。
  `mcp-server/test-scripts.mjs` 用硬值做**第二道独立钉**（例：`已证实包根 47`、投毒替换用的源码原文片段），
  这是刻意的双机制，不是冗余。代价是生产侧改写法/改口径后 harness 会**当场断言失败**而非静默失效 ——
  这是设计意图，**不要靠删断言让它变绿**。同步时在注释里写清「改了什么 / 为什么这不是放松」，并与
  被钉的那道门自己的 `LEDGER` 常量对齐（对齐不上说明真漂移，该改的是门台账而不是 harness）。
- **`npm test` 不能与语料/文档抓取并发跑**。`test-cli.mjs` 的 4000 ms lag 门与磁盘负载耦合
  （实测：一边跑 forge javadoc 抓取一边跑全链，`convert_mapping` 三次都在 4000 ms 内无 stdout ⇒ 假红）。
  终局验收与任何全链跑**必须独占该卷**。
- **引用门名以磁盘为准**，别照抄台账里的名字：`assert-skill-raw-normalize.mjs` 从来不存在
  （`git log --all --diff-filter=AD` 零命中），真正的门是已在链上的 `assert-sync-normalizers.mjs`。
  清单看 `ls mcp-server/scripts/assert-*.mjs`。
- **重建 `build-api-summaries.mjs` 的产物时必须显式给足 `--max-*`**：脚本默认
  `maxVersions=40 / maxClasses=500 / maxMethods=2000`，而**在库的产物是用远高于默认的上限生成的**。
  照默认重跑 = **静默劣化**（实测 `kotlin-for-forge`：给足前 类 505 / 丢 7 版 / 上限跳过 9 版；
  给足后 类 699 / 零截断）。判据：产物里的 `truncated` / `skippedVersions` / `droppedVersions` 三个键
  **出现即说明这次重建不完整**，不许拿它覆盖旧产物。KFF 那轮用的下限见
  `assert-lib-ownership.mjs` 的 `LEDGER` 注释。

### 语料忠实性不变量

- raw ↔ processed 的不变量是**逐树「篇数相等」+ 变换类别台账**（`identical` / `contentDiff` / `markerOnly` / `fmOnly` / `noTwin`），**不是** 1:1 同名配对——后者会造出 19747 处假缺失（真实 `noTwin` 19565）。
- neoforge 侧更强：`processed == stripFrontmatter(raw)` 逐字节成立。
- 泛型丢失判据 = 先解 `&lt;` / `&gt;` 实体，再用 `\b[A-Z]\w*<(?!\/)[^>\n]*>` 取**多重集**比对 raw→processed（同数改写也算未存活）。
- 上游镜像的前端元数据（front matter）**不改**：语料层字节忠实优先于本地偏好。

### jar 身份与 `packages` 归属

- 反编译产物目录身份段 = **jar 字节内容的 sha512 前 12 位**（不读文件名、不读元数据）。
- 取消 `?? "unknown-mod"` 回落：解不出 modId = 结构化失败 `MOD_ID_UNKNOWN`，**永不**坍缩进共享目录。
- 身份优先级：① jar 自己的元数据 → ② **它自己声明的内层 jar**（`META-INF/jars|jarjar/*.jar`）→ ③ 调用方给的标签（必须被该 jar 自身条目路径证实）。结果行的 `modIdEvidence` ∈ `jar` / `jarjar-self` / `jarjar-labeled` / `external`。外部证据通道**只供内部批处理器**，不进 MCP 工具 schema。
- 同 `modId` + 同 `version` 的多个 jar 是合法常态（JiJ / `.supp` / fork / repack）⇒ 按内容分叶，第二个 jar 应当**成功**。
- `meta.modId` 为字符串 `"null"` 是合法 id；只有 JSON null / 空 / `unknown*` 判未知。
- 摘要与 catalog 的 `packages` 登记**实测包**，不是声明白名单的回声：声明前缀先按本树校验，全不成立则按「modId 是路径一段（`-`/`_` 不敏感）」重建，两者都不成立时**留空并告警**，禁止退化成全收（`-all` 胖 jar 会把 Kotlin stdlib 当成本库 API）。归属判据是**段级自有**（`ROOT_SEGMENTS=3`）且只拒「命中他方已证实包根」；字面「以 modId 开头」会否掉 92.7% 的真数据。
- `packages` 是**启发式产物，不可当 import 依据**。
- `verifiedApi[key].packageOwnership` 三态 ∈ `own` / `bundled` / `unresolved`，由 `merge-verified-api.mjs` 的
  `tagPackages()` 生产（2026-09-13 裁定固化为标准）：
  - **只有非 `own` 行必须有标签**。按字面要求「每行都要有标签」在今天是 no-op（`merge --write` 新增 0 / 覆盖 0 ⇒
    目录里 0 行带标签），要先做一遍全量 retag 才满足；而 `own` 本就能由规则当场推出，强制存标签**不增加任何检出力**。
  - **债务只算「该包根确实由别的条目证实自有」那一类**（F113 的实际伤害）。纯用「含 modId 段」当债务判据会把 **866 行**
    真数据打成非 own（GeckoLib 真身 `software.bernie`、KubeJS `dev.latvian.mods`，库名根本不在包里），反而把 8 行真冒领冲掉；
    其余非 own 行靠标签可见、不记债。
  - `bundled` 必须带证据：只认**外壳自己声明的捆绑件** + 该件 zip 条目里真实的顶层包根，不猜包名 ⇒ Moonlight 早期版本的
    `net.mehvahdjukaar.selene` 会正确落 `unresolved` 而不是被冒认成 own。
  - A6 除「新增即红」外还要过 drain 对账：catalog 的 unresolved 行集与台账**双向**比，清一行必须显式删一行。

### 映射与版本口径

- 未具名映射的口径 = `name_named == name_intermediary`；G4 A7 逐档钉 `classesNamed` / `unresolvedMethods` / `unresolvedFields`。yarn 覆盖率本身 30–36%、`field_*` 与 forge SRG/TSRG era 的 `classes named == intermediary` 都属**上游事实**，不是导入缺陷。
- 成员数解析顺序一律 `meta` → `methods` → `searge_*`（**取用，不求和**），门与读者共用同一顺序。
- Forge 依赖坐标 = maven **recommended** build，并带 `forgeVersionSource` 溯源字段。
- 审计前提在磁盘上不可复现时（如已不存在的 JSONL 计数），**既不沿用为基线、也不判审计为假**：验收改用磁盘可复现的固定样本集，并把前后计数并排给出。
- 吞异常裁定判据：折叠成 `success` 的必须修真缺陷；落成可见 `failed` 的带证据关闭——**不豁免、不转挂下一档**。
- **`yarn-mappings.sqlite` 是可再生物，不是孤本**：源 `yarn-*-tiny.gz` 与它同目录且已跟踪 ⇒ 离线逐档重建即可，无需网络：
  `node scripts/_lib/build-yarn-sqlite.mjs data/fabric_<ver>/mappings --version=<ver>`。重建会把 `schemaVersion` 往前带
  （实测 3 → 4，只多 `name_official`/`name_intermediary` 单列索引），属正常迁移 ⇒ 台账按门的 `MC_SKILL_INDEX_RELEDGER=1`
  重算回填，**不许手改数字**；回填前先比对「变化是否只有 schema 那几项」，多一项就说明不是迁移而是数据变了。
- **损坏可以长得像「表存在、但 `COUNT(*)` 抛错」**（单个 b-tree 页坏），而不是「表不存在」；因此门的 `-1` 哨兵必须继续与
  「缺表」区分开上报。判定「坏在提交之前还是拷贝造成」的唯一办法是**在两个独立副本上跑同一条查询对比**：2026-09-13 实测
  `1.21.8`/`1.21.10` 的 `methods`、`1.21.11` 的 `fields` 在故障卷与其抢救副本上报错逐字一致 ⇒ 已提交字节本身坏，与拷贝无关；
  重建后每档 `methods`/`fields`/`classes` 与自身 `meta` 全部相符（46592 / 48591 / 49730 等），即内容未变、仅页坏。

---

## MCP Server 贡献

### 技术栈

- TypeScript、Node.js **>= 22.5**（**22.5–22.12 与 23.0–23.3 需 `--experimental-sqlite`**；22.13+ / 23.4+ 免）
- `@modelcontextprotocol/sdk` + `zod`
- 包名 / Cursor 服务名：`mc-ai-coding-assistant-tool` / **`MC-AI-Coding-Assistant-Tool`**

### 源码结构（摘要）

```
mcp-server/
├── src/
│   ├── index.ts                 # 入口，注册核心工具
│   ├── wave/register.ts         # Wave B/C 扩展工具
│   ├── api/                     # query_api、get_method_params、get_version_info
│   ├── mappings/                # convert_mapping + yarn-sqlite
│   ├── docs-platform/
│   │   ├── forge/ | fabric/ | neoforge/
│   │   └── store.ts             # 共享文档存储抽象
│   ├── porting/                 # analyze_porting_path、port_project
│   ├── datagen/ | crash/ | validate/ | gradle/
│   ├── utils/                   # path、project-sandbox
│   └── workers/
├── scripts/                     # 抓取 / 处理 / 审计 / yarn sqlite
├── test-*.mjs
└── dist/                        # npm run build（git 忽略）
```

### 添加新工具

1. 在对应模块实现并导出
2. 在 `src/index.ts` 或 `src/wave/register.ts` 注册
3. 补充测试（`npm test`）与 `assert-no-yarn-json-slurp` 相关约束（若触及 Yarn）
4. 更新 `README.md`、`AUTO_SETUP.md`、`mcp-server/README.md` 的工具列表
5. 用户字符串当 `Record` 键时必须用 `ownGet`（`src/utils/own-record.ts`），禁止 `obj[query]`。`constructor` / `toString` 曾让 `search_*_docs` 崩溃、让 `get_version_info` 把 Function 当版本。工具边界与版本矩阵见根 README「按版本选工具」与「工具陷阱」。

### 本地开发命令

```bash
cd mcp-server
npm ci
npm run build
npm run build:yarn-sqlite
set MC_SKILL_DATA=<仓库>/data
npm test
npm run audit:data
npm run smoke:release   # 可选
```

写盘类工具默认关闭；测试 `port_project` 真写时才设置 `MC_SKILL_ALLOW_WRITE` + `MC_SKILL_PROJECT_ROOT`。

---

## Commit 规范

使用中文 commit message，例如：

```
feat(forge/1.20.1): 添加方块实体注册规则
fix(mcp-server): 修正 Yarn sqlite 路径解析
docs(AUTO_SETUP): 同步 79 工具与配置草稿流程
chore(data): 忽略临时 plan 文件
docs(fabric/1.21.1): 补充 mixin 反模式
```

---

## 问题与讨论

如有疑问或想法，欢迎提交 Issue。配置 MCP 时请先阅读 [`AUTO_SETUP.md`](./AUTO_SETUP.md)。
