---
name: Skill可见性与MCP修复
overview: Skill 不可见是 IDE 发现规则。安装只做符号链接（一套平台+版本、原名），不复制、不写 stub。全局同时挂多套无法靠纯软链区分同名。MCP 工具 bug 按清单修。
todos:
  - id: skill-diagnosis
    content: 记录 Cursor 与其余 IDE 的 Skill 发现规则、与 sync-skills 落盘差异
    status: pending
  - id: autosetup-skill-install
    content: AUTO_SETUP：只符号链接一套（原名 mklink /J）；问全局或项目；换版本先拆旧链再链新套；不复制、不写 stub
    status: pending
  - id: fix-update
    content: 修 mc_skill_update：git describe ahead/equal 不再假更新；package.json version 对齐
    status: pending
  - id: fix-deps-gen-api
    content: 修 emi 误匹配、datagen/lang、query_api/params/registry、gradle Loom、porting、localize、semantic 探测
    status: pending
  - id: fix-wiki-docs
    content: 修 wiki code 转换并从 raw 重生；更新 search_*_docs schema 描述
    status: pending
  - id: tests-build
    content: npm run build 并跑相关测试
    status: pending
isProject: false
---

# Skill 不可见原因 + MCP bug 修复计划

## 一、Skill：为什么设置页没有、`/` 却有一部分

不是 MCP 没重载。也不在 `MC_skill` 仓库根提交 `.cursor/skills/`。

Cursor 扫 `.cursor/skills/`、`.agents/skills/`（含子目录），必须 `技能名/SKILL.md`。嵌套 Skill scoped；设置页偏用户级+工作区根级。`/` 按 name 去重。工作区根与 `~/.cursor/skills` 皆无 → 设置页空。Fabric 扁平 `mc-*.md` 无效。库 Skill 不落盘。

其它 IDE：Codex/OpenCode/Pi 只从 CWD 向上走；Continue/Trae/ZCode 多半只扫工作区根。不能强制按本仓库目录树解析。

### 安装：只符号链接（已定）

可以。IDE 认的是扫描目录里的 `<name>/SKILL.md`，目录联接过去就会进设置页和 `/`。不复制、不写 stub。

必须用源文件夹**原名**（`mc-block`），与 frontmatter `name` 一致。因此**同一目标只能挂一套**平台+版本。分类子目录（`skills/forge-1-20-1/mc-block`）在 Cursor 里身份仍是 `mc-block`，解不了撞名。改联接文件夹名为 `forge-1-20-1-mc-block` 也不是合法纯软链。

步骤：问全局或项目 → 推断/询问一套平台+版本 → 列出联接、确认后 `mklink /J`。Fabric 源用 `.agents/skills/<name>/`。换版本先拆旧链。失败不默默复制。不要整目录替换 `~/.cursor/skills`。不要链到本仓库根。库 Skill 默认不链。

目标：Cursor/Claude/Continue/Trae/OpenCode/Codex/ZCode/Pi 各自 `.../skills/<name>`。可选工具 `install_ide_skills`（dryRun+confirmed）。

---

## 二、MCP bug 修复清单

不改 NeoForge 库组映射；库 Skill 不落盘；不走 propagate。

- A `mc_skill_update`：git describe ahead/equal 则不必更；package.json → 1.0.4
- B `check_dependencies`：短 token 把 `.` 算进词字符，避免 emi 误中 trinkets
- C datagen 用 toJavaClassName + targetName；lang 按 item_/block_/entity_ 推断
- D query_api 纯编辑距离 found=false；26.1 提示；params schema；registry 精确优先
- E lookup_obfuscated owner 包名 note
- F diagnose_gradle 遇 loom/neogradle 声明仅 Forge
- G porting：已传 targetPlatform 不再空喊；network low 文案；NeoForge 用 search_neoforge_docs
- H localize 缺 sourceJson → INVALID_INPUT
- I semantic 跳过非版本树 / 不存在的 wiki
- J search_*_docs 描述改为 hybrid+RRF
- K process-fabric-wiki `<code>` 转 fence，有 raw 则重跑

## 三、验证

mcp-server `npm run build` + 相关测试。重载 MCP 后工具生效。Skill 设置页：联接一套之后才会列出。
