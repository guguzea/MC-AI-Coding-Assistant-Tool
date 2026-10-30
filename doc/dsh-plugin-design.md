# DSH 原生插件（dsh-mc-skill）设计调研

> 状态：**部分已实施（v0.2）** —— §8.2 的 1、2 两项（`/mc-skill topic`、`/mc-skill rule`）已落并实测，实现记录见 §8.4；§8.2 的 3–8 项仍未动（见 §8.4「未做」）。2026-10-20 由只读调研产出；所有结论带一手证据（DSH 安装体 asar 内包路径 + 行号，或本机实测）。
> 触发背景：MC_skill 已把 `dsh` 接成第 9 个写盘宿主（`activate_platform_pack --hosts=dsh` → `AGENTS.md` marker + `.agents/skills/` stub），本件回答「再往前一步、做成 DSH 原生插件，要买什么、值不值、最小切片长什么样」。

## 0. 四条决定性事实

1. **插件可在进程内复用 MCP server 的编译产物**（本机实测，零副作用）：`mcp-server/dist/platform-pack/detect.js` 导出 `detectModProject(args)` / `listPlatformPacks()`；`catalog.js` 导出 `listSkillIndex` / `listMergedPackSkills` / `listLibSkillIndex` / `resolvePackRules` / `listRuleFiles` / `knowledgeVersion` / `inspectPack` / `wrapSkillBody` 等 33 个符号。实测 `detectModProject({projectPath:"<本仓库>"})` 返回 `KNOWLEDGE_REPO_NOT_MOD`、`knowledgeVersion("fabric","26.1") === "26.1.2"`。⇒ 平台检测 / 档位折叠 / donor 合并 / 规则与技能清单**零重写**。
2. **provider 能按「当前模组工程」动态定档**：`ctx.skills.registerProvider()` 的 `list(options)` 收到 `options.cwd`（会话 cwd，由 `ctx.workingDirectory.ensure(agent)` 给出；`dsh-tool-skill/lib/index.js:935-938`）⇒ 57 档同名冲突**按构造消失**（任何时刻只列一档），1257 份镜像不再必需。
3. **跨层 rank 无效（关键陷阱）**：`dsh-skill` 的 `collectFresh` 逐层 `merged.set`，最近的 scope 层直接赢（`dsh-skill/lib/index.js:298-311`）；而 `skill-filesystem` 挂在 **preset 层**（`dsh-web-app/presets/standard.patch.yml:37-38`），全局 host 行被显式关闭（`dsh-web-app/cordis.patch.yml:505-518`）。⇒ **全局行的 provider 压不过 preset 层同名候选**；要压过只能整块重述 `preset-standard.config.plugins`（≈129 行，且 DSH 升级即失步）。
4. **11 条规则能进上下文**，三条原生路都在现有面内：`ctx.systemPrompt.section()`（system 角色，`text` 可为 `(context)=>string`）、`ctx.systemPrompt.context()`（user 角色快照）、`ctx.on("system-prompt/assemble", …, {prepend:true})`（活样板 `dsh-working-directory/lib/index.js:48-65`）。**卡点不是「能不能」而是代价**：11 条全文实测 **102,485 B**（`forge/1.20.1/.cursor/rules`）≈ 每次请求 25–30k token ⇒ 建议常驻 `00/01/09`，其余按需。

## 1. 功能面：买什么、值不值

| 功能 | 买到什么 | 判断 |
|---|---|---|
| (a) 按工程自动定档、只挂该档 skill | 同名冲突按构造消失；不必把镜像拷进用户工程；donor / overlay（Fabric donor、Quilt 覆写、Forge 1.20.1 兼容横幅）自动生效；档位随 cwd 自动重算（collect 缓存 key 含 cwd） | **最值**，唯一能根治「1257 镜像 + 同名冲突」的路径 |
| (b) 把该档规则送进会话 | 免掉手动 `activate_platform_pack action=session`；档位一变规则自动换；`topics`/`task` 选择逻辑可直接复用 `resolvePackRules` | **值但必须限量**：全文 102 KB/请求。常驻 `00/01/09`（≈32 KB，与 MCP session 的 `BASE_RULE_IDS` 口径一致），其余 8 条做成按需 skill |
| (c) 把 89 个 MCP 工具原生化 | **几乎没买到**：MCP 工具本就是 `ctx.tools.register()` 注册的原生定义，PTC 下同样进 `run_code` SDK，schema token 成本一样。只买到去子进程 / 降延迟 / 绕开环境清洗 | **不值**（要重宿 89 个实现） |
| (d) `/mc-skill` 命令 | 纯 UI 面、**不产生模型消息、零 token**。适合 `/mc-skill status`（报档）、`/mc-skill use forge 1.20.1`（覆盖档位）、`/mc-skill rules 02`（本步注入某条规则） | **值且便宜**（~30 行）。注意 headless / ACP 无命令面，不能当唯一入口 |
| (e) 其它钩子 | `ctx.systemPrompt.variable("mcPlatform"/"mcVersion")`；一个原生小工具 `mc_skill_detect_project`（免掉 MCP 版 `PROJECT_ROOT_REQUIRED` 摩擦）；`agent/pre-step` 通知（**不必**：runtime context 已自带文本不变不追加的去重） | 前两项值，第三项不必 |

## 2. 实现面（包名 + 导出名）

- **插件形状**：ESM `export { apply, inject, name }`；`apply(ctx, config)`；Config 用 `@deepseek-ai/schemastery` 的 `z.object`。最小样板 `dsh-skill-badge/lib/index.js`（54 行，可逐行抄）。
- **打包/装载**：`package.json` 的 `dsh.bundle.patch`（string 或有序数组）；patch = 顶层数组 + 一行 `- insert: [{id,name,config}]`；安装走 `dsh plugin --profile desktop add <spec>`（本地绝对路径可用）或列进 profile `package.json` 的 `dsh.profile.bundles`。
- **skill provider 契约**：`ctx.skills.registerProvider((control)=>({name, list, get}))`；候选必填 `name`(kebab) / `description`(非空) / `invocation`(两个 boolean) / `source` / `rank` / `provider`(**必须 === 注册名**)；`list()` 可返回数组或 `{candidates, complete}`；`get()` 返回的定义 `name` 必须等于候选名否则判陈旧。排序 = `rank → providerOrder → localOrder`（同层内）。`BUNDLED_SKILL_RANK=600` 已导出。
- **工具**：`import { defineTool } from "@deepseek-ai/dsh-tools"` → `ctx.tools.register(defineTool({name, description, parameters, output, execute}))`。
- **命令**：`ctx.commands.register({name, description, input, handler})`。
- **文件读取**：`ctx.fs`（desktop 用 `dsh-fs-sandbox`）。**读不受围栏限制**（读取/列出/stat/watch 与 fs-local 一致）⇒ 插件读工程外的本仓库合法。
- **HMR**：desktop 的 `hmr` 行启用；改 profile patch / manifest 即重组合；监听源码模块需 patch `hmr.config.root`。
- **`engines.dsh`**：`dsh-app-boot` 的 `unmetRequirements` —— **有 `engines.dsh` 就只看它**，否则才看 `@deepseek-ai/dsh*` peer；不满足的 bundle 被**静默跳过**（只留一行 stderr + `skippedBundles`）。本机 runtime `0.2.1-rc.2` 满足 `^0.2.0`。**不写 `engines.dsh` 不会被禁用**；写错范围才会。

## 3. 不做的边界

1. **做不到**：用 profile patch 按 id 覆盖 preset 嵌套行 —— `applyEntryPatches` 只索引 `entry.group===true && Array.isArray(entry.config)` 的行（`dsh-app-boot/lib/index.js:64-70, 81-84`），`preset-standard.config.plugins` 是对象字段 ⇒ 只能整块替换该行 `config`。
2. **代价过高**：把插件挂进 preset 层以压过 `skill-filesystem`（要整块重述 ≈129 行 / 40 个子插件行，DSH 升级即失步）。⇒ MVP 走全局行，接受「用户工程里若已有 `.agents/skills` 镜像则镜像赢」。
3. **做不到**：减少 skill 目录 token —— 目录是全量替换，skill 正文无大小上限。
4. **不做**：client 半身（Web 面板/设置页）；重宿 89 个工具；在插件里跑 Gradle / 写盘 / 上传（仓库铁律）。

## 4. 最小可行切片（MVP）

建议落 `dsh-plugin/`（新顶层目录；`assert-script-write-guard` 只扫 `scripts` + `mcp-server/scripts`，`assert-skill-skeleton-census` 只收 `<dir>/<ver>/.cursor/skills/mc-*`，均扫不到这里）：

| 文件 | 职责 |
|---|---|
| `dsh-plugin/package.json` | `type:module`；`main:lib/index.js`；`dsh.bundle.patch:"./cordis.patch.yml"`；`engines.dsh:"^0.2.0"`；peer 只写 `@deepseek-ai/cordis`（**别写 `@deepseek-ai/dsh-*`**，否则多一条版本腿） |
| `dsh-plugin/cordis.patch.yml` | 一行 `- insert: [{id: mc-skill, name: <pkg>, config:{repoRoot}}]` |
| `dsh-plugin/lib/index.js` | `name` / `inject(["skills","systemPrompt","commands","workingDirectory","fs"])` + `apply`：注册 provider、一条 `/mc-skill` 命令、（可选）`mc_skill_detect_project` 工具 |
| `dsh-plugin/lib/pack.js` | 懒 `import(pathToFileURL(<repo>/mcp-server/dist/platform-pack/{detect,catalog}.js))`；导出 `resolveTier(cwd)` 与 `baseRules(packDir, ids)` |
| `dsh-plugin/lib/provider.js` | `list(options)` → `resolveTier(options.cwd)` → 映射为候选（`rank:700`、`source:"mc-skill:<platform>/<ver>"`）；`get(candidate)` → `wrapSkillBody(...)` + `resourceBase` |
| `dsh-plugin/lib/rules.js` | `ctx.systemPrompt.section({name:"mc-skill:rules", order:9000, interpolate:false, text:(context)=>…})`，只拼 `00/01/09` |
| `dsh-plugin/README.md` | 安装两行 + 五条验收命令 |

**机械验收**：A1 定档正确（cwd=该档时同名 skill 只 1 条且正文含该档标识；换档后正文随之变）；A2 不依赖镜像（把该档 `.agents/skills` 改名后目录仍列出）；A3 规则进上下文（新会话 system 段含 `00` 正文片段）；A4 `/mc-skill status` 有回执且会话日志**无** `user/message`（零 token）；A5 装载后启动 stderr **无** `skipping profile bundle`；A6 `cd mcp-server && node test-scripts.mjs` rc=0。

## 5. 风险

1. **版本耦合**：不写 `engines.dsh` 无约束；写错范围 ⇒ bundle 静默跳过。只写 `engines.dsh` + cordis peer，别写 `@deepseek-ai/dsh-*` peer。
2. **HMR/热更**：改插件文件需下一次重组合才替换；开发用 `link:` 指向插件目录，验收前重启一次。
3. **与 MCP 重复**：两条发现路径读同一批文件 ⇒ 必须**只读不复制**（`catalog.js` 的 `listMergedPackSkills` 是唯一真源）。**不要重复提供 `~/.agents/skills` 里那 12 个 `mc-*` 名字**（它们在 preset 层 rank 500，插件在全局层必然被压，目录会出现「被遮蔽但不报错」的静默行为）。
4. **仓库门链**：`assert-scripts-parse` 按 `git ls-files` 全仓语法检查 ⇒ 插件里的 `.js` 一旦提交会被 `node --check`；写盘门只扫 `scripts` + `mcp-server/scripts`；骨架普查只收平台档 `.cursor/skills/mc-*`。⇒ 新目录不会被误判，但插件必须**只读仓库**。
5. **两处真值源**：插件若 import `dist/`，README 必须写明「先 `npm run build`」；`list()` 应捕获 import 失败并返回 `{candidates:[], complete:false}`（合法，注册表不缓存不完整观测）。

## 6. 未核实

- `ctx.skills` 能否从「非 preset scope」写进 preset 层（读遍 `dsh-scope` / `dsh-skill` 未见公开 API；`registerProvider` 一律落 `scopeOf(this.ctx)`）。
- `dsh-package-manifest` 与 `dsh-app-boot` 对 `engines.dsh` 是否强制的措辞不一致（以 app-boot 代码为准）。
- runtime context 快照替换的字节级 token 账。

## 7. 证据索引（关键行）

- provider 契约 / rank / 跨层：`dsh-skill/lib/index.js:147-183, 224-264, 298-311, 414-423, 452-464, 519-521`
- filesystem provider 吃 cwd + 各根 rank：`dsh-skill-filesystem/lib/index.js:20-43, 92-133`
- 目录 / 加载 / 命令面：`dsh-tool-skill/lib/index.js:869-938`
- 提示词注入：`dsh-system-prompt/lib/index.js:253-330`；`dsh-harness-dev-context/lib/index.js:98-121`；`dsh-working-directory/lib/index.js:41-65`
- patch 语义 / preset 不可按 id 覆盖：`dsh-app-boot/lib/index.js:61-110, 279-298, 517-531, 1015-1041`；`dsh-web-app/presets/standard.patch.yml`
- 全局 vs preset 层：`dsh-web-app/cordis.patch.yml:505-518, 573-574`；`dsh-scope/lib/index.js:162-169, 276-280`
- 可复用产物：`mcp-server/dist/platform-pack/catalog.d.ts`（`SkillIndexEntry` / `listMergedPackSkills` / `resolvePackRules`）；`detect.js`
- 仓库门链：`mcp-server/scripts/assert-scripts-parse.mjs`；`mcp-server/scripts/_lib/script-write-guard-check.mjs`；`mcp-server/scripts/assert-skill-skeleton-census.mjs`

## 8. 已实现（v0.1.0）与后续可加功能

### 8.1 v0.1.0 已实现

| 能力 | 实现 | 验证 |
|---|---|---|
| 按工程定档、只挂该档 skill | `provider.list({cwd})` → `resolveTierSync` | 真机：forge 35 / fabric 38 / neoforge 35，无跨档重名 |
| 底座规则注入 | `systemPrompt.section` 只放 00/01/09 | 真机：section 是 string、32458 B |
| 库模组技能进目录 | `listLibSkillIndex` 按平台追加，描述加 `[库]` 前缀 | forge 档 19 个、无重名冲突 |
| 零 token 查询 | `/mc-skill [status\|skills\|libs\|rules]` | 真机：四档都返回 success |
| 免摩擦探测 | `mc_skill_detect_project` | 真机：三平台都正确 |

### 8.2 后续可加（按价值/代价排序，均未实现）

| # | 功能 | 价值 | 代价 | 可行性依据 |
|---|---|---|---|---|
| 1 | **按话题注入规则** `/mc-skill topic <词>` | **已实现（v0.2）** | 复用 `session.js` 的 `resolveTopicIds`，零重写判据 | 实测：`gui→10`、`02 03`、`mixin→skillHint`、坏词有告警 |
| 2 | **`/mc-skill rule <NN>` 单条注入** | **已实现（v0.2）** | 用 `agent.inject({content,source})`：落下个被接纳的步骤、**不唤醒驱动器** | 实测：`rule 10`/`gui`/`02-block` 均注入，注入消息带 `source.kind="mc-skill"` |
| 3 | **`/mc-skill doc <关键词>`**：直接调仓库文档检索并回显摘要 | 中——省一次 MCP 往返 | 中：要么 `ctx.web`，要么在进程内 `import mcp-server/dist/docs-platform/*`（要确认那套模块能否脱离 MCP server 单独跑） | 未核实（docs-platform 依赖 warmup/索引状态） |
| 4 | **知识库 `knowledge/` 也进目录**：每档的 `antipatterns/` / `porting/` / `version-changes/` 做成 skill | 中高——这些正是「查过就少犯错」的内容，现在 MCP 才能读 | 中：需要给每篇 md 合成 frontmatter（name/description），并决定放到哪个 rank | 目录已确认存在（每档 5 个子目录） |
| 5 | **会话级档位覆盖**：`/mc-skill use forge 1.20.1` 强制某档（现在的 `.cursor` 里没工程也该能用） | 中——读别人代码/写文档时没有工程可测 | 中：需要 `ctx.sessionProjections` 存覆盖值（活样板：`dsh-working-directory` 的 projection） | projection API 已读到 |
| 6 | **`/mc-skill check`**：跑一遍该档的规则自检（如 mappings 口径、modid 合法性） | 中 | 高：要么在插件里重写判据（会与仓库门漂移），要么调 MCP 的 `validate_project` | 违反「只读不复制」纪律，倾向不做 |
| 7 | **PTC 原生 SDK 类型**：让 `run_code` 里出现 `mc_*` 的类型定义 | 低——工具本来就在 PTC 里可见 | 低 | 自动生效，无需额外做 |
| 8 | **client 半身（Web 面板）**：设置页里选档位 | 低 | 高：要 `dsh.client`、单独打包、HMR；设计稿 §3 已明确不做 | 不做 |

### 8.3 明确不建议

- **在插件里跑 Gradle / 写盘 / 拷 jar**：仓库铁律禁止 agent 代跑，插件只是换个载体，禁令照样成立。
- **重宿 89 个 MCP 工具**：MCP 工具本来就是 `ctx.tools` 原生注册，token 成本一样。
- **改 `agent-instructions` 的 `maxBytes` 来塞规则**：会挤掉工程自己的 `AGENTS.md`。

### 8.4 v0.2 实现记录（本轮）

两条从 §8.2 落地，均**复用仓库判据、零重写**：

| 功能 | 命令 | 实现要点 | 实测读数 |
|---|---|---|---|
| 按话题加规则 | `/mc-skill topic <词...>` / `topic` / `topic clear` | 话题存 `WeakMap<session, string[]>`（不投影、不进会话日志）；合并逻辑走 `resolveTopicIds`；section 的 text 每次 assemble 按当前话题重算 | `gui` → 32458→38334 B；`gui 02 03` → 54406 B；`mixin` 额外给 `skillHints=mc-mixin`；`bogus` 不登记并点名 |
| 临时追加单条规则 | `/mc-skill rule <NN\|名字\|all>` | `agent.inject({content:[{type:"text",text}], source:{kind:"mc-skill",form:"rule-append"}})`；不唤醒驱动器 | `rule 10` 注入 6145 B；`rule 02-block` 注入 6996 B；`rule all` 11 条；非法号返回 error 并列出可用 |

**两条设计取舍**：

1. **话题不落会话日志**。用 `WeakMap` 而不是 `ctx.sessionProjections`：topics 是临时状态，投影要求 `stateSchema` + 事件 + 迁移，代价远大于收益；session 被回收时 WeakMap 自动释放，插件不持有生命周期。
2. **`rule` 不改常驻段**。走 `agent.inject` 而不是往 topics 里塞：临时要看某条规则不该污染整轮对话的 system prompt（后者每个请求都重复计费）。`inject` 的语义正是「落下个被接纳的步骤、不唤醒驱动器」。

**未做**：§8.2 的 3–8 项仍未动（`doc` 检索那条仍标未核实）。
