---
id: authored/lib-curios
title: Curios 饰品槽集成要点
tags: [curios, trinkets, accessory, equipment, slot, forge, neoforge]
summary: Forge 系饰品槽标准（2850 万下载，Forge/Neo 1.13.2-26.2），tag 驱动扩展槽位、自带 GUI。Fabric 用户读 lib-trinkets，禁止把 Curios 代码拷到 Fabric。
mcHint: 1.13.2-26.2
minecraftVersions: "1.13.2-26.2"
sourceKind: authored
modIds: [curios]
loaders: [forge, neoforge]
modrinthSlug: curios
role: api
skillId: mc-curios
---

# Curios 饰品槽集成要点

自写短文。Curios 的接口、槽位注册与版本细节以 [Curios 官方仓库](https://github.com/TheIllusiveC4/Curios) 当前分支（默认 26.x）与对应 MC 版本 wiki（https://docs.illusivesoulworks.com/category/curios）为准。

## 何时用 / 何时不用

用：Forge / NeoForge 模组需要饰品栏、额外装备槽时。Curios 是 Forge 系饰品槽事实标准（2850 万下载，1.13.2-26.2），tag 驱动扩展槽位、自带背包 GUI，Artifacts、Iron's Spells 'n Spellbooks、Apotheosis 等都在用。

不用：

- **Fabric / Quilt 模组 → 不要用 Curios。** 读 `lib-trinkets`（Fabric 系饰品槽，数据驱动）；Trinkets 停在 1.21.1 后，1.21.4+ 新 Fabric 模组多自研槽位或走原版机制（全览报告 §五）
- 只要 1-2 个固定槽 → 原版组件/NBT 自研可能更轻
- 注意：全览报告 loader 列写作 F/Forge/Neo，但 Curios 官方**没有 Fabric 构建**，Modrinth / CurseForge 文件页只有 Forge 与 NeoForge

## Decision Flow

```
Decision: 饰品槽方案选择
→ 平台 = Fabric / Quilt → 读 lib-trinkets（Trinkets 已停更，评估自研或原版机制），不要用 Curios
→ 平台 = Forge / NeoForge：
   ├─ 1.13.2-26.2 有对应 Curios 构建 → Curios（标准方案）
   ├─ 1.21.5+ 且槽位需求简单 → 评估原版 Data Component 是否够
   └─ 已选 Curios：
        ├─ 依赖：硬依赖 or 软依赖（门闩写法见下）
        ├─ 槽位：tag 驱动注册（以官方为准）或 Curios 提供的注册 API
        └─ GUI：Curios 自带背包扩展栏，你通常不用自绘
```

## Gradle / 声明文件检查顺序

1. `build.gradle`：官方 README 的 maven（`https://maven.theillusivec4.top/`）与坐标（如 `top.theillusivec4.curios:curios-neoforge:<version>` 的 `compileOnly ...:api` + `runtimeOnly`，**以 README 当前文本为准**）
2. artifact 名随加载器变：`curios-forge` / `curios-neoforge`，版本号带 MC 后缀（如 `+1.20.1`、`+26.2`），照文件页抄
3. `mods.toml`（26.x 为 `neoforge.mods.toml`）：`depends` 写 curios；软依赖时标 optional，代码里 `ModList.get().isLoaded("curios")` 门闩（见 `authored/soft-deps-modlist`）
4. 版本核对：1.20.1 与 26.x 的 Curios API 可能有差异，先看该版本 wiki

## 集成要点（伪代码级）

```java
// 软依赖门闩示例（Forge/Neo；类名以官方为准）
if (ModList.get().isLoaded("curios")) {
    // 注册你的物品为饰品：实现 Curios 提供的接口 / 用其注册 API
    // 槽位类型：tag 驱动（data/<modid>/tags/...）或代码注册，以官方文档为准
}
```

- 1.20.x 系 Curios 走 capability 体系，26.x 是否沿用或换接口/组件**以官方为准**，禁止按旧教程硬写
- GUI 仅客户端；服务端只处理槽位数据与装备效果
- 内置 GUI 已处理槽位渲染与交互，别重复造背包界面

## 常见坑

- 把 Curios 代码（capability、接口）拷到 Fabric 工程 → 编译即炸或运行时错误，Fabric 用 Trinkets/自研
- 本意软依赖却漏标 optional → 未装 Curios 无法进档
- 用 1.20.1 教程的 API 写 26.x（或反之）→ 类名/方法对不上
- 在服务端线程引用客户端 GUI 类
- Trinkets 停更后新 Fabric 模组仍依赖 Trinkets（1.21.1 后无更新）

## 自检清单

- 未装 Curios 且声明软依赖：模组正常进档、日志无 Curios 类加载
- 装了 Curios：背包出现对应槽位，物品能放入、能取出、重启不丢
- 装备效果在服务端正确生效（攻击/免疫等逻辑不在客户端）
- 槽位 tag / 注册名与模组文档一致，无重复槽位 ID 警告

## 交叉引用

- MCP：`check_dependencies`、`analyze_mod_jar`、`search_community_docs`
- Skill：`mc-curios`、`mc-item`、`mc-capability`
- 全览：§二.4 饰品/装备槽、§四 Forge 路线；`authored/library-catalog-2026`、`authored/soft-deps-modlist`；Trinkets 见 `lib-trinkets`（未入库时以 https://github.com/emilyploszaj/trinkets 为准）
- 官方：https://github.com/TheIllusiveC4/Curios 、https://docs.illusivesoulworks.com/category/curios
- 不清楚时：打开该 MC 版本的官方 wiki 与示例工程；AGENT_USAGE.md 规则先行
## 核对

- MC 1.20.1 + Forge（curios-forge-5.14.1+1.20.1.jar，2026-08 反编译核对：110 个 java 文件，顶层包 top.theillusivec4.curios）
- 细节仍以官方为准：https://docs.illusivesoulworks.com/category/curios
