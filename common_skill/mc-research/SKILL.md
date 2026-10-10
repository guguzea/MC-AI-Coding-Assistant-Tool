---
name: mc-research
description: 带出处的调查。当用户问「X 库 / X 版本到底存不存在、上游出到第几 build、这个 maven 坐标对不对、这 mod 兼不兼容本工程、该用哪个库」这类需要一手来源的事实题时激活：只查一手来源（上游发布端点、官方构件与文档页、反编译输出），产出一份逐条带出处与状态的调查记录；核不到一律写「未核实」，禁止凭印象报名字。回答「做什么内容」的设计题不走本技能；普通 API 签名查询走正常检索路径，不冒充研究报告。
---

# mc-research — 查事实，留出处

一句话目标：把「凭印象说有个库」变成「这个出处、这个读数、as-of 这天」。

## 第 1 步 · 定问题与判据

- 把问题写成可判真伪的一条：例「cloth-config 有没有 1.20.1-Fabric 版」，不是「cloth 怎么样」。
- 写明「查来干什么用」——决定查多深（存在性一条腿够；兼容性要核构件与 loaders）。
- 先列要核的点，每个点定「什么算证据」：构件在场（maven / Modrinth 读数）、文档页逐字命中、反编译输出。

## 第 2 步 · 来源分级，从上往下取

1. **上游发布端点与构件**：`query_upstream_releases`（三态读：`ok:false` = 没查到 ≠ 上游没有；`available:false` = 上游确实没有）；jar 在场性用 `analyze_mod_jar` / `download_official_mdk` dryRun 读数。
2. **官方文档页**：`search_forge_docs` / `search_fabric_docs` / `search_neoforge_docs` / `search_docs`；命中页的 `verbatim:false` 只说明该页正文没逐字出现，**不能当存在证据**。
3. **反编译**：`get_minecraft_source` / `decompile_mod_jar` + `search_mod_code`——签名级问题的最终裁判（需 JDK 17+，本机缺则如实写工具不可用）。
4. **社区短文**：`search_community_docs`，只作线索不作规范。
5. **训练记忆**：不得当出处。想到一个名字 → 必须回到 1–4 找证据；找不到就「未核实」。

## 第 3 步 · 核验清单（已知坑，逐条过）

- Modrinth slug 碰撞：查库带 project_type facets 再核 loaders，同名 ≠ 同物。
- 仓库改名只见于 301 Location（需手动跟重定向）；GitHub 大小写不归一。
- mod jar vs library jar：看包内 `META-INF`（services / `<loader>.mods.toml`），不看文件名。
- maven 坐标 ≠ 分发真身：有的库真正分发在 Modrinth，maven 同坐标是另一回事。
- 「本仓没入库」≠「上游没有」：`list_*_versions` 缺档只代表本仓没抓过。
- 每条出处带 as-of 日期；隔了数月的旧读数引用前重跑。

## 第 4 步 · 产出

- 结构：**结论一句话** / 证据表（每行：论断 → 出处（URL 或工具 + 读数）→ 状态（已核实 / 未核实 / 证伪）→ as-of 日期）/ 对用户工程的影响 / 没查到的部分点名。
- 证伪是结论不是失败：查到「没有」「那个名字是错的」要明写，禁止和稀泥。
- 全文先输出过目，确认后落盘（默认 `docs/research-<主题>.md`）。

## 边界

- 只答事实；「所以做什么内容 / 选哪个玩法」回 mc-grill 让用户拍板。
- 调查不改仓库：要动 `data/**` 或台账属维护侧，另走维护流程。
