---
name: mc-architectury
description: Architectury 跨加载器抽象。触发词：Architectury、多加载器、multiloader、@ExpectPlatform、一码多端、common 源集、architectury-plugin、architectury-loom
platforms: [fabric, forge, neoforge]
mcVersions: ["1.20.1+"]
communityDocId: authored/lib-architectury
mappings: hint
---

# Architectury 跨加载器抽象

同一套逻辑发 Fabric + Forge + NeoForge（+ Quilt）多端时用 Architectury（9170 万下载，1.16.5-26.2）：90+ 事件钩子、网络 / 注册抽象与 @ExpectPlatform。工程骨架以官方模板为准。

## Decision: 跨平台方案

```
IF 平台数 = 1 → 单平台开发，跳过 Architectury
IF 平台数 ≥ 2 且跟随 Blay 生态（Waystones、Comforts 等）→ Balm（零第三方依赖）
IF 平台数 ≥ 2 其他情况 → Architectury：
   ├─ 工程：architectury-plugin + Architectury Loom（或 architectury-templates 起手）
   ├─ 源集：common / forge / fabric / neoforge（按需）
   ├─ 平台差异：@ExpectPlatform 或事件钩子抽象；覆盖不了的写平台源集
   └─ 版本：1.16.5-26.2 内与 MC 对齐（Modrinth 文件页）
```

## common 源集纪律（最重要）

- common 只 import 平台无关 + net.architectury.* 抽象；禁止 import net.minecraftforge.* / net.fabricmc.* / net.neoforged.*
- 网络：用 Architectury 网络抽象，别在 common 里碰各平台 channel 细节
- 映射：Fabric 侧 Yarn 与 Forge/Neo 侧 Mojang/MCP 由工具链各自处理，common 里别写死映射差异符号

## 软 / 硬依赖

- `mods.toml` / `fabric.mod.json` 的 `depends` 写 architectury（modId 为 `architectury`）
- 工程结构用官方模板或 `port_project` 的 `init_architectury`（默认 dryRun），比手拼 Gradle 稳
- 先跑 `analyze_porting_path` 看工程是否适合抽 common（平台 / 版本 / Mappings / 风险）

## 集成要点（伪代码级）

```java
// @ExpectPlatform：common 里声明 static 方法（注解名以官方为准），平台源集提供同名实现
@ExpectPlatform
static Something createSomething() { throw new AssertionError("平台实现缺失"); }
// forge / fabric / neoforge 源集分别写同名同签名真实实现
// 构建期 Architectury transformer 把 common 的 stub 替换（以官方文档为准）
```

## 官方文档

- https://docs.architectury.dev/
- 模板：https://github.com/architectury/architectury-templates

## 常见错误

- common 里直接 import 平台类 → 另一侧编译失败
- @ExpectPlatform 平台实现与 common stub 类名 / 签名不一致 → 构建或运行时错误
- 不用 Architectury Loom / Plugin 而手工拼工程 → transformer 缺失，运行时缺类
- 单平台却引入 Architectury → 无谓的依赖面
- 移植时跳过 analyze_porting_path 直接手抄 → 映射与源集结构错位

## 相关

- 短文：`authored/lib-architectury`、`authored/library-integration`、`authored/library-catalog-2026`
- Skill：`mc-networking`、`mc-registry`
- MCP：`analyze_porting_path`、`port_project`、`convert_mapping`、`get_migration_guide`
