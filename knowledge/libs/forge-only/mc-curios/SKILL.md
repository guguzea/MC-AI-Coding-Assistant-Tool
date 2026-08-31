---
name: mc-curios
description: Curios 饰品槽（Forge）。触发词：Curios、饰品槽、accessory、slot、curio、装备槽
platforms: [forge]
mcVersions: ["1.13.2-1.20.6"]
communityDocId: authored/lib-curios
mappings: hint
---

# Curios 饰品槽（Forge）

Forge 饰品槽事实标准（**止于 1.20.6**）：tag 驱动扩展槽位、自带背包 GUI。Artifacts、Iron's Spells 'n Spellbooks、Apotheosis 等都在用。官方**没有** Fabric 构建。Forge 1.21+ / 26.x 请改读 `neo-only/mc-curios`（`curios-neoforge`），不要再写 curios-forge。

> 本稿位于 `knowledge/libs/forge-only/`，供 Forge 解析路径使用。NeoForge 工程请读 `neo-only/mc-curios`（不改解析组映射，靠 neo-only 归属提供）。

## Decision Flow

```
Decision: 饰品槽方案选择
→ platform = fabric / quilt → 本 skill 不适用：读 mc-trinkets（Trinkets），不要用 Curios；Trinkets 已停更于 1.21.1，1.21.4+ 评估自研或原版机制
→ platform = neoforge → 读 neo-only/mc-curios（本稿仅 Forge）
→ platform = forge：
   ├─ 1.13.2–1.20.6 有对应 curios-forge 构建 → Curios（标准方案）
   ├─ Forge 1.21+ / 26.x → 本稿不适用：读 neo-only/mc-curios（curios-neoforge）
   ├─ 1.21.5+ 且槽位需求简单 → 评估原版 Data Component 是否够
   └─ 已选 Curios：
        ├─ 依赖：硬依赖 or 软依赖门闩（ModList.isLoaded("curios")）
        ├─ 槽位：tag 驱动注册（以官方为准）或 Curios 注册 API
        └─ GUI：Curios 自带背包扩展栏，通常不用自绘
```

## 软/硬依赖

- maven：官方 README 的仓库（如 maven.theillusivec4.top）与坐标照抄；`compileOnly ...:api` + `runtimeOnly`，以 README 当前文本为准
- artifact 用 **curios-forge**，版本号带 MC 后缀（如 +1.20.1）。**不要**给 Forge 1.21+ / 26.x 写 curios-forge；那些版本用 `curios-neoforge`（`neo-only/mc-curios`）
- `mods.toml`：`depends` 写 curios；软依赖标 optional + `ModList.get().isLoaded("curios")` 门闩（见 `authored/soft-deps-modlist`）
- 类加载隔离：GUI 仅客户端；服务端只处理槽位数据与装备效果
- 1.20.x 系走 capability 体系，26.x 是否沿用以官方为准，禁止按旧教程硬写

## 官方文档

- 仓库：https://github.com/TheIllusiveC4/Curios
- Wiki：https://docs.illusivesoulworks.com/category/curios

## communityDocId 引用

- `authored/lib-curios`：完整要点（集成流程、自检清单），经 MCP `search_community_docs` 读取

## 常见错误

- 把 Curios 代码拷到 Fabric 工程：编译即炸；Fabric 用 Trinkets/自研（mc-trinkets）
- 本意软依赖却漏标 optional：未装 Curios 无法进档
- 用 1.20.1 教程的 API 写 26.x（或反之）：类名/方法对不上
- 在服务端线程引用客户端 GUI 类
- 新 Fabric 模组仍依赖已停更的 Trinkets（1.21.1 后无更新）

## 自检

- 软依赖时未装 Curios 正常进档、日志无 Curios 类加载
- 装了 Curios：背包出现对应槽位，放入/取出/重启不丢
- 装备效果在服务端生效；槽位 tag/注册名与文档一致，无重复槽位 ID 警告

未核对签名不写死：接口与注册 API 以官方仓库对应 MC 版本分支/wiki 为准。
