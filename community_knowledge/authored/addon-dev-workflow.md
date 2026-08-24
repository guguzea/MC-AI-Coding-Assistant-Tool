---
id: authored/addon-dev-workflow
title: 附属模组（Addon）开发工作流
tags: [addon, 附属, dependency, fg-deobf, mods-toml, ordering, api, forge, neoforge]
summary: 给既有模组写附属的端到端套路：先决策「硬前置附属 vs 可选集成」；构建期挂宿主（FG fg.deobf / MDG·NG 自动重映射 / 26.1+ 免 deobf 三种记法）；mods.toml 声明 ordering=AFTER 与版本区间策略；只用宿主公开 API；多宿主版本测试矩阵。
mcHint: 思路全版本通用；构建记法按 FG≤1.20.4 / 1.20.5+MDG·NG / 26.1+ 三段区分
sourceKind: authored
---

# 附属模组（Addon）开发工作流

自写短文。工作流综合自 mcmod 教程《用Java代码开发匠魂3附属模组》（[post/3282](https://www.mcmod.cn/post/3282.html)，**禁转载**，仅作思路来源）与本仓库官方文档工具核实；API 细节以 `search_*_docs` 为准。适用对象：为 TiC/Curios/Create/GT 这类带扩展点的模组写附属内容。

## 第一步：决策——做「附属」还是「可选集成」

| 形态 | 前置关系 | 什么时候选 |
|------|----------|------------|
| **硬前置附属**（本篇） | 没有宿主就不启动 | 内容深度绑定宿主机制（新材料/新部件/新配方族） |
| 可选集成 | 有宿主就增强，没有也独立运行 | 兼容层（如 JEI 插件、矿辞兼容） |

可选集成的做法见 `authored/soft-deps-modlist`、`authored/cursemaven-optional-deps`（compileOnly + 运行时探测）。两者可共存：主体是附属，同时对外提供可选集成。

## 第二步：构建期挂上宿主

宿主 jar 要进编译 classpath，但**不能打进你的发布 jar**（`implementation` 语义即可，不要 `shadow`）。三个时代的记法：

| 工具链 | 记法 |
|--------|------|
| ForgeGradle（≤1.20.4） | `implementation fg.deobf("slimeknights.tconstruct:TConstruct:1.18.2-<ver>")` —— 必须包 `fg.deobf`，否则编译对的是混淆名 |
| ModDevGradle / NeoGradle（1.20.5–1.21.x） | 直接 `implementation "..."`（构建插件自动处理反混淆），NeoGradle 用户注意其自己的 notation 形态 |
| NeoForge 26.1+ | 游戏与模组 jar 已是 Mojang 名（去混淆），无需任何 remap/deobf 处理 |

- 宿主不在公共 Maven 时走 `curseMaven`/本地 libs，见 `authored/cursemaven-optional-deps`。
- 同时把宿主的**核心库**也挂上（如 TiC 配 Mantle）：漏挂会在编译期直接缺类。

## 第三步：mods.toml / neoforge.mods.toml 声明前置

```toml
[[dependencies.<你的modid>]]
    modId="tconstruct"
    mandatory=true            # 硬前置：缺失则拒绝启动
    versionRange="[1.18.2-3.6,)"   # 只卡下限，别锁死 patch
    ordering="AFTER"          # 保证在宿主之后初始化
    side="BOTH"
```

- **ordering=AFTER 是附属的标志**：注册顺序敏感（宿主先建好注册表/扩展点，你才能往里加东西）。
- versionRange 策略：卡「已验证兼容的大版本下限」，开放上限但 CI 里测最新；锁死到具体小版本会让宿主一更新你就炸。
- NeoForge 1.20.5+ 的依赖块字段有更名（mandatory→type 等），以当档文档为准。

## 第四步：只碰公开 API

- 宿主一般分 API 包（`tconstruct.library.*` 这类）与内部实现。**只用 API 包**；内部类随小版本必变。
- API 覆盖不到的需求，优先看宿主有没有事件/扩展点（Hook）；实在要用 Mixin 改宿主，见 `authored/mixin-practices-crossplatform` 的兼容性代价表——附属里 mixin 宿主 = 你和宿主每个版本都强耦合。
- 注册你自己的内容仍走标准流程（DeferredRegister 等），只是**内容值**来自宿主 API（如用宿主的 Material 构造新工具）。

## 第五步：测试矩阵

附属的特殊风险是「宿主升级把你弄坏」：

1. 开发环境装「宿主最低支持版 + 最新版」各跑一遍。
2. 启动后重点验证 ordering 生效（你的内容在宿主加载后才出现）。
3. 关注宿主 changelog 里 API 包的破坏性变更；给 versionRange 下限留安全垫。
4. 专用服过一遍（附属常被服务端装）。

## 反模式

- ❌ shadow 进宿主 jar（发布体积爆炸 + 类冲突）。
- ❌ 反射调宿主还叫自己「附属」——那是软集成，走 soft-deps 那套。
- ❌ 复制宿主内部类进自己源码（升级即崩，且侵权风险）。
- ❌ ordering 缺省：注册竞态导致的偶发缺内容最难查。

## 自检

- 删掉宿主启动 → 应当干净报前置缺失（而不是神秘 NoClassDefFoundError 到处飞）。
- 宿主两个版本 × 单人/专用服矩阵通过。
- 发布 jar 解压检查：里面没有宿主的类。

## 不清楚时

- 思路来源（仅浏览，勿抄原文）：https://www.mcmod.cn/post/3282.html （Forge 1.18.2 TiC3 实例）；进阶篇：https://www.mcmod.cn/post/4413.html （TiC3 附属开发进阶）
- 宿主侧 API 文档：TiC/Curios/Create 等各有官方 wiki 或 `search_mod_code` 反编译核验
- 平台 API：`search_forge_docs` / `search_neoforge_docs`（关键词 dependencies, mods.toml）
