---
name: mc-fabric-language-kotlin
description: Fabric Language Kotlin（FLK）Kotlin 语言加载器。触发词：Kotlin、FLK、fabric-language-kotlin、协程、coroutines、语言加载器
platforms: [fabric, quilt]
mcVersions: ["1.14-26.2"]
communityDocId: authored/lib-fabric-language-kotlin
mappings: hint
---

# Fabric Language Kotlin（Fabric/Quilt）

Fabric 模组用 Kotlin 编写：提供 Kotlin 标准库与 kotlinx-coroutines 运行时（1.14-26.2），玩家装 FLK 即可运行 Kotlin 模组。Forge/Neo 平台用 mc-kotlin-for-forge。

## Decision Flow

```
Decision: Fabric 用不用 Kotlin
→ platform = forge / neoforge → 读 mc-kotlin-for-forge（Kotlin for Forge）
→ 团队/代码库用 Java → 不引，避免给玩家加装依赖
→ 要用 Kotlin 写 Fabric 模组 → Fabric Language Kotlin
→ 已选：
   ├─ 构建：Loom + Kotlin 插件，照官方文档配
   ├─ 依赖：fabric.mod.json 声明 fabric-language-kotlin（玩家需装语言加载器）
   ├─ 标准库/协程：由 FLK 提供，避免自引冲突版本
   └─ 版本：1.14-26.2 内与 MC 对齐
```

## 软/硬依赖

- `fabric.mod.json` 入口：`adapter: "kotlin"` + `value`（Kotlin 主类），不是 Java 字符串入口原样；`depends` 写 fabric-language-kotlin 为硬依赖
- kotlin-stdlib / coroutines 不自引，以 FLK 打包版本为准
- 协程作用域自己管理，避免在渲染线程阻塞

## 官方文档

- 仓库：https://github.com/FabricMC/fabric-language-kotlin （README + 官方示例）

## communityDocId 引用

- `authored/lib-fabric-language-kotlin`：完整要点，经 MCP `search_community_docs` 读取

## 常见错误

- 玩家未装 FLK：启动报缺依赖/类加载失败
- 自引 kotlin-stdlib / coroutines 与 FLK 打包版本冲突
- 平台混淆：Forge 模组用 FLK（应 KFF），或 Fabric 模组用 KFF
- 照抄旧版本教程入口写法：FLK 随 MC 演进，以当前 README 为准

## 自检

- 启动日志确认 FLK 语言加载器加载成功；Kotlin 入口点被识别
- 协程/标准库代码无 NoClassDefFoundError；目标版本能拉到对应构建

未核对签名不写死：初始化写法以 FLK README + 官方示例为准。
