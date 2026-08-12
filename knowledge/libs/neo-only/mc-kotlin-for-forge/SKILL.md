---
name: mc-kotlin-for-forge
description: Kotlin for Forge（KFF）语言加载器（NeoForge）。触发词：Kotlin、KFF、kotlinforforge、协程、coroutines、语言加载器
platforms: [neoforge]
mcVersions: ["1.14-26.2"]
communityDocId: authored/lib-kotlin-for-forge
mappings: hint
---

# Kotlin for Forge（NeoForge）

NeoForge 模组用 Kotlin 编写：语言加载器把 Kotlin 标准库、kotlinx-coroutines 运行时带进游戏（约 1.14-26.2）。Modrinth 上 KFF 大量版本同时标 `forge`+`neoforge`，较新版本也有纯 Neo 构建。Fabric 平台用 `mc-fabric-language-kotlin`。

> 本稿位于 `knowledge/libs/neo-only/`，供 NeoForge 解析路径使用。Forge 工程请读 `forge-only/mc-kotlin-for-forge`。

## Decision Flow

```
Decision: NeoForge 用不用 Kotlin
→ platform = fabric / quilt → 读 mc-fabric-language-kotlin（Fabric Language Kotlin）
→ platform = forge → 读 forge-only/mc-kotlin-for-forge（本稿仅 Neo）
→ 团队/代码库用 Java → 不引，避免给玩家加装依赖
→ 要用 Kotlin 写 NeoForge 模组 → Kotlin for Forge
→ 已选：
   ├─ 依赖：neoforge.mods.toml 声明 kotlinforforge（玩家需装语言加载器）
   ├─ 标准库/协程：由 KFF 打包提供，避免自引冲突版本
   └─ 版本：1.14-26.2 内与 MC 对齐；选带 neoforge loader 的文件
```

## 软/硬依赖

- `neoforge.mods.toml`：`depends` 写 kotlinforforge；缺装会启动报错（见 `authored/soft-deps-modlist`）
- kotlin-stdlib / coroutines 不自引，以 KFF 打包版本为准
- 主类与入口结构与 Java 模组等价，只是语言不同；@Mod 注解照常（Neo 注解包名以当前 MDK 为准）
- 协程作用域自己管理，别在客户端线程做阻塞操作

## 官方文档

- 仓库：https://github.com/thedarkcolour/KotlinForForge （README + 示例项目）

## communityDocId 引用

- `authored/lib-kotlin-for-forge`：完整要点，经 MCP `search_community_docs` 读取

## 常见错误

- 玩家未装 KFF：启动报缺语言加载器/缺依赖
- 自引 kotlin-stdlib / coroutines 与 KFF 打包版本冲突
- 平台混淆：Fabric 模组用 KFF（应 FLK），或 Neo 模组误装仅 Forge 的旧文件
- 照抄旧版本教程初始化写法：KFF 随 MC 演进，以当前 README + 示例为准

## 自检

- 启动日志确认 KFF 语言加载器加载成功；Kotlin 主类被识别
- 协程/标准库代码无 NoClassDefFoundError；目标版本能拉到对应 Neo 构建

未核对签名不写死：初始化写法以 KFF README + 示例项目为准。
