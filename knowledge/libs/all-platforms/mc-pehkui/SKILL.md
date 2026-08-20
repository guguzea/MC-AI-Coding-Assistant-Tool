---
name: mc-pehkui
description: Pehkui 实体缩放 API。按 20+ 缩放类型分别控制实体尺寸（身高/宽度/视距/命中盒），平滑过渡动画。触发词：Pehkui、pehkui、缩放、scale、resize、实体尺寸
platforms: [fabric, forge, neoforge, quilt]
mcVersions: ["1.14.4-1.21.1"]
communityDocId: authored/lib-pehkui
mappings: "库按各 loader 预重映射；Fabric ≤1.21.x 为 yarn、Forge 为 MCP，经依赖坐标自动匹配"
---

# Pehkui 实体缩放（操作指引）

给 AI 的操作指引：改变实体（含玩家）尺寸，按缩放类型分别控制并支持平滑过渡。详细信息用 `search_community_docs` 查 `authored/lib-pehkui`，API 细节以 [官方仓库](https://github.com/Virtuoel/Pehkui) 当前 README 与示例为准。

## 何时用 / 何时不用

- 用：需要按类型分控实体尺寸（身高、宽度、视距、命中盒、经验掉落等 20+ 种），或需要平滑过渡动画；目标 MC ≤ 1.21.1
- 不用：目标 MC > 1.21.1（**版本窗口已停**，以 GitHub Releases 为准，评估原版缩放机制如 1.20.5+ 的 scale attribute 或其它方案）；只做简单固定倍率缩放（原版机制够用）

## Decision Flow

```
Decision: 用不用 Pehkui
→ 目标 MC > 1.21.1 → 无新构建，评估原版缩放机制或其他库
→ 简单固定倍率 → 原版实体缩放属性/机制够用
→ 需要分类型缩放 + 平滑过渡 → Pehkui
→ 已选：
   ├─ 平台分支：fabric / forge / neoforge 各装对应构建（Quilt 另有构建，按短文 loaders）
   ├─ 缩放类型：身高/宽度/视距/命中盒/掉落物等按需组合，不是整体一缩了事
   ├─ 过渡：平滑插值动画（时长/缓动参数以 README 为准，不会自动补间）
   └─ 版本：1.14.4-1.21.1 内与 MC 对齐（GitHub Releases / Modrinth 文件页）
```

## 操作步骤

1. 依赖声明：`build.gradle` 照官方 README 配 maven 仓库与坐标（Fabric Loom 用 `modImplementation`，Forge/Neo 照 README 抄）
2. 声明依赖：`fabric.mod.json` / `mods.toml`（26.x 为 `neoforge.mods.toml`）的 `depends` / `suggests` 写 `pehkui`；软依赖门闩见 `authored/soft-deps-modlist`
3. 取缩放 API：按类型设置缩放值（身高/宽度/视距等分开设）；类名、包名与方法签名以官方 README + 示例为准，勿照抄旧版本教程
4. 平滑过渡：设置动画目标与时长/缓动，库负责插值
5. 重置：把对应缩放类型恢复到 1.0 或调取消入口
6. 触发位置：触发逻辑放服务端，客户端与服务端行为由库同步

## 软 / 硬依赖

- 可硬可软：按需声明 `depends`（硬）或 `suggests` + 门闩（软）；未装时不能直接引用 Pehkui 类
- 与同样改实体尺寸的 mod 叠加时缩放值可能互相覆盖，先查冲突面

## 常见错误

- 在 1.21.2+ 找 Pehkui 构建 → 版本窗口停在 1.21.1，以 GitHub Releases 为准
- 只缩了模型没缩命中盒/视距 → 没配对应缩放类型，「看得见打不着」
- 只设终值没有动画 → 平滑过渡需要显式动画入口，不会自动补间
- 缩放类型与玩法需求不匹配 → 外观与交互错位

## 自检清单

- 缩放后外观与命中盒/视距匹配，交互正常
- 平滑过渡动画符合预期（时长/缓动生效）
- 取消缩放后实体恢复原尺寸
- `runServer` 日志无 Pehkui 相关报错

## 参考

- 官方：https://github.com/Virtuoel/Pehkui
- 社区：`search_community_docs` → `authored/lib-pehkui`
- 相关 Skill：`mc-entity`、`mc-renderer`、`mc-cca`
- 不确定时：打开 Pehkui README + 示例，未核对前不写死任何类名/方法签名
