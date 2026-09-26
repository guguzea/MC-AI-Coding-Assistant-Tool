# 外部映射 / MCP 工具对照（@hexben/mcmap · Linkie）与能力吸收台账

本文件是**登记面**，不是背景资料：§3 每一行的状态、§4 每一条未做，做完都必须回写本文件并在 `CHANGELOG.md` 记一笔。

**为什么要把它写成文件（2026-09-24）**：2026-09-21 那次优缺点审计**从未落盘** —— 全仓能查到的痕迹只剩两处代码注释（`src/upstream/releases.ts:4`、`src/tool-registry.ts:373`）加 CHANGELOG/README 的顺带提及，剩下的只在会话记忆里。结果是这张吸收台账在后续两轮排产里**从登记面上掉出去过一次**（09-24 合并待做清单时只写进了一行 `resource_link`）。本文件就是补那个洞。

**口径声明**：下文每个数字都带**分母 + 口径 + as-of**。§1 与 §3 的外部侧数字是 **2026-09-24 对 `G:\MCP_USE/` 的实跑复测**（不是 09-21 的旧数）；我们侧的数字同样是当天现测。§6 给了每条的复算命令。

---

## 1. 材料位置与许可（2026-09-24 复测）

对照材料在 **`G:\MCP_USE/`**（2026-09-21 按用户指令克隆）：`mcmap/`、`linkie-core/`、`linkie-discord/`。再问「能不能复用它们的代码」时**先读本节**，不要重新克隆重推。

| 事实 | 实测口径（as-of 2026-09-24） |
| --- | --- |
| **许可从来不是障碍** | `mcmap/package/package.json` → `"license": "ISC"`；`linkie-core/LICENSE.md` 首两行 → `Apache License`（=2.0）。⇒ 署名 / 变更声明即可 |
| **但 mcmap 拿不回源码** | `G:\MCP_USE\mcmap` **无 `.git`**，只有 npm tarball；`package.json` 的 `files` = `["dist","README.md","package.json"]`（**不含 `src`**）。`dist/**` 下 **25 个 `.map`**，键集合只有 `version,file,sourceRoot,sources,names,mappings` ⇒ **`sourcesContent` 这个键根本不存在**（0/25），只有行映射、没有原文。它泄露的是**模块树**（`parsers/{mcpCsv,mojang,srg,tiny,tsrg}`、`sources/{fabric,legacyFabric,loaders,mcp,mojang,parchment,quilt}`、`utils/{cache,csv,maven,versions,zip}`），可当架构蓝图，不可当源码 |
| **Linkie 是 Kotlin/JVM，进程模型不兼容** | `linkie-core/build.gradle` 用 Kotlin JVM 插件 `1.7.10`；同文件逐字出现的依赖族名：`tiny-remapper`、`stitch`、`mappings-hasher`、`quiltflower`、`Tiny-Mappings-Parser`、`korio`（`:53`）、`okio`、`guava`、`dom4j`、`logback`。⇒ Node 侧要用就得常驻 fork JVM + 让 Gradle 拉 jar |
| **结论** | **复用它们的表与判据，不复用进程与构建产物。** |

## 2. 网络边界（移植时的硬规矩，不是建议）

mcmap 全程用 Node `fetch`。**本机不行**：Node 的 TLS 链对 `raw.githubusercontent` / `api.github.com` 一律失败（`UNABLE_TO_VERIFY_LEAF_SIGNATURE`），同 URL 走 `curl.exe --ssl-no-revoke` 才拿 200（通道矩阵见 `mcp-server/README.md`「工具与网络边界」）。

⇒ 任何从外部工具移植来的联网能力**必须**带 curl 退避腿，**永远不要改系统证书库或代理**（那是全局副作用，且不是本仓能修的问题）。已落地的样板就是本仓自己这份：`src/upstream/releases.ts:178 getViaFetch` + `:189 getViaCurl`，两腿都失败才报取不到（`:287`）。

## 3. 吸收台账（八分项）

| # | 分项 | 来源判定 | 现状（2026-09-24 实测） |
| --- | --- | --- | --- |
| ① | **上游实时可用性查询** | 「三个工具的共同强项，唯一被点名值得吸收的能力」 | ✅ **已吸收**。`query_upstream_releases`：**10 个源**（A4c 前 7 源 `forge`/`neoforge`/`fabric-loader`/`fabric-yarn`/`quilt-loader`/`parchment`/`modrinth` + A4c 三新源 `legacyfabric-loader`/`mojang-manifest`/`maven`；枚举真值源 = `src/upstream/releases.ts:42-43`，2026-09-25 现核）· 主机白名单写死在 `releases.ts`（**端点/主机计数不在此行重抄，唯一真值源 = ② 行**；2026-09-25 更正：旧写「7 个源 · 7 条端点」是 A4c 之前的快照，与 ② 行 17 主机自相矛盾——17:28 那次编辑漏改的两处之一） · `slug` 一类入参先过形状校验再拼 URL（防 SSRF）· 三态语义（`ok:false` 取不到 ≠ `available:false` 上游没有） |
| ② | **端点清单** | 「mcmap 真正值钱的是这张表（事实，不是实现）」 | ✅ **已吸收（A4c，2026-09-24 用户裁定「全补 8+3」）**：mcmap 表的 **16/16 主机全部接进工具面**；我们侧上游白名单合计 **17 个主机**（口径 = `MAVEN_HOST_ALIASES` 的 12 个 host ⊕ `UPSTREAM_ENDPOINTS` 的 9 个 host，去重后 **17** —— 多出来的那个是 `meta.quiltmc.org`，**mcmap 表里没有它**：我们查 quilt loader，它查 quilt maven）。逐主机实测见 §4 A4c（复算命令见 §6）。⚠️ 「接进工具面」≠「每个主机都有已证正值」：`progwml6` 仍是**正值未证**（其 `available:false` 只证伪该坐标），`source=maven` 的 404 语义也已收窄（见 §4 A4c 的「404 语义」）。以下留同日早些时候的差集记录：mcmap `dist/**` 实含 **28 条唯一 URL / 16 个主机**；我们的工具面覆盖其中 **5 个主机**（`maven.minecraftforge.net`、`maven.neoforged.net`、`meta.fabricmc.net`、`maven.parchmentmc.org`、`api.modrinth.com`）。另有 3 个主机**我们代码里用过但没接进工具面**：`maven.fabricmc.net`（`resources.ts`/`yarn.ts`/`index.ts`）、`piston-meta.mojang.com`（`decompile/downloaders/mojang.ts:10`，MC 版本清单）、`maven.shedaniel.me`（库坐标）。**完全 0 命中 8 个**：`maven.legacyfabric.net`、`meta.legacyfabric.net`、`maven.quiltmc.org`、`modmaven.dev`、`maven.terraformersmc.com`、`maven.blamejared.com`、`maven.architectury.dev`、`dvs1.progwml6.com`。（我们的第 6 个主机 `meta.quiltmc.org` 不在它的清单里 —— 我们查 quilt loader，它查 quilt maven。）→ **A4c 已落地** |
| ③ | **分层输出（`outputSchema`）** | 「mcmap **每个工具**都声明 `outputSchema`，默认 `format:"compact"`」 | ❌ **1 / 82**。`src/tool-registry.ts` 内 `outputSchema:` 出现 **1** 次（挂在 `query_upstream_releases`，即「仓库首个」那条；行号 2026-09-25 现核 = `:1146`——并行会话当天在同文件加 `refresh` 后已 `:1070`→`:1082`→`:1146` 两连漂，引用一律按「`outputSchema:` + `queryUpstreamReleasesOutputSchema`」内容锚定位，行号只作 as-of）；`structuredContent` 3 处都在通用信封里、非按工具声明；CLI 侧的 `--compact`（`src/cli-parse.ts:20/:58`）是**呈现层 flag，不是工具入参 `format`**。→ **A4b：暂不铺**（2026-09-24 用户裁定，触发条件见 §4） |
| ④ | **`resource_link` 按需取全文** | 同上（compact + link 是一套） | ❌ **0 命中**（`src/` 全树）＝ 未改形状。→ **A4a：只探测不改形状**（2026-09-24 用户裁定；探测结论与「会打断谁」见 §4） |
| ⑤ | 不引入它们的映射库 | 用户裁定 | ✅ **按裁定不做**（`releases.ts:6` 明文「这里只补这一项能力，不引入它们的映射库」）⇒ 关闭，**不是欠账** |
| ⑥ | 必须走 curl 腿 / 不碰系统证书库 | 用户裁定 | ✅ 已落地（见 §2） |
| ⑦ | **Linkie 的 namespace 宽度** | 「吸收建议只做**拒绝文案 + 指路**，不建语料」 | ❌ **0 命中**：`src/` 内 grep `Barn` / `LegacyYarn` / `QuiltMappings` = 0 ⇒ `convert_mapping` 遇到 legacy 面不会指路。Linkie 侧覆盖 `Barn`/`Feather`/`Plasma`/`LegacyYarn`/`Yarrn`/`QuiltMappings`/`Mojang{,Raw,Hashed,Srg}`/`MCP`/`Yarn`（Discord 侧另支持 Spigot 1.8.9、Beta 1.7.3）—— 这一条当年是**建议、未见裁定记录**，故排在 B 组等点头。→ **A4d** |
| ⑧ | `.map` 泄露的模块树当架构蓝图 | 观察项 | ➖ 未采纳亦未拒绝，无记录（要参考再说，不欠做） |

## 4. 未做清单（承接 §3）

### A4a — `resource_link`：**只探测，不改形状**（2026-09-24 用户裁定）

**裁定**：先产出「宿主是否支持 resources」的探测结论与文档，**零载荷变更**；探测必须带一条「会打断谁」清单。

**探测结论（2026-09-24 实测）**：

| 面 | 实测 | 口径 |
| --- | --- | --- |
| 协议层能不能判 | ✅ 能。SDK `Server.getClientCapabilities(): ClientCapabilities \| undefined`（`node_modules/@modelcontextprotocol/sdk/dist/esm/server/index.d.ts:121`）；`ClientCapabilities.resources?` 存在于 `spec.types.d.ts:283/:395` | ⇒ 「宿主是否支持 resources」**可在注册层判**，不必靠猜 |
| 我们有没有可被 link 的落点 | ✅ 有。`src/wave/register.ts:918-939` 对 `listKnowledgeResources()` 逐个 `server.registerResource(name, uri, …)`（跳过 `mcskill://workflow/` 与 `mcskill://community/`）⇒ `mcskill://…` 的 `resources/read` 是通的 | 反过来说：没注册过 resources 的工具（绝大多数）**没有**可 link 的 URI |
| 零载荷变更 | ✅ 本轮未改任何载荷（`src/` 内 `resource_link` 仍 0 命中） | 与 §3④ 一致 |

**会打断谁（`content[0]` / `result` 键面消费者，2026-09-24 现扫）**：

- 生产侧：`src/cli.ts:438` / `:442`（`unwrapHandlerResult` 读 `content[0].text`）、`:910`；`src/docs-platform/quilt-search.ts:188`（递归解析 `inner.content[0].text`）；`src/tool-registry.ts:247`（outputSchema 注释）。
- 测试侧（按 `content[0]` 或 `.result?.` 断言的文件与处数）：`test-cli.mjs` **48**、`test-mcp.mjs` **27**、`test-assistant-gaps.mjs` **13**、`test-semantic.mjs` **3**、`test-cli-parse.mjs` **2**、`test-core.mjs` **2**；`scripts/assert-cli-*.mjs` 本口径 **0**。
- ⇒ 真要做的那天，这 6 个套件 + 3 个生产点是必须逐条过的兼容扫描面（不是「扫一眼」）。

**触发条件（未满足就不做）**：① 目标宿主用 `getClientCapabilities().resources` 明确表态支持；② 要走 link 的工具先自己注册对应 resource（否则 link 是悬空的）；③ 上面那批断言全部过（含 CLI 的 `--raw`/信封路径）。

**落地（2026-09-25，N0）**：探针已挂 `src/tool-registry.ts`（工具回显面一行：`clientCapabilities: server.server.getClientCapabilities?.() ?? null`，无宿主会话时为 `null`）——只回显、仍零载荷变更；防丢钉 = `test-scripts.mjs` #18（dist 含探针 + src 恰 1 处）。宿主实测仍欠：等一个真宿主会话回读该字段。

### A4b — `outputSchema` 铺开：**暂不铺**（2026-09-24 用户裁定）

**裁定**：保持 **1/82**（仅 `query_upstream_releases`），等**宿主对 `structuredContent` 的消费行为明确**后再定。

**触发条件**：拿到宿主「会读 `structuredContent` 而非只读 `text`」的实测证据（或明确不读 ⇒ 铺了也无收益）后，再按族分批（检索 / 生成 / 校验 / 反编译 / 基岩），每批配 selftest 与 `assert-cli-*` 信封回归。

### A4c — 端点表补齐 + 把已在用的接进工具面：**已落地**（2026-09-24 用户裁定「全补 8+3」）

**落点**：`src/upstream/releases.ts`（源 + 别名表 + 白名单 + 解析）· `src/tool-registry.ts`（input/output schema 枚举 + 描述）· `test-scripts.mjs` #18（+4 组离线判据）。

**新增三源**：`legacyfabric-loader`（过滤走 `?game_version=`；`/<mc>` 路径实测 **400**）· `mojang-manifest`（官方 `version_manifest_v2`；`type` 逐字进 `versionType`）· `maven`（`slug=<alias>:<group>/<artifact>`；**12 条写死别名**，别名表见 `MAVEN_HOST_ALIASES`）。

**逐主机实测（2026-09-24，CLI 真跑；`ok/avail/total`）**：

| 主机（mcmap 表） | 入口 | 存在的 artifact（实得） | 「上游确实没有」正对照 |
| --- | --- | --- | --- |
| maven.fabricmc.net | `fabric:net/fabricmc/yarn` | ok · 3412 | `fabric:net/fabricmc/definitely-not-a-real-artifact` → ok + **available:false** |
| maven.legacyfabric.net | `legacyfabric:net/legacyfabric/yarn` | ok · 1069（**302 → repo.legacyfabric.net**，已登记落点） | 见下（同法可复现） |
| maven.quiltmc.org | `quilt:org/quiltmc/quilt-mappings` | ok · 712 | — |
| maven.terraformersmc.com | `terraformers:com/terraformersmc/modmenu` | ok · 202 | — |
| maven.blamejared.com | `blamejared:mezz/jei/jei-1.20.1-forge` | ok · 206 | — |
| maven.architectury.dev | `architectury:dev/architectury/architectury` | ok · 348 | — |
| maven.shedaniel.me | `shedaniel:me/shedaniel/cloth/cloth-config-fabric`（**现役**坐标，实测 200） | ok | 老构件 `me/shedaniel/ClothConfig`（latest **0.3.3**）**只作机制证据，不得当「Cloth 版本可用性」的答案** —— 那个坐标回答不了现役 Cloth 的版本面 |
| dvs1.progwml6.com | **白名单在册、正值未证**（`mezz/jei`、`mezz/jei/jei`、`mezz/jei/jei-1.20.1-forge` 与父路径各写法实测全 404） | — | ok + **available:false** ✓（**只证伪该坐标**，不证「该主机没有 JEI」） |
| modmaven.dev | `modmaven:mezz/jei/jei-1.20.1-forge`（实测 200，本轮补证） | ok | `modmaven:net/minecraftforge/forge` → ok + **available:false** ✓ |
| meta.legacyfabric.net | `legacyfabric-loader --minecraftVersion=1.20.1` | ok · 72 | — |
| piston-meta.mojang.com | `mojang-manifest --minecraftVersion=1.21.1` | ok · 1（`versionType=release`） | `--minecraftVersion=9.9.9` → ok + **available:false** ✓ |
| 已覆盖对照（既有源） | `forge:net/minecraftforge/forge` 5050 · `neoforged:net/neoforged/neoforge` 1723 · `parchment:org/parchmentmc/data/parchment-1.20.1` 35 | — | — |

**404 语义（口径洞，2026-09-24 用户回报后补）**：`source=maven` 的 404 **只说明「该坐标没有 maven-metadata.xml」**，
分不清「构件不存在」与「group/artifact 写法不对」（maven 按路径寻址，层级与大小写都得逐字对 —— 实测
`progwml6:mezz/jei`、`progwml6:mezz/jei/jei`、`progwml6:mezz/jei/jei-1.20.1-forge` 与 `modmaven:` 三种写法**全 404**）。
⇒ 三态承诺（`ok:true + available:false` ⇒ 上游确实没有）在 maven 源上**收窄为「该坐标没有 metadata」**：
`notFoundPayload()` 只给 maven 的 404 附 `hint`（“404 只证明…”，并把出口指向按 slug 查的 `source=modrinth` 或
该仓库父目录索引），其余源形状不变；`test-scripts.mjs` #18 有一条**离线** selftest 腿钉住（hint 不得替「上游确实没有」背书）。
⚠️ 连带口径：本表里 `modmaven` / `progwml6` 两个主机的行不能用「—」读成「没东西」——前者已补正值，
后者是**白名单在册、正值未证**，它的 `available:false` **只证伪被查的那个坐标**。

**两条实测发现（已修，值钱的就在这里）**：
1. `maven.legacyfabric.net` **302 到自家新域名 `repo.legacyfabric.net`** ⇒ 不登记落点就被 `URL_REJECTED` 挡下；按 parchment→`ldtteam.jfrog.io` 同法显式登记（落点不得反向放宽入口）。
2. maven 坐标里**确有驼峰 artifact**（`ClothConfig` / `RoughlyEnoughItems`）⇒ 坐标段必须允许大写；别名仍只收小写，`..` / 空段 / 查询串一律拒。

### A4d — Linkie namespace 的拒绝文案 + 指路
属内容决策（会给用户念外部工具名与能力面），**等用户点头**再做。

### A4e — 台账不再掉出去
本文件即 A4e 的产物。后续任何「外部工具对照」类审计**必须**当场落进本文件或同目录文档，不接受只写进会话回报。

### A4f — 给外部审稿人的落点（2026-09-25，按「他自己会先打开哪里」排）

| 优先级 | 落点 | 要他回答的问题（口径已在本轮实测） |
| --- | --- | --- |
| P0 | `src/upstream/cache.ts`（S4′，新） | ~~① 没有原子写~~ **本轮已自修并钉住**（`writeFileSync(tmp)` + `renameSync`，失败路径 `rmSync` 自己的 tmp；判据 = 同键二次写入 `birthtimeMs` 必须前移 + rename 失败夹具，投毒 B/D 各红一处，见 CHANGELOG「自审补丁」）。**仍请他看的**：② `isResolvedInside(repoRoot, dir)` 挡不挡符号链接 / `..`。③ `available:false` 只存 2 小时会不会被「429 伪装成空列表」骗进短档（现走 `ok:false` 不缓存，请他核这条路是否封闭）。④ `ageUpstreamCacheEntry` 仍直写（门专用助手）—— 若哪天被生产路径复用就是原子性缺口 |
| P0 | `src/mappings/access-lines.ts`（S2，326 行，新） | ~~① `SRG_SHAPE_RE` 过松~~ **本轮已自修并钉住**（收成 `^(?:func_\d+_[A-Za-z0-9_$]*\|field_\d+_[A-Za-z0-9_$]*\|[mf]_\d+_)$`，近失名 `m_5_foo` 退回 `<TODO:SRG名>`；投毒 A 红在「不得当成合法名写进行里」）。**仍请他看的**：① `descriptor_named` 回落（用户没传 descriptor 时取库里的 named 层）：fabric 档 named 是 Yarn 包名，mojmap 工程照抄就编译不过，我只给了一句 note，够不够。② `complete:false` 的行**不做自检**；若哪天占位符被替换而 `complete` 没跟着改，坏行会带着 `selfCheckOk:true` 出去。③ 三套名字层（Forge SRG / NeoForge 可读 / AW 工程层）有没有漏第四种档 |
| P1 | `src/mixin/access-widener.ts` | ~~`inject-interface` 仍被判「未知 AW 类型」~~ **已修（#55，2026-09-25 第二批）**：解析器现认五族指令 + `classTweaker v1/v2` 头 + 两操作数 arity/泛型尖括号/`extend-enum` 需 v2/多段文件头继承/冲突分组键补 `operand`（判据 = 上游参考工程整份 0 error）。**仍请他看的**：① 生成侧未做（`convert_mapping` 要新增「注入哪个接口」入参才吐得出 `inject-interface` 行）；② 「被注入接口的方法必须全是 default」这条**本工具无法核**（接口是用户自己的类，不在客户端 jar 里，出处 `interface-injection.md:38`），要不要给一条「请自备 jar 走 `ingest_loader_api`」的引导；③ 泛型只校尖括号配对、不校签名内部结构（表在 `:82-95`），是否值得补全 |
| P1 | `src/cli.ts` 的 `zodIssueToFieldError`（S6-②） | 码映射只显式列 3 个 case + 兜底大写，`too_small` / `custom` / 未来自定义 issue 会产什么码；`received` 原样回显用户输入进 JSON 信封算不算泄露面；「缺必填 = `invalid_type` + `received:"undefined"`」这条折叠依赖 zod 版本 |
| P1 | `src/tool-registry.ts`（1400 行 / 82 工具注册） | 结构问题（非本轮引入）：单文件承载注册 + 描述 + handler，且是**行号锚靶子** —— A-27 的 `isError:585` 本轮被我两次增行从 527→565→585 推走，全靠门当场点名。B8 待裁定：锚改成代码片段 needle、行号只报告 |
| P2 | `src/mappings/yarn-sqlite.ts:131-155` | 库选择 = fabric 先、forge 兜底，而 `convert_mapping` **没有 platform 参数** ⇒ 双平台同版本号天然歧义（实测 1.20.1 走 yarn-tiny 库、`to=mcp` 被拒）；要不要在参数面解决 |
| P2 | `src/generators/common.ts` 的 `generatorRejectionAction` | 兜底 `GENERATION_FAILED` 的「未判定 ≤ 4」棘轮（S6-① 门）会不会被文案改动静默放宽 |
| P2 | `scripts/assert-index-consistency.mjs`、`scripts/assert-script-write-guard.mjs` | 存量豁免 / 债务台账（`DEBT_MAPPING_COUNT`、待收口债务 41 项）是否在越改越宽 |

**复现三条**（本仓口径：`npm test` 是唯一全脸 62 腿；`test-scripts.mjs` 绿 ≠ 全链绿）：

```bash
cd mcp-server && npm ci && npm run build
node test-scripts.mjs                        # 第 8 步收口（AGENTS.md 强制）
node test-core.mjs && node test-wave-bcd.mjs # 工具面数 82 / A-27 合同
```

**给他两条前置警告**：① 不要改 `data/**` 的上游逐字正文（本仓裁定 = 只排除 + 留痕，见 [[project-corpus-not-patched]]）；② 在 `src/tool-registry.ts` 上方增行会推走 A-27 行号锚，`ok:false` 字样出现在 `src/**` 注释里也会动 A-27 的处数台账（本轮实测 328/51 → 331/52）。


### S 批（2026-09-25）—— §3 之外另立的「两家强项」清单，逐条现状

来源：用户裁定「不用等 N0」「S1 挂在被降级的兼容工具 `query_api` 上；开始完成」「S1 完成后继续完成 S2–S6」。

| 分项（Linkie / mcmap 侧能力） | 现状（2026-09-25 实测） |
| --- | --- |
| **S1 名字级模糊 / 成员检索** | ✅ **S1′ 已落地**（挂在 `query_api`，不开新工具）：`nameIndex` 第二档出处 + 三句披露，见 CHANGELOG 同名条 |
| **S2 AT / AW / Mixin 条目行生成**（Linkie 每个类页都给 access widener entries；本仓语料 `develop_class-tweakers_access-widening.md:166` 就点名了这个能力） | ➗ **AT + AW 已落地**（`convert_mapping` 的 `accessLines`，见 CHANGELOG **S2 + S3** 条）。**Mixin 目标行未做**：本仓 fabric 语料 `@Mixin(` / `targets = "` 逐字 **0 命中**（实测 1.21.11 + 1.20.4 docs 全量 grep），不凭记忆补格式。AW `inject-interface` 条目也未做（解析器只认三 directive） |
| **S3 批量翻译**（Linkie 有批量接口） | ✅ **已落地**：`memberName` 逗号/分号/换行 ≤50，`results[]` + `batch{requested,found,missing}`；超上限 `INVALID_INPUT` 不静默截断 |
| **S4 mcmap 的分层磁盘缓存（TTL 分级）** | ✅ **S4′ 已落地**（2026-09-25）：`src/upstream/cache.ts` + `queryUpstreamReleases` 变 wrapper。档位 `available:true`=6 h / `available:false`=**2 h**（证否会被新版本推翻，禁止同档）/ `ok:false`（没查到）**不缓存**；缓存根只许 `$MC_SKILL_CACHE/upstream-cache/`，解析进仓库 ⇒ 拒写；键含 `source`/`minecraftVersion`/`slug`/`limit`；响应带 `cache{hit,tier,ttlMs,ageMs?,wrote?,note?}`，`refresh=true` 回源、`MC_SKILL_UPSTREAM_CACHE=0` 关掉；该工具唯一的 `outputSchema` 同步声明了 `cache` 位。端到端实测（真打上游）`fabric-loader@1.21.1` 首发 `wrote:true total:253`、次发 `hit:true ageMs:985` 且 `releases` 逐条相同；`fabric-yarn@9.9.9` 与 modrinth 无此 slug 都落 `absent/7200000`。门不联网（`test-core` 现测 **35** 条断言行只测缓存层：键差异 / 档位 / 读写往返 / 到期必 miss / `ok:false` 拒写 / **原子写 5 条**（同键二次写 `birthtimeMs` 必前移 + 内容必换新）/ **rename 失败夹具 3 条**（须 `wrote:false` + 念原因 + 不留 `.tmp-`）/ 半截文件读法 3 条 / 仓库内根拒写 / 开关关档）+ **差分对照**一条（仓库外根必须放行，否则「守卫」= 恒拒）；投毒 **7/7** 各红在该当原因（R1–R4 见 CHANGELOG S4′ 条；B 撤 tmp+rename → 红在 birthtime；C 坏文件当命中 → 红在「坏数据卖成事实」；D 失败不清 tmp → 红在残留检查）；R5 缓存根守卫**未用 dist 投毒**（dist 注入法证不到它）⇒ 改用差分对照，别写成已投毒 |
| **S5 库坐标 × maven-metadata 互证**（shedaniel 那条） | ⏳ **未做**（S5′ 收窄版：维护侧 opt-in 脚本 + 离线快照给门比对；**不得**做成默认联网门） |
| **S6 拒绝文案的机读位** | ✅ **S6-① + S6-② 已落地**。① 棘轮门 `mcp-server/scripts/assert-generator-rejection-codes.mjs`（实测 `位点 59 · 判定 55 · 未判定 4（地板 4）` rc=0，selftest 12 例 rc=0），**已由并发会话挂进 `test-scripts.mjs` 两条数组**（`:2058` 真跑 / `:2120` selftest）。② CLI 的 schema 层拒绝不再只有一整条中文串：`errorKind:"validation"` 的信封加 `fieldErrors[]`（`{field,code,message,expected,received,enumValues?}`；缺必填由 zod 的 `invalid_type`+`received:"undefined"` 折成 `MISSING_REQUIRED`，枚举违规带 `enumValues`），散文 `error` 原样保留（实测 `generate_datagen --providerType=nope` → 3 条：providerType/modId/targetName）。钉子 = `test-cli.mjs` 的 s6-field-errors 腿，**两腿投毒各红在该当处**（摘 `fieldErrors` 赋值 / 把 `received === "undefined"` 改成 `"never"`）。**S6-③ 仍待裁定**：`generate_lang --entries={}` 返回 `success:true` 是边界还是缺陷 |
| **S7 Linkie 的 tricks / eval / 覆盖队列** | ➖ §5 之外新增的「未见裁定」项，本轮未提出也未做 |

## 5. 明确不吸收（防被重新提出）

1. **它们的映射库 / 转换表**（⑤，用户裁定）。
2. **JVM 进程模型与 Gradle 构建产物**（§1：常驻 fork + Gradle 拉 jar，收益不抵成本）。
3. **mcmap 的 `dist` 代码路径**（无源码可复核，`sourcesContent` 键不存在）。
4. **Linkie 的 legacy namespace 语料**（pre-1.13 / 服务端插件市场，本仓完全没碰；只做指路，不建语料）。

## 6. 复算方法（每条数字的命令原文）

```bash
# §1 许可与打包
grep -o '"license"[^,]*' /g/MCP_USE/mcmap/package/package.json
head -2 /g/MCP_USE/linkie-core/LICENSE.md
grep -A4 '"files"' /g/MCP_USE/mcmap/package/package.json
ls -d /g/MCP_USE/mcmap/.git            # 期望：不存在

# §1 .map 的 sourcesContent 键（期望 25 / 0 / 0）
node <scratch>/probe-mcmap-map.mjs     # walk dist/**，JSON.parse 后判 'sourcesContent' in obj

# §1 Linkie 依赖族名
grep -oiE "(tiny-remapper|stitch|mappings-hasher|quiltflower|Tiny-Mappings-Parser|korio|okio|guava|dom4j|logback)" /g/MCP_USE/linkie-core/build.gradle

# §3②③④⑦ 我们侧计数（在仓库根跑）
grep -rhoE "https?://[A-Za-z0-9._~:/?%@+-]+" /g/MCP_USE/mcmap/package/dist | sort -u | wc -l
grep -c "outputSchema:" mcp-server/src/tool-registry.ts
grep -rn "resource_link\|resourceLink" mcp-server/src/ | wc -l
grep -rn "Barn\|LegacyYarn\|QuiltMappings" mcp-server/src/ | wc -l
node mcp-server/dist/cli.js list-tools --output-format json   # 工具总数；注意键是 parameters，不是 inputSchema
# §3② 主机分母（期望 17 = 12 alias hosts ⊕ 9 endpoint hosts 去重）
node -e "import('./mcp-server/dist/upstream/releases.js').then(m=>{const a=new Set(Object.values(m.MAVEN_HOST_ALIASES).map(x=>x.host));const e=new Set(Object.values(m.UPSTREAM_ENDPOINTS).map(x=>x.host));const u=new Set([...a,...e]);console.log('alias='+a.size,'endpoint='+e.size,'union='+u.size,[...u].sort().join(' '))})"

# §3② / §4 A4c（2026-09-24）：逐主机实测 + 「上游确实没有」正对照（认 ok:true + available:false 三态）
node mcp-server/dist/cli.js query_upstream_releases --source=maven --slug=fabric:net/fabricmc/yarn --output-format=json
node mcp-server/dist/cli.js query_upstream_releases --source=maven --slug=legacyfabric:net/legacyfabric/yarn --output-format=json       # 期望 redirectedTo=repo.legacyfabric.net
node mcp-server/dist/cli.js query_upstream_releases --source=maven --slug=shedaniel:me/shedaniel/ClothConfig --output-format=json      # 驼峰 artifact 必须放行
node mcp-server/dist/cli.js query_upstream_releases --source=maven --slug=modmaven:net/minecraftforge/forge --output-format=json       # 正对照
node mcp-server/dist/cli.js query_upstream_releases --source=maven --slug=progwml6:mezz/jei --output-format=json                       # 正对照
node mcp-server/dist/cli.js query_upstream_releases --source=legacyfabric-loader --minecraftVersion=1.20.1 --output-format=json
node mcp-server/dist/cli.js query_upstream_releases --source=mojang-manifest --minecraftVersion=1.21.1 --output-format=json           # versionType=release
node mcp-server/dist/cli.js query_upstream_releases --source=mojang-manifest --minecraftVersion=9.9.9 --output-format=json            # 正对照

# §4 A4a：探测（宿主能力面 + 会打断谁）
grep -n "getClientCapabilities" mcp-server/node_modules/@modelcontextprotocol/sdk/dist/esm/server/index.d.ts
grep -rn "registerResource" mcp-server/src/ | wc -l          # 期望 1（wave/register.ts 的资源循环）
grep -c "content\[0\]\|\.result?\." mcp-server/test-cli.mjs mcp-server/test-mcp.mjs   # 48 / 27（本文件 §4 A4a 清单的口径）

# S 批（09-25）：映射库覆盖普查 —— 判「哪个版本的 AT/AW 能完整成行」的唯一口径（在仓库根跑）
for f in data/*_*/mappings/yarn-mappings.sqlite; do printf '%s  ' "$f"; node --no-warnings -e '
const { DatabaseSync } = require("node:sqlite");
let db; try { db = new DatabaseSync(process.argv[1], { readOnly: true }); } catch (e) { console.log("OPEN FAIL", e.message); process.exit(0); }
const q = (s) => { try { return db.prepare(s).get() ?? {}; } catch { return {}; } };
console.log("era=" + (q("SELECT value v FROM meta WHERE key=\u0027mappingEra\u0027").v ?? "?"),
  "methods=" + (q("SELECT COUNT(*) c FROM methods").c ?? -1),
  "func_*=" + (q("SELECT COUNT(*) c FROM methods WHERE name_named GLOB \u0027func_*_*\u0027").c ?? -1),
  "m_*=" + (q("SELECT COUNT(*) c FROM methods WHERE name_named GLOB \u0027m_*_*\u0027").c ?? -1));
db.close();' "$f"; done
# 本轮实扫结论：fabric 13 档有库（26.1.2 NO FILE，era 全 yarn-tiny）；forge 7 档有库（6 档 forge-srg + 1.13.2 tsrg）
# + 1.14.4/1.15.2 mcp-csv 但 methods=0；forge 1.16.5–1.20.4 与全部 neoforge_*/quilt_* = NO FILE。
# 读法：某档**不在输出里** = 库文件不存在（glob 就抓不到）；存在但读不动会印 OPEN FAIL —— 两者不是一回事，别合并记账。
# ⇒ 1.17+ 形如 m_/f_ 的 SRG 名本仓任何库都没有（实测各档 m_* 全 0）。
# ⚠️ 上面两行结论 **2026-09-26 起作废**（未做③ 已落地）：1.16.5 / 1.17.1 / 1.18.2 / 1.19.4 / 1.20.1 / 1.20.4
#    六档现有 `era=mcp-config-srg` 的库。成员行数（本轮逐档实扫表内，非 meta 自述）：
#      1.16.5 = func_ 35,526 + field_ 19,841（老形状）· 1.17.1 = 40,443/25,986 · 1.18.2 = 42,102/27,498
#      1.19.4 = 47,973/31,695 · 1.20.1 = 48,575/32,079 · 1.20.4 = 50,945/34,616（1.17+ 为 m_/f_ 哈希形状）。
#    复现命令（默认 DRYRUN，只打印落点）：node mcp-server/scripts/ingest-forge-srg.mjs
#    再 node mcp-server/scripts/_lib/build-yarn-sqlite.mjs --dir=data/forge_<v>/mappings --write
#    判据与投毒：node mcp-server/scripts/assert-forge-srg-ingest.mjs [--selftest]（夹具腿，任何克隆都真跑）
#    forge 1.16.5 与全部 neoforge_*/quilt_* 仍然 NO FILE ⇒ 那几档 AT 成员行照旧 `<TODO:SRG名>`。
# 缺陷复现（classTweaker 头）：
node mcp-server/dist/cli.js validate_aw --version=1.21.11 --awContent="classTweaker v1 named$(printf '\n')$(printf '\n')accessible    class    net/minecraft/network/chat/TextColor"
#   修前：5 条 errors + valid:false + checkedMembers:0；修后：valid:true + checkedMembers:2
grep -n "^classTweaker v1 named" data/fabric_1.21.11/reference/1.21.11/src/main/resources/example-mod.classtweaker   # :1
grep -n "SRG name must be used" data/forge_1.20.1/forge-docs/1.20.1/processed/advanced_accesstransformers.md         # :55
grep -n "makeExecutor(Ljava" data/neoforge_1.21.1/neoforge-docs/1.21.1/processed/advanced_accesstransformers.md      # :191
```

> ⚠️ **S 批踩过的两个探针坑**：① 用 `require('node:sqlite')` 直查库时，`GLOB 'method_*'` 之类模式里的 `_` 是**单字符通配**不是字面量，别拿它当「以 `method_` 开头」的严格判据（本轮 `name_named GLOB 'func_*_*'` 特意补了第二个 `_` 才把前缀钉住）；② Forge 侧「有没有库」只能按 `data/forge_<ver>/mappings/yarn-mappings.sqlite` **能不能打开**判，`existsSync` 为真但 `unable to open database file`（OneDrive 占位）是两种不同的空洞，别合并成一档记账。

> ⚠️ 复算 `list-tools` 时踩过一次**空洞探针**：按 `t.inputSchema.properties` 取参数面会得到全空（真实键名是 `t.parameters`），于是「谁带 limit」被误判成「谁都不带」。判据面一律先用一个**已知为正**的工具做对照。

## 7. 与其他登记面的关系

- `src/upstream/releases.ts:1-14`（头注释）与 `src/tool-registry.ts` 的 `QUERY_UPSTREAM_RELEASES_DESC` 是本文件 §3①② 的代码侧留痕；两边任一处口径变了要同步另一处（**按符号找，不按行号** —— 本文件里的行号都是 as-of 值）。
- 待做总表：本轮会话另有一份合并清单（`temp/sidechat-reprocess-20260924/TODO-MASTER-20260924.md`，在 `temp/` ⇒ 会被清理，**不要把它当长期引用目标**）。本文件才是长期账；§4 的四条与那份清单同编号，便于对读。
- 项目记忆 `reference-mc-mapping-tools` 是本文件 §1 的会话侧副本，两者不一致时**以本文件与盘上实测为准**。

---

### A4g — 2026-09-25 复核：两家**都不存表** + `legacy-yarn` 上游实测（用户再问「要不要借鉴」）

**缘起**：用户 2026-09-25「@hexben/mcmap 与 Linkie 好像有完整的跨平台映射表，要不要借鉴」。按 A4e 当场落盘；本轮**零载荷 / 零数据变更**，只加证据与两条待裁项。

**证据（材料 = `D:\mc-skill-temp\mapping-repos\`（Linkie 源码镜像）· `mcmap-pkg\pkg.tgz`（解包复核）· 上游联网实测）**：

1. **两家都没有「完整的映射表」**——Linkie 无本地映射数据与 DB（`linkie-core` 内非 `.kt` 仅 gradle-wrapper；无 sql/jdbc 依赖，`build.gradle:39-59`），运行时从上游全量拉取 + 自研 `.linkie6` 二进制快照（键 = 上游 build 号，`core/MappingsSupplier.kt:130-152`）；mcmap 同构（`dist/sources/*` 按需拉取 + `utils/cache.js`；`namespaces.js` 里 4 个 namespace 标 `known-unsupported`）。所谓「完整」= **namespace 数量**（Linkie 12 / mcmap 13）。
2. **namespace 面**：Linkie = `yarn / mojang / mojang_raw / mojang_hashed / mojang_srg / mcp / quilt-mappings / legacy-yarn / barn / feather / plasma / yarrn`；其 `mojang_raw` 最早 = 19w36a（硬编码 1.14.4，`ns/MojangRawNamespace.kt:95-102`）——与 §4 A4c 前我们侧联网实测（1.7.10/1.12.2/1.13.2 `NO client_mappings`）**交叉一致**。
3. **`legacy-yarn` 上游实测（本轮；`repo.legacyfabric.net` / `net.legacyfabric/yarn`）**：
   - metadata = **1069 版本 / 71 个 MC 版本**（1.3 → 1.13.2，含 1.7.10-pre1…4、1.8.1/1.8.2-pre*、13w47a…、15w14a）；**本仓 7 个老档全在**（1.7.10/1.8.9/1.9.4/1.10.2/1.11.2/1.12.2/1.13.2）。
   - artifact 分件：`-v2.jar`（tiny 头 `intermediary named`，**无 obf**，不可一跳 join）与 **`-mergedv2.jar`（tiny 头 `official intermediary named`，含 obf ✓）**；1.7.10+build.603 同样有 mergedv2 ✓。
   - **1.12.2 实测（`-mergedv2.jar`）**：本仓 `mergedTinyClassPairs` 直接解析 ✓；与 `data/forge_1.12.2/mappings/joined.srg` 的 obf join = **3344/3344 = 100%**；两体系名字差异 = **FQCN 不同 3250/3344（97.2%）· 简名不同 3139/3344（93.9%）**（样本：`net/minecraft/util/text/TextFormatting` ↔ `net/minecraft/util/Formatting`）⇒ 对照表有实质信息量。
   - 实现前置（若做 A4h）：jar → `mappings/mappings.tiny` 提取（Node 侧 `execFileSync("tar", ["-xOf", …])` 即可；mcmap 同环节见 `sources/legacyFabric.js:26-31`，其缓存 TTL 30 天）。
4. **方法层借鉴（均已在用或已有对应）**：obf 桥跨 ns（Linkie `QueryTranslateMappingsCommand.kt:282-289`；本仓对照表同法，独立互证）· 构建号作缓存键 · 模糊降级（S1′ 已有）· 覆盖队列（本仓不需要）。

**裁定边界（§5 维持不动）**：§5.1 不引它们的库/表——本轮无一证据支持引入（无表可引；JVM 进程不兼容）；§5.4 legacy namespace「只指路不建语料」——新证据（legacy-yarn 可拉、71 版覆盖）**不等于要建**（本仓无 Legacy Fabric 平台档、leg2/cross-layer 无消费方）。

**裁定（2026-09-26 用户「可以用」）**：

- **A4h → 已落地（2026-09-26）**：新生产者 `mcp-server/scripts/build-mcp-legacyyarn-pairs.mjs`（两侧上游直连；落 `$MC_SKILL_CACHE/mcp-legacyyarn-pairs`，走 write-guard `scratch*` 出口 ⇒ 过 S20 无需登记豁免；fetch→curl 退避腿）。**7/7 档、合计 20,789 对**：1.7.10=1836 / 1.8.9=2541 / 1.9.4=2939 / 1.10.2=2980 / 1.11.2=3122 / 1.12.2=3344 / 1.13.2=4027（各档 = 最高 build 的 `-mergedv2.jar`）。已发布入库 **`data/_mcp-legacyyarn-pairs/`**（7 JSON + index + provenance，sha256 逐件钉）。**许可已核 = Legacy-Fabric/yarn CC0-1.0**（README「开放、无附加限制」；同 FabricMC/yarn 先例）。消费方：**暂无门消费**（数据资产——Legacy Fabric 迁移面查询；未来若建门再接）。
- **A4d → 已落地（2026-09-26 用户「A4d 做」）**：`convert_mapping` 的 `from/to` enum 各收 Linkie 扩展 namespace（6 值）⇒ 入口**一律** `found:false + action{code:UNSUPPORTED_NAMESPACE, nextSteps, relatedTools}`（带内失败、不置 isError、CLI exit 0——与 `batchTooLarge` 同形）。文案已与 A4i 对齐：LegacyYarn / Feather / QuiltMappings 指到本仓三个 `data/_*-pairs/` 数据目录；Barn / Plasma / Yarrn 指上游（maven.glass-launcher.net / GitHub Plasma / maven.concern.i.ng，并提 Linkie）。
  落点：`src/tool-registry.ts`（enum ×2 + `CONVERT_MAPPING_DESC` 新增段）· `src/mappings/convert.ts`（`unsupportedNamespaceResult` 早退，置于任何查表之前）· `src/utils/actionable.ts`（`UNSUPPORTED_NAMESPACE` 码 + **A-27 位点散文 585→588 当场同步**）· `src/mappings/yarn-sqlite.ts`（`LookupLayer` 别名 + 2 处调用点收敛）· `src/mappings/convert-extras.ts`（`toLayer` 收敛 + `AccessLineRequest` 类型导入）。
  验证（全绿）：`tsc` 0 · CLI 三场景（legacy-yarn/barn 拒绝+指路；mojang 回归 `converted:"er"`）· `test-core.mjs` 0（新增 6 条断言：code/nextSteps/relatedTools/两侧命中）· `test-wave-bcd.mjs` 0（`w4A8Gates ok`）· `test-scripts.mjs` 0（第 8 步收口链）· `assert-cli-quick.mjs` 0 · IDE 类型诊断 0。
  ⚠️ 未动：CLI 的 `isToolFailure`（带内失败保持 exit 0，与既有 `found:false` 语义一致）；`ok: false` 字面量未新增 ⇒ `actionable.ts` 的处数台账（331/52 一组）不动。

### A4i — 2026-09-26「本仓库没有的」补齐（用户「可不可以补一下」→ 已补两家）

**裁定更新**：§5.4「只指路不建语料」收窄为 **「知识语料不建；映射数据（CC0 上游）可补」**。

**已落地（两家；两侧上游直连 + 产物入库 + provenance sha 钉 + 生成器过 S20 的 write-guard scratch 出口）**：

| 产物 | 生成器 | 覆盖 | 对数 | 许可 | 差异率（实测） |
| --- | --- | --- | --- | --- | --- |
| `data/_mcp-feather-pairs/` | `build-mcp-feather-pairs.mjs` | 1.7.10–1.13.2（7 档，老档**第三体系**） | 20,789 | Feather = **CC0**（OrnitheMC/feather） | 1.12.2：FQCN 97.9% / 简名 91.9% |
| `data/_qm-yarn-pairs/` | `build-qm-yarn-pairs.mjs` | 1.18.2–1.21.11（6 档 = 本仓 quilt 档 ∩ fabric 档） | 46,323 | QuiltMappings = **CC0-1.0** | 1.21.11：FQCN 55.4% / 简名 50.1%（集中在匿名/内部类：QM 语义名 vs yarn 哈希名） |

- **Feather 逐档与 `_mcp-legacyyarn-pairs` 同数**（1836/2541/2939/2980/3122/3344/4027——同覆盖系，join 命中 100%）；QM 1.21.11 join 9934/9935。
- QM 的 tiny 列序是 `official/hashed/named`（**hashed** 即 Quilt 的中介层）——本仓解析器**按列名定位**故直接兼容。

**不做（附原因，防被重新提出）**：
- **Barn（Babric，b1.7.3）**：本仓无 b1.7.3 档（无规则树/语料/消费方）；上游 meta 仅 7 个 build（实测）。
- **Plasma（b1.7.3）**：同无档位；且数据一半在**个人 gist**（Chocohead 的 `Beta 1.7.3 Merge.tiny`，`PlasmaNamespace.kt:25`）——gist 无明示许可 ⇒ 默认保留，不入库。
- **Yarrn（Infdev 20100618）**：同无档位；上游为个人 maven（`maven.concern.i.ng`），许可未证。
- ⇒ 若将来点名做「远古版本（b1.7.3/Infdev/Beta）modding 数据面」，再逐家核许可后单开。

**复算命令**：
```bash
node mcp-server/scripts/build-mcp-feather-pairs.mjs   # 7/7 档 20,789 对
node mcp-server/scripts/build-qm-yarn-pairs.mjs       # 6/6 档 46,323 对
```

**复算命令**：
```bash
curl.exe -sL --ssl-no-revoke "https://maven.legacyfabric.net/net/legacyfabric/yarn/maven-metadata.xml" | Select-String '<version>'   # 1069 行；1.7.10–1.13.2 全在
curl.exe -sL --ssl-no-revoke -o %TEMP%\ly-mv2.jar "https://maven.legacyfabric.net/net/legacyfabric/yarn/1.12.2+build.604/yarn-1.12.2+build.604-mergedv2.jar"
node --no-warnings temp/verify-legacy-yarn.mjs   # 一次性验证脚本（temp/，不属生产件）：firstLine=official…、3344/3344=100%
```
