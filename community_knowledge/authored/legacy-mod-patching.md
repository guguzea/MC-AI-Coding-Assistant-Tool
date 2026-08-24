---
id: authored/legacy-mod-patching
title: 停更模组修补工作流（数据层 → Mixin 侧载 → Recaf 字节码）
tags: [patching, recaf, bytecode, decompile, abandoned-mod, legacy, maintenance, forge, fabric]
summary: 模组作者停更后的自救路线：先查他改配置/数据包的可行性；再 KubeJS/CrT/Mixin 侧载；最后才对 jar 动字节码（Recaf/创可贴流）。判断停更、反编译定位、补丁边界、许可红线（MIT 可 fork 再发布；自用补丁 vs 再分发）、宿主版本升级的成本。
mcHint: 全版本通用；Recaf 系通用字节码工具（MIT），配 Minecraft 模组时代无关
sourceKind: authored
---

# 停更模组修补工作流

自写短文。思路依据 mcmod 教程《利用创可贴和 Recaf 修改停更模组》（[post/3012](https://www.mcmod.cn/post/3012.html)，默认 BY-NC-SA，作思路来源）；工具事实已核实：Recaf（https://github.com/Col-E/Recaf ，**MIT**，★7k+，字节码编辑器）、本仓库 `analyze_mod_jar`/`decompile_mod_jar`/`search_mod_code`（需 Java 17+ 工具链）。**修补 = 最后手段**，顺序别反。

## 第零零步：先确认真的停更了

- GitHub 最后提交 / CurseForge 最后更新时间 / 作者声明；失联 ≠ 真弃坑，先等或 PR 合作。
- 判别口诀：**是否影响核心玩法**；小 bug 别大动干戈。
- 停更判定后仍先走**非侵入路**（下面第 1–2 级），它们能被后续版本重复利用；字节码补丁必须随每个宿主版本重做。

## 修补优先级（从轻到重）

| 级别 | 手段 | 适用 | 成本/风险 |
|------|------|------|-----------|
| 1 | 配置/数据包/资源包 | 数值、配方、生成、文本 | 零；官方支持路径 |
| 2 | KubeJS / CraftTweaker / 数据包覆盖 | 配方、事件钩子、复合行为 | 低；注意与模组自身逻辑打架 |
| 3 | **Mixin 侧载**（不碰原 jar） | 改原版类/模组内部逻辑 | 中；签名随映射变、需 loader 支持（老 Forge 用 MixinBooter，见 `authored/mixin-practices-crossplatform` 启用方式表） |
| 4 | **字节码直改**（Recaf 流） | 作者封死、无 hook、库内嵌死逻辑 | 高；每个版本重做、不可调试 |

3012 教程演示的正是第 4 级：作者停更、用户只能改 jar。**先用完 1–3 级再说**——很多“必须改代码”的需求其实数据层就能解。

## 第 4 级实战：Recaf 改字节码

1. **反编译定位**：`decompile_mod_jar` / `analyze_mod_jar`（仓库 MCP 工具）打开 jar，找到出问题的类/方法。先在配置层排查一遍，确认没有现成开关。
2. **工具**：Recaf（MIT）——图形化浏览/编辑 class 字节码，支持反编译视图直接改方法体再重编译保存，比纯 ASM 手写友好；教程里还配合「创可贴」（Sidebar 修补补丁类工具）做小补丁。
3. **改动原则**：只改最小方法体；优先 `RETURN`/常量级修改（如 `isValid` 恒真、数值上限），避免改复杂逻辑分支；改完**先 diff 反编译对照**，确认没改动无关字节码。
4. **打包**：换回原 jar 内 class（或重打 jar），保持包路径不变；refmap/mixin 配置别碰（如果你没加 Mixin）。
5. **验证**：日志过、专用服过、原版环境冒烟；改错了会 NoClassDefFound/VerifyError 崩溃，现场保留原 jar 便于回滚。

## 许可红线（必读）

- **代码许可 ≠ 帖子转载协议**：MC百科帖子说“禁止转载”只约束文字；模组 jar 的 LICENSE（MIT/其他）才决定你能不能改和发。改之前**先看模组自己的 LICENSE/README**。
- MIT/Apache 类：fork + 修改 + 再发布合法，注明出处即可（Recaf 本身 MIT，安全）。
- 无许可/自定义后门许可：**自用补丁**通常灰色可接受；**再分发补丁 jar** 风险高（若涉商用/社区分发先征得作者或按许可处理）。
- 补丁自用原则：不发布、不署名原作者为修改者、改动留档。

## 维护成本与最终决策

- 字节码补丁与宿主版本**强绑定**：宿主/加载器一升级，补丁可能失效甚至崩游戏——记录你改的是哪个类哪个方法，便于重做。
- 两条出路：**长期修补**（接受维护）或 **fork 重写**（许可允许时，把改动反编译成源码再维护，反而更稳）；fork 重写的工作量×质量请从「是否值得养」角度拍板——这是人在环决策，别替用户决定。

## 反模式

- ❌ 跳过配置层直接改字节码（300 个可能配置开关里就有一个）。
- ❌ 用反射硬调私有方法比 Mixin 更脆弱？—— 都脆弱，按可行性看下 Mixin 侧载再决定。
- ❌ 改完就删原 jar 备份，也不留 diff 记录（改完回不到官方基线）。
- ❌ 把「能用」当「完成了」：多版本宿主（1.20.1/1.21）之间补丁不可通，逐版本记录。

## 自检

- 原 jar 备份 + 补丁记录（类/方法/改动对照）。
- 干净环境 + 专用服各一次冒烟。
- 确认 mod 的 LICENSE 支持当前用途（自用 vs 分发）。

## 不清楚时

- 思路来源（仅外链）：https://www.mcmod.cn/post/3012.html
- Recaf：https://github.com/Col-E/Recaf （MIT）
- 反编译工具：本仓库 `decompile_mod_jar` / `analyze_mod_jar` / `search_mod_code`；先调 `get_server_status` 确认工具链（Java 17+）
- Mixin 侧载细节：`authored/mixin-practices-crossplatform`（各平台启用方式一节）
