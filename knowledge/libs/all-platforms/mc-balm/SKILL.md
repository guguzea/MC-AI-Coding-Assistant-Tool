---
name: mc-balm
description: Balm 跨加载器抽象层（Blay）。注册/事件/网络/配置/按键一码多端，零第三方依赖。触发词：Balm、balm、跨平台抽象、Waystones、Blay、cross-platform
platforms: [fabric, forge, neoforge]
mcVersions: ["1.18-26.2"]
communityDocId: authored/lib-balm
mappings: "库按各 loader 预重映射；公共代码禁止 import 平台类，映射差异由 Balm 隔离"
---

# Balm 跨平台抽象（操作指引）

给 AI 的操作指引：一码多端（Fabric + Forge + NeoForge）且愿意跟随 Blay 体系时，用 Balm 统一注册/事件/网络/配置/按键/模型加载的平台差异。详细信息用 `search_community_docs` 查 `authored/lib-balm`，API 细节以 [官方仓库](https://github.com/BlayTheNinth/Balm) 当前 README 与示例 mod（Waystones 源码是现成范例）为准。

## 何时用 / 何时不用

- 用：目标 = F/Forge/Neo 一码多端；愿意跟随 Blay 生态（Waystones、Comforts 等 20+ 模组共用）；**零第三方依赖**
- 不用：需要 Quilt 支持（Balm 无 Quilt 构建，见短文 loaders）；已有 Architectury 体系（定位重叠，别双引两套抽象层）；只要个别平台能力且版本超窗（单平台直接写原生 API 更稳）

## Decision Flow

```
Decision: 要不要用 Balm
→ 需要 Quilt → 不用 Balm（Architectury 或自研）
→ 目标 = F/Forge/Neo 一码多端，跟 Blay 生态 → Balm
→ 目标 = 一码多端但已有 Architectury → 保持 Architectury，别混用（见 mc-architectury）
→ 已选 Balm：
   ├─ 版本：1.18-26.2 内与 MC 对齐（Modrinth / CurseForge 文件页）
   ├─ 平台差异：一律走 Balm 抽象 API，禁止在公共代码里直接调平台类
   └─ 依赖：硬依赖 or 软依赖门闩（见下）
```

## 操作步骤

1. 依赖声明：`build.gradle` 照官方 README 的仓库与坐标；Fabric 用 Loom 的 `modImplementation`，Forge/Neo 用对应依赖配置
2. 声明依赖：`mods.toml`（26.x 为 `neoforge.mods.toml`）的 `depends` 写 `balm`；软依赖用 `ModList.get().isLoaded("balm")` 门闩（见 `authored/soft-deps-modlist`）；`fabric.mod.json` 写 `depends` 或 `suggests`
3. 公共代码写业务：注册用 Balm 注册入口（类似 DeferredRegister 语义）；事件监听 Balm 抽象事件，不直接挂平台事件总线；网络用 Balm 网络 API 定义包与处理器（公共代码只写一次）；配置用 Balm 配置 API，不手写 ForgeConfigSpec 等平台配置
4. 客户端专用逻辑（按键、模型加载）仍要守 `Dist.CLIENT` 门闩，Balm 只是帮你包一层
5. 自查抽象漏点：公共代码里出现平台类 import（`net.minecraftforge...` / `net.fabricmc...`）就是抽象层漏了
6. 版本核对：Balm 的 API 随 MC 版本演进，1.18 与 26.2 差异大，抄坐标前先看该版本 README 分支

## 软 / 硬依赖

- 硬依赖：`depends` 写 balm；只 `compileOnly` 却当硬依赖用 → 未装 Balm 时 `NoClassDefFoundError`
- 软依赖：门闩 + `suggests`，未装时模组正常进档且不加载 Balm 类
- 禁止与 Architectury 混用两套抽象 → 事件/网络双份注册，行为不可预测

## 常见错误

- 公共代码直接 import 平台类 → 换端编译即炸
- 只 `compileOnly` 引 Balm 却当硬依赖用 → 运行时 `NoClassDefFoundError`
- 版本与 MC 不匹配（用 1.20.1 的 Balm 配 26.x）→ 启动即崩或 API 缺失
- 与 Architectury 混用两套抽象 → 行为不可预测

## 自检清单

- 未装 Balm（若软依赖）：模组正常进档，不加载 Balm 类
- 仅装 Balm：注册内容（方块/物品）正常出现，服务端无异常
- 三端（Fabric/Forge/Neo）同一份公共代码都能编译运行
- 配置改动保存后重进保留，网络包双端都能收发

## 参考

- 官方：https://github.com/BlayTheNinth/Balm
- 社区：`search_community_docs` → `authored/lib-balm`；相关短文：`authored/lib-architectury`（对比）、`authored/soft-deps-modlist`（门闩）
- 相关 Skill：`mc-registry`、`mc-networking`、`mc-config`、`mc-events`、`mc-architectury`
- 不确定时：打开 Balm README + 示例 mod（Waystones 源码），未核对前不写死任何类名/方法签名
