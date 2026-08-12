---
id: authored/lib-architectury
title: Architectury 跨加载器抽象要点
tags: [architectury, multiloader, expectplatform, common, forge, fabric, neoforge, quilt]
summary: 一码多端抽象层（9170 万下载，F/Forge/Neo/Quilt 1.16.5-26.2），@ExpectPlatform + common 源集纪律 + 90+ 事件钩子，配合 Architectury Loom/Plugin；与 Balm 二选一。
mcHint: 1.16.5-26.2
minecraftVersions: "1.16.5-26.2"
sourceKind: authored
modIds: [architectury]
loaders: [fabric, forge, neoforge, quilt]
modrinthSlug: architectury-api
role: api
skillId: mc-architectury
---

# Architectury 跨加载器抽象要点

自写短文。API 细节以 [Architectury 官方文档](https://docs.architectury.dev/) 与 [architectury-templates](https://github.com/architectury/architectury-templates) 为准。

## 何时用 / 何时不用

用：同一套逻辑要发 Fabric + Forge + NeoForge（+ Quilt）多个加载器，且不想维护多份代码。Architectury API 提供 90+ 事件钩子、网络/注册抽象与 `@ExpectPlatform`（9170 万下载，1.16.5-26.2），REI、Waystones、Farmer's Delight (Fabric)、Carry On 都在用。

不用：

- 单平台模组 → 直接用该平台 API，别引 Architectury
- 跟随 Blay 生态（Waystones、Nether Portal Fix、Comforts 等）→ 用 **Balm**（5420 万下载，零第三方依赖），Architectury 与 Balm 二选一，别混
- 纯 Fabric 且内容简单 → Fabric API 足够

## Decision Flow

```
Decision: 跨平台方案
→ 平台数 = 1 → 单平台开发，跳过
→ 平台数 ≥ 2 且跟随 Blay 体系 → Balm
→ 平台数 ≥ 2 其他情况 → Architectury：
   ├─ 工程：architectury-plugin + Architectury Loom（或官方模板）
   ├─ 源集：common / forge / fabric / neoforge（按需）
   ├─ 平台差异：@ExpectPlatform 或事件钩子抽象；覆盖不了的写平台源集实现
   └─ 版本：1.16.5-26.2 内与 MC 对齐（Modrinth 文件页）
```

## Gradle / 声明文件检查顺序

1. 模板优先：从 architectury-templates 起工程（或 `port_project` 的 `init_architectury`），比手拼 Gradle 稳
2. `build.gradle`：architectury-plugin 与 loom 插件版本、`common` 源集配置，以模板为准
3. 依赖声明：`mods.toml` / `fabric.mod.json` 的 `depends` 写 architectury（其 modId 为 `architectury`）
4. 映射：Fabric 侧 Yarn 与 Forge/Neo 侧 Mojang/MCP 由工具链各自处理，common 里别写死映射差异符号
5. 先跑 `analyze_porting_path` 看工程是否适合抽 common（识别平台/版本/Mappings/Architectury 与风险）再决定

## 集成要点（伪代码级）

```java
// common 源集：只 import 平台无关 + net.architectury.* 抽象
// @ExpectPlatform：common 里声明 static 方法（注解名以官方为准），平台源集提供同名实现
@ExpectPlatform
static Something createSomething() { throw new AssertionError("平台实现缺失"); }
// forge / fabric / neoforge 源集：分别写同名同签名的真实实现，
// 构建期 Architectury transformer 把 common 的 stub 替换掉（以官方文档为准）
```

- common 纪律：禁止 `import net.minecraftforge.*` / `net.fabricmc.*` / `net.neoforged.*`
- 事件钩子：优先用 Architectury 的事件抽象（90+ 钩子，具体列表见官方文档），覆盖不了的走平台源集
- 网络：用 Architectury 网络抽象，别在 common 里碰各平台 channel 细节

## 常见坑

- common 里直接 import 平台类 → 另一侧编译失败
- `@ExpectPlatform` 平台实现与 common stub 类名/签名不一致 → 构建或运行时错误
- 不用 Architectury Loom/Plugin 而手工拼两个工程 → transformer 缺失，运行时缺类
- 单平台却引入 Architectury → 无谓的依赖面
- 移植时跳过 `analyze_porting_path` 直接手抄 → 映射与源集结构错位

## 自检清单

- 各平台源集编译通过，各平台 `runClient` 能启动
- 平台实现方法名/签名与 common stub 完全一致（不一致时构建工具会提示）
- Fabric 端启动不加载 forge 类（无 `NoSuchMethodError` / 类冲突）
- `mods.toml` / `fabric.mod.json` 均声明了 architectury 依赖

## 交叉引用

- MCP：`analyze_porting_path`、`port_project`（init_architectury，默认 dryRun）、`convert_mapping`、`get_migration_guide`
- Skill：`mc-architectury`；相关：`mc-networking`、`mc-registry`
- 全览：§二.3 跨加载器抽象层、§四；`authored/library-catalog-2026`、`authored/library-integration`
- 官方：https://docs.architectury.dev/ 、https://github.com/architectury/architectury-templates
- 不清楚时：打开官方文档对应版本 + 模板 diff；AGENT_USAGE.md 规则先行
## 核对

- MC 1.20.1 + Fabric（architectury-9.2.14-fabric.jar，2026-08 反编译核对：256 个 java 文件，顶层包 dev.architectury；entrypoints：dev.architectury.utils.fabric.GameInstanceImpl / dev.architectury.init.fabric.ArchitecturyServer / dev.architectury.init.fabric.ArchitecturyClient）
- 细节仍以官方为准：https://docs.architectury.dev/
