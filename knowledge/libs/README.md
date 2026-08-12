# knowledge/libs — 库模组 Skill 源稿

本目录是**所有库模组 Skill 的唯一源稿**，**不落盘**：各平台 `.cursor/skills`（及 .claude / .continue / .opencode / .agents / .zcode / .pi 镜像）**不再**写入库项。使用方（AGENTS 指引 / library-catalog / check_dependencies）按解析规则**直接读源稿**。

## 分组规则

| 组 | 适用平台 | 说明 |
|----|----------|------|
| `all-platforms/` | forge / fabric / quilt / neoforge | 多端均有集成意义，正文 Decision 分平台 |
| `fabric-only/` | fabric / quilt | 仅 Fabric 系，**永不**用于 forge / neoforge |
| `neo-only/` | neoforge | 默认空置；仅当某库「仅 Neo 有独立 API」时新增 |
| `forge-only/` | forge / neoforge | Forge 系专属（Neo 经 platforms 白名单可用） |

- 分组是主依据；frontmatter `platforms` 二次确认，防组内误放
- fabric-only 的 skill 只对 fabric/quilt 解析；forge-only 只对 forge/neoforge

## 同 id 全局唯一

- 四组下 skill id（目录名 `mc-*`）全局唯一，**禁止跨组重名**（如 `mc-owo` 只在 all-platforms 一份，禁止再造第二个）
- 解析/校验时收集全部 id 查重，重复 fail-fast

## 解析规则（§3.6 摘要）

```
输入 (platform, mcVersion)
1. 组映射：
   forge → forge-only + all-platforms
   fabric / quilt → fabric-only + all-platforms
   neoforge → neo-only + all-platforms
2. 候选 = 组内每个 mc-*/SKILL.md，读 frontmatter platforms 二次确认
3. 版本过滤：frontmatter mcVersions 未写 → 不限版本；非空 → 必须覆盖目标 mcVersion
4. 输出 { skillId, path, modIds, platforms } 列表（按 skillId 排序）
```

## 禁止 propagate

- `scripts/propagate-wave-d-skills.mjs` 的 WAVE_D **不含库项**（已移除 mc-config / mc-geckolib / mc-curios / mc-patchouli），文件头注释指向本目录
- 库项**不做**任何落盘/复制/写入动作；`sync-skills.ps1` 仅同步平台自有 skill 的 IDE 镜像

## 使用方式

- AI 按 AGENTS 指引经上述解析**直接读源稿**（`knowledge/libs/<group>/mc-<name>/SKILL.md`），正文与源稿一致，禁止改写正文
- 不确定读哪个 → 用 `mc-lib-catalog` 路由；依赖检查走 MCP `check_dependencies`
- 每个 SKILL.md 均含 `communityDocId`（`authored/lib-*`），细节经 MCP `search_community_docs` 读取
- 未核对签名不写死：API 以官方文档 + 反编译核对为准

## 当前清单

**fabric-only（7）**：mc-trinkets、mc-cca、mc-polymer、mc-text-placeholder、mc-satin、mc-fabric-language-kotlin、mc-libgui

**forge-only（2）**：mc-curios、mc-kotlin-for-forge

**neo-only（0）**：默认空置

**all-platforms（-）**：见各稿（mc-owo 唯一一份，platforms 不含 forge）
