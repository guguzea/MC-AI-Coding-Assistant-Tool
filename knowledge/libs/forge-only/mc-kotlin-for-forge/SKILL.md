---
name: mc-kotlin-for-forge
description: Kotlin for Forge（KFF）语言加载器（Forge）。触发词：Kotlin、KFF、kotlinforforge、协程、coroutines、语言加载器
platforms: [forge]
mcVersions: ["1.14-1.21.10"]
communityDocId: authored/lib-kotlin-for-forge
mappings: hint
---

# Kotlin for Forge（Forge）

Forge 模组用 Kotlin 编写：语言加载器把 Kotlin 标准库、kotlinx-coroutines 运行时带进游戏（1.14-1.21.10），玩家装 KFF 即可运行 Kotlin 模组。Fabric 平台用 `mc-fabric-language-kotlin`。

> 版本区间口径：以 `library-catalog.ts` 的 `verifiedApi` 实测键为准（最低 1.14、最高 1.21.10）。
> ⚠️ **勿凭「classic Forge 止于 1.20.4」推断上界**——Forge 51.x=1.21、52.x=1.21.1 真实存在
> （本仓 `forge/1.21.1/` 草稿树即证据），catalog 中 KFF 确有 1.21.10 记录。
> catalog 里 KFF 是**单一条目**（`loaders: [forge, neoforge]`），未按 loader 拆分，
> 故 forge-only 与 neo-only 两档取同一区间；将来若按 loader 分别核实再各自收紧。

> 本稿位于 `knowledge/libs/forge-only/`，供 Forge 解析路径使用。NeoForge 工程请读 `neo-only/mc-kotlin-for-forge`。

## Decision Flow

```
Decision: Forge 用不用 Kotlin
→ platform = fabric / quilt → 读 mc-fabric-language-kotlin（Fabric Language Kotlin）
→ platform = neoforge → 读 neo-only/mc-kotlin-for-forge（本稿仅 Forge）
→ 团队/代码库用 Java → 不引，避免给玩家加装依赖
→ 要用 Kotlin 写 Forge 模组 → Kotlin for Forge
→ 已选：
   ├─ 依赖：mods.toml 声明 kotlinforforge（玩家需装语言加载器）
   ├─ 标准库/协程：由 KFF 打包提供，避免自引冲突版本
   └─ 版本：1.14-26.2 内与 MC 对齐
```

## 软/硬依赖

- `mods.toml`：`depends` 写 kotlinforforge；缺装会启动报错（见 `authored/soft-deps-modlist`）
- kotlin-stdlib / coroutines 不自引，以 KFF 打包版本为准
- 主类与入口结构与 Java 模组等价，只是语言不同；@Mod 注解照常
- 协程作用域自己管理，别在客户端线程做阻塞操作

## 官方文档

- 仓库：https://github.com/thedarkcolour/KotlinForForge （README + 示例项目）

## communityDocId 引用

- `authored/lib-kotlin-for-forge`：完整要点，经 MCP `search_community_docs` 读取

## 常见错误

- 玩家未装 KFF：启动报缺语言加载器/缺依赖
- 自引 kotlin-stdlib / coroutines 与 KFF 打包版本冲突
- 平台混淆：Fabric 模组用 KFF（应 FLK），或 Forge 模组用 FLK
- 照抄旧版本教程初始化写法：KFF 随 MC 演进，以当前 README + 示例为准

## 自检

- 启动日志确认 KFF 语言加载器加载成功；Kotlin 主类被识别
- 协程/标准库代码无 NoClassDefFoundError；目标版本能拉到对应构建

未核对签名不写死：初始化写法以 KFF README + 示例项目为准。
