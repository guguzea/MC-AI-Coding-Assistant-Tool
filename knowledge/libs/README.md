# knowledge/libs — 库模组 Skill 源稿

本目录是**所有库模组 Skill 的唯一源稿**，**不落盘**：各平台 `.cursor/skills`（及 .claude / .continue / .opencode / .agents / .zcode / .pi 镜像）**不再**写入库项。使用方（AGENTS 指引 / library-catalog / check_dependencies）按解析规则**直接读源稿**。

**当前规模**：五组共 **35** 份 `mc-*/SKILL.md`（**33** 唯一 skillId；`mc-curios` / `mc-kotlin-for-forge` 在 forge-only 与 neo-only 各有一份镜像）。

## 分组规则

| 组 | 适用平台 | 说明 |
|----|----------|------|
| `all-platforms/` | forge / fabric / quilt / neoforge | 多端均有集成意义，正文 Decision 分平台 |
| `fabric-only/` | fabric / quilt | 仅 Fabric 系，**永不**用于 forge / neoforge |
| `neo-only/` | neoforge | Neo 归属稿；与 forge-only **镜像同名**时可并存（如 Curios / KFF） |
| `forge-only/` | forge | Forge 归属稿；Neo 共用库请在 `neo-only/` 放镜像，**不要**改解析组映射 |
| `bedrock-only/` | bedrock | 基岩 Script API（`mc-script-ui` / `mc-script-server`）；**禁止**把 Java 库 Skill（CCA/Trinkets/GeckoLib 等）当基岩教程 |

- 分组是主依据；frontmatter `platforms` 二次确认，防组内误放
- fabric-only 只对 fabric/quilt；forge-only 只对 forge；neo-only 只对 neoforge；bedrock-only 只对 bedrock

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

> 注（2026-08 审计补充）：① Quilt 用户按 `fabric → fabric-only + all-platforms` 同组解析（QSL 生态已停更，Fabric-first 库是现实替代）；16/20 all-platforms 库的 platforms 白名单不含 quilt 属既有口径，未覆盖时以 catalog 提示改口，不视为缺陷。② `mc-server-translations`（Nucleoid 出品，Fabric-first）platforms 声明含 forge/neoforge 为其官方跨端支持面，保留。③ 平台 `.cursor/skills` 下的 `mc-compat-jei`（forge/1.20.1、neoforge/26.1）是**平台自有项**：forge/1.20.1 副本已对齐 knowledge/libs 源稿；neoforge/26.1 副本为独立维护的守卫 stub（文内已声明），均非镜像。

## 禁止 propagate

- `scripts/propagate-wave-d-skills.mjs` 的 WAVE_D **不含库项**（已移除 mc-config / mc-geckolib / mc-curios / mc-patchouli），文件头注释指向本目录
- 库项**不做**任何落盘/复制/写入动作；`sync-skills.ps1` 仅同步平台自有 skill 的 IDE 镜像

## 使用方式

- AI 按 AGENTS 指引经上述解析**直接读源稿**（`knowledge/libs/<group>/mc-<name>/SKILL.md`），正文与源稿一致，禁止改写正文
- 不确定读哪个 → 用 `mc-lib-catalog` 路由；依赖检查走 MCP `check_dependencies`
- catalog 显式路由未列出的 11 个 id 走组级路由（按组直接读源稿）：mc-curios / mc-trinkets / kotlin-for-forge / fabric-language-kotlin / cca / impersonate / libgui / player-ability-lib / polymer / satin / text-placeholder
- 每个 SKILL.md 均含 `communityDocId`（`authored/lib-*`），细节经 MCP `search_community_docs` 读取
- 未核对签名不写死：API 以官方文档 + 反编译核对为准

## 当前清单

**all-platforms（20）**：mc-lib-catalog、mc-author-shared-libs、mc-compat-jei、mc-config、mc-yacl、mc-geckolib、mc-architectury、mc-owo（platforms 不含 forge）、mc-terrablender、mc-playeranimator、mc-pehkui、mc-kubejs、mc-balm、mc-modern-ui、mc-patchouli、mc-resourceful-lib、mc-moonlight-lib、mc-caelus、mc-spruceui、mc-server-translations

**fabric-only（9）**：mc-trinkets、mc-cca、mc-polymer、mc-text-placeholder、mc-satin、mc-fabric-language-kotlin、mc-libgui、mc-player-ability-lib、mc-impersonate

**forge-only（2）**：mc-curios、mc-kotlin-for-forge（`platforms: [forge]`）

**neo-only（2）**：mc-curios、mc-kotlin-for-forge（镜像，`platforms: [neoforge]`；不改 `neoforge → neo-only 
+ all-platforms` 映射）
**all-platforms（20）**：见各稿（mc-owo 唯一一份，platforms 不含 forge）
**bedrock-only（2）**：mc-script-ui、mc-script-server

## 关联数据（MCP 消费）

| 产物 | 位置 | 规模（当前） |
|------|------|-------------|
| `library-catalog.ts` | `mcp-server/src/diagnostics/` | 50 条 catalog / 1880 `verifiedApi` 键 |
| `lib-manifests/all.json` | `mcp-server/data/` | 45 slug / 2867 版本条目 |
| `lib-api-summaries/*.json` | `mcp-server/data/` | 44 库 API 摘要 |

生成链见仓库根 `README.md`「社区知识与库模组」与 MCP 工具 §7.5。
