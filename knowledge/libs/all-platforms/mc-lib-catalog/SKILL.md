---
name: mc-lib-catalog
description: 库模组总目录与路由中枢。触发词：库模组、library、Cloth Config、YACL、GeckoLib、Architectury、Curios、Trinkets、JEI、EMI、REI、配置库、动画库、全家桶库、依赖树、选哪个库、knowledge/libs
platforms: [fabric, forge, neoforge]
mcVersions: ["1.20.1+"]
communityDocId: authored/library-catalog-2026
---

# 库模组 Skill 路由中枢（knowledge/libs）

遇到"某个库模组是什么 / 选哪个 / 怎么接"的问题时，先经本 skill 按 §3.6 解析规则定位 `knowledge/libs/` 下对应的库 skill，再读那份源稿。库 skill 是源稿即用，不落盘到平台目录。

## Decision: 如何路由到具体库 skill

```
IF 问题涉及具体库（配置 / 动画 / 饰品 / 配方查看器…）
  → 找到对应 mc-<name> 目录，直接读源稿
IF 问题泛泛（"该选哪个配置库"、"依赖树里多了个库"）
  → 读 mc-config / mc-author-shared-libs
IF 不知道有没有对应库 skill
  → 按下方 §3.6 解析流程扫描 knowledge/libs 五组
IF 平台 = bedrock
  → 只扫 bedrock-only（mc-script-ui / mc-script-server）；禁止套用 Java 库 skill
```

## §3.6 路径解析规则（源稿即用，禁止复制落盘）

1. 输入 `(platform, mcVersion)`，platform ∈ forge | fabric | quilt | neoforge | bedrock
2. 组映射：
   - forge → `forge-only` + `all-platforms`
   - fabric / quilt → `fabric-only` + `all-platforms`
   - neoforge → `neo-only` + `all-platforms`
   - bedrock → `bedrock-only`
3. 候选 = 组内每个 `mc-*/SKILL.md`，先按组限定，再读 frontmatter `platforms` 二次确认（组是主依据，platforms 防组内误放）
4. 版本过滤：frontmatter `mcVersions` 未写 = 不限版本；非空 = 必须包含目标 mcVersion
5. 输出匹配 skill 后直接读取其正文使用

完整清单与数据链见 `knowledge/libs/README.md`。

## all-platforms 组索引（本组 20 个）

| skill | 覆盖 |
|---|---|
| mc-lib-catalog | 本路由中枢 |
| mc-author-shared-libs | 全家桶共享库依赖树纪律 |
| mc-compat-jei | JEI / EMI / REI 配方查看器 |
| mc-config | 配置库选型总纲（ForgeConfigSpec / Cloth / YACL / Fzzy） |
| mc-yacl | YACL 配置库 |
| mc-geckolib | GeckoLib 3D 动画 |
| mc-architectury | Architectury 跨加载器 |
| mc-owo | owo-lib（fabric / neoforge / quilt，不含 forge） |
| mc-terrablender | TerraBlender 生物群系注入 |
| mc-playeranimator | playerAnimator 动画 |
| mc-pehkui | Pehkui 实体缩放 |
| mc-kubejs | KubeJS 脚本 |
| mc-balm | Balm 跨加载器工具 |
| mc-modern-ui | Modern UI |
| mc-patchouli | Patchouli 指南书 |
| mc-resourceful-lib | Resourceful Lib |
| mc-moonlight-lib | Moonlight Lib |
| mc-caelus | Caelus 飞行饰品 API |
| mc-spruceui | SpruceUI / ObsidianUI |
| mc-server-translations | Server Translations API |

**其它组（不落盘，按平台解析）**：fabric-only 9（Trinkets / CCA / Polymer…）、forge-only 2（Curios / KFF）、neo-only 2（镜像）、bedrock-only 2（Script API）。全库 **35** 份源稿 / **33** 唯一 skillId。

## 查找流程

1. 判定用户平台与 MC 版本（build.gradle / mods.toml / fabric.mod.json / manifest）
2. 按组映射 + platforms 白名单筛出候选
3. 用 `search_community_docs` 查 `authored/library-catalog-2026` 确认库名与分类
4. 打开目标 `mc-*/SKILL.md` 源稿，按其中 Decision 分支执行
5. 方法名 / 坐标等细节以该库官方文档为准

## 常见错误

- 查平台 `.cursor/skills` 里的旧库项（已清理，库项只存在于 knowledge/libs 源稿）
- 把 fabric-only 组的 skill（如 mc-trinkets）用在 forge 项目
- 把 Java 库 skill 用在基岩 Add-On（应走 bedrock-only）
- 忽略 mcVersions 过滤，把 26.x 写法的 skill 内容套到 1.20.1
- 把源稿复制 / 改写到平台目录（禁止落盘，直接用源稿）

## 相关

- 短文：`authored/library-catalog-2026`（总目录与分类导航）
- MCP：`search_community_docs`、`check_dependencies`、`list_community_sources`
- 规则：根 AGENTS.md「库模组 Skill」、`knowledge/libs/README.md`
