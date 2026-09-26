# knowledge/libs — 库模组 Skill 源稿

本目录是**所有库模组 Skill 的唯一源稿**，**不落盘**：各平台 `.cursor/skills`（及 .claude / .continue / .opencode / .agents / .zcode / .pi 镜像）**不再**写入库项。使用方（AGENTS 指引 / library-catalog / check_dependencies）按解析规则**直接读源稿**。

**当前规模**：五组共 **36** 份 `mc-*/SKILL.md`（**34** 唯一 skillId；`mc-curios` / `mc-kotlin-for-forge` 在 forge-only 与 neo-only 各有一份镜像）。

## 分组规则

| 组 | 适用平台 | 说明 |
|----|----------|------|
| `all-platforms/` | forge / fabric / quilt / neoforge | **多平台（组名不承诺全平台）**：实际覆盖以各库 frontmatter `platforms` 为准（实测 2026-09-24 复算，两机制独立一致：**20 份里 11 份含 quilt / 9 份不含**，且 20 份**全部**带 `platforms:` 键（含 `mc-config: [fabric, forge, neoforge]`）⇒ 那 9 份是**显式排除**、不存在「未声明 = 不限」那一档；`mc-owo` 不含 forge——判据须**按 token 比**，`/forge/i` 会把 `neoforge` 误配成「含 forge」（实测那样得出「不含 forge 的 0 份」）；与 :43 同口径）；三端构建窗口不同的库另写 `mcVersionsByPlatform` 收窄（生效面两条链路同语义：resolve 与 session，一致性由 `mcp-server/scripts/assert-lib-session-resolve-parity.mjs` 钉）；正文 Decision 分平台 |
| `fabric-only/` | fabric / quilt | 仅 Fabric 系，**永不**用于 forge / neoforge；**only = 本仓维护面，不是库的平台支持面**（见下注） |
| `neo-only/` | neoforge | Neo 归属稿；与 forge-only **镜像同名**时可并存（如 Curios / KFF）；**only = 本仓维护面，不是库的平台支持面**（见下注） |
| `forge-only/` | forge | Forge 归属稿；Neo 共用库请在 `neo-only/` 放镜像，**不要**改解析组映射；**only = 本仓维护面，不是库的平台支持面**（见下注） |
| `bedrock-only/` | bedrock | 基岩 Script API（`mc-script-ui` / `mc-script-server`）；**禁止**把 Java 库 Skill（CCA/Trinkets/GeckoLib 等）当基岩教程 |

- 分组是主依据；frontmatter `platforms` 二次确认，防组内误放
- fabric-only 只对 fabric/quilt；forge-only 只对 forge；neo-only 只对 neoforge；bedrock-only 只对 bedrock
- **`*-only` 的 "only" = 本仓维护面**（本仓只维护该平台的稿），**不是库的平台支持面**——上游可能在其它平台也有构建。实测（2026-09-16）：`mc-cloth-config` 在 fabric-only 而 manifest 取件含 fabric/forge/neoforge；`mc-curios` 只有 forge/neo 两份稿而取件面还含 fabric；`mc-server-translations` / `mc-spruceui` 声明含 forge/neoforge 而取件面只有 fabric。跨平台工程按 frontmatter `platforms` 选稿；本条**不改变**解析组映射

## 同 id 规则

- 默认：五组下 skill id（目录名 `mc-*`）全局唯一（如 `mc-owo` 只在 all-platforms 一份）
- **例外**：`forge-only` ↔ `neo-only` 允许同名镜像（解析路径互斥：forge 不扫 neo-only，neoforge 不扫 forge-only）
- 其它跨组重名仍 fail-fast

## 解析规则（§3.6 摘要）

```
输入 (platform, mcVersion)
1. 组映射：
   forge → forge-only + all-platforms
   fabric / quilt → fabric-only + all-platforms
   neoforge → neo-only + all-platforms
   bedrock → bedrock-only
2. 候选 = 组内每个 mc-*/SKILL.md，读 frontmatter platforms 二次确认
3. 版本过滤：frontmatter mcVersions 未写 → 不限版本；非空 → 必须覆盖目标 mcVersion
4. 输出 { skillId, path, modIds, platforms } 列表（按 skillId 排序）
```

校验脚本：`node scripts/resolve-lib-skills.mjs --validate`

> 注（2026-08 审计补充）：① Quilt 用户按 `fabric → fabric-only + all-platforms` 同组解析（QSL 生态已停更，Fabric-first 库是现实替代）；**9/20** all-platforms 库的 platforms 白名单**显式**不含 quilt（11 份含；2026-09-24 两机制复算：token 严格比 + 逐目录 `grep -m1 '^platforms:'` 原文，首版这里写的 16/20 作废）属既有口径，未覆盖时以 catalog 提示改口，不视为缺陷。② `mc-server-translations`（Nucleoid 出品，Fabric-first）platforms 声明含 forge/neoforge 为其官方跨端支持面，保留。③ 平台 `.cursor/skills` 下的 `mc-compat-jei`（forge/1.20.1、neoforge/26.1）是**平台自有项**：forge/1.20.1 副本已对齐 knowledge/libs 源稿；neoforge/26.1 副本为独立维护的守卫 stub（文内已声明），均非镜像。

## 禁止 propagate

- `scripts/propagate-wave-d-skills.mjs` 的 WAVE_D **不含库项**（已移除 mc-config / mc-geckolib / mc-curios / mc-patchouli），文件头注释指向本目录
- 库项**不做**任何落盘/复制/写入动作；`sync-skills.ps1` 仅同步平台自有 skill 的 IDE 镜像
- **例外（2026-09-16 裁定：保留中心稿 + 加投影版本注入点）**：`mc-cloth-config` 双轨——本目录 `fabric-only/mc-cloth-config/`（SKILL.md 通用形 + `versions.json` 档位坐标真值）为权威；各档 `fabric/<v>/.cursor/skills/mc-cloth-config.md` 为档内实况（frontmatter 后带 `cloth-version-inject` 标记行），由 `scripts/project-cloth-skill.mjs` 按 versions.json 校验/回填标记（默认 dry-run）。仍**禁止**把中心稿正文批量覆盖到档内——注入点只管理版本标记，档内正文含逐档修正

## 使用方式

- AI 按 AGENTS 指引经上述解析**直接读源稿**（`knowledge/libs/<group>/mc-<name>/SKILL.md`），正文与源稿一致，禁止改写正文
- 不确定读哪个 → 用 `mc-lib-catalog` 路由；依赖检查走 MCP `check_dependencies`
- catalog 显式路由未列出的 11 个 id 走组级路由（按组直接读源稿）：mc-curios / mc-trinkets / kotlin-for-forge / fabric-language-kotlin / cca / impersonate / libgui / player-ability-lib / polymer / satin / text-placeholder
- 每个 SKILL.md 均含 `communityDocId`（`authored/lib-*`），细节经 MCP `search_community_docs` 读取
- 未核对签名不写死：API 以官方文档 + 反编译核对为准

## 当前清单

**all-platforms（20）**：mc-lib-catalog、mc-author-shared-libs、mc-compat-jei、mc-config、mc-yacl、mc-geckolib、mc-architectury、mc-owo（platforms 不含 forge）、mc-terrablender、mc-playeranimator、mc-pehkui、mc-kubejs、mc-balm、mc-modern-ui、mc-patchouli、mc-resourceful-lib、mc-moonlight-lib、mc-caelus、mc-spruceui、mc-server-translations

**fabric-only（10）**：mc-trinkets、mc-cca、mc-polymer、mc-text-placeholder、mc-satin、mc-fabric-language-kotlin、mc-libgui、mc-player-ability-lib、mc-impersonate、mc-cloth-config

**forge-only（2）**：mc-curios、mc-kotlin-for-forge（`platforms: [forge]`）

**neo-only（2）**：mc-curios、mc-kotlin-for-forge（镜像，`platforms: [neoforge]`；不改 `neoforge → neo-only 
+ all-platforms` 映射）
**bedrock-only（2）**：mc-script-ui、mc-script-server

## 关联数据（MCP 消费）

| 产物 | 位置 | 规模（当前） |
|------|------|-------------|
| `library-catalog.ts` | `mcp-server/src/diagnostics/`（生成物） | 50 条 catalog；`verifiedApi` 键 **实算 2632（2026-09-24 复跑该命令）**，复核 `grep -cE '"[0-9][^"]*/[a-z]+": \{' mcp-server/src/diagnostics/library-catalog.ts`；同数钉在 `mcp-server/scripts/assert-lib-ownership.mjs` 的 `LEDGER.verifiedApiKeys`（不一致即红）。旧文档写死的 1880 / 1836 / 1830 均已过期。另有**不同分母**：摘要侧 `lib-api-summaries/*.json` **48 份**（同 :77 的现扫数）/ `versions` 组键 **824**（2026-09-24 现跑口径 B 命令；旧稿写 44 份 / 320 组已过期），见根 `README.md` §7.5 计数口径 B，勿与本数混用 |
| `lib-manifests/all.json` | `mcp-server/data/` | 49 slug / 3,003 版本条目（口径：顶层是**数组**，`length` = slug 数；版本条目 = 各元素 **`entries`** 数组长度求和，**不是** `versions`——按 `versions` 取会算出 0。复核 `node -e "const j=require('./mcp-server/data/lib-manifests/all.json');console.log(j.length, j.reduce((a,e)=>a+e.entries.length,0))"`，as-of 2026-09-25；旧值 48 / 2,870（as-of 2026-09-16 那次的首页截断面）已被第 44 轮翻页重抓取代） |
| `lib-api-summaries/*.json` | `mcp-server/data/` | **48** 库 API 摘要（A-43 复计 2026-09-19：目录内 48 个 `.json`，无 meta 文件混入；旧稿写 44 已过期） |

`verifiedApi.<版本/加载器>.packages` 是反编译产物顶层目录的**启发式截取名**（2–3 段），只能用来定位包根，
**不能当 import 依据**；落到类名必须走 `query_loader_api`（先 `ingest_loader_api` 用户自备 jar）或 IDE 核对。

归属口径（2026-09-12 裁定，完整规则见根 `CONTRIBUTING.md` §数据链口径）：

- `packages` 记的是**该树实测到的包**，不是声明白名单的回声。声明前缀先按本树校验；全不成立时按「modId 是路径的一段（`-`/`_` 不敏感）」重建；仍不成立则留空并告警，**禁止**退化成全收（`-all` 胖 jar 会把 Kotlin stdlib 当成本库 API）。
- 拒收判据只有一条：包根已被**他方**证实拥有。字面「包名以本条目 modId 开头」会否掉 92.7% 的真数据（MC 包根是作者命名空间）。
- 摘要行的身份来源记在 `modIdEvidence`：`jar`（自身元数据）/ `jarjar-self` / `jarjar-labeled`（它自己声明的内层 jar）/ `external`（调用方标签，且已被该 jar 条目证实）。

生成链见仓库根 `README.md`「社区知识与库模组」与 MCP 工具 §7.5。
