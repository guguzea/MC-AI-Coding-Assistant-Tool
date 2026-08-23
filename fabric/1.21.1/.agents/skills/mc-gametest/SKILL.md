---
name: mc-gametest
description: GameTest 结构测试。触发词：GameTest、@GameTest
platform: fabric
version: "1.21.1"
dependencies: []
mappings: yarn
---

# mc-gametest（Fabric 1.21.1）

> 本技能核实源：`data/fabric_1.21.1/fabric-docs/1.21.1/processed/develop_automatic-testing.md`
> 页面 id：`develop-automatic-testing`（gitPath `develop/automatic-testing.md`，FabricMC/fabric-docs 1.21.1 分支，来源 `github_raw_versioned`，官方 raw URL 见 `data/fabric_1.21.1/meta.json`）。
> 官方网页：https://docs.fabricmc.net/develop/automatic-testing （历史版本在站内版本切换）。

## 页面结论（先看这条）

该页（标题 Automated Testing，作者 kevinthegreat1）给出两条自动测试路线：

- **单元测试**：Fabric 提供「Fabric Loader JUnit」——适合测方法、helper 类等代码组件。
- **GameTest（Minecraft 自带结构测试框架）**：与单元测试相对，游戏测试会**真正拉起一个 Minecraft 客户端与服务端**来运行测试，适合测特性与玩法。

页面明确标注 **「目前本指南只覆盖单元测试」**（warning："Currently, this guide only covers unit testing."）。
因此 1.21.1 文档树里 GameTest 只有「存在 + 用途」的定位说明，**没有**结构、注解、接法或运行任务细节。

## 单元测试（页面核实内容）

### 1. 为什么需要 Fabric Loader JUnit

- 模组依赖运行时字节码修改（Mixin 等），直接加 JUnit 跑不起来。
- Fabric Loader JUnit 是 **JUnit 插件**，让单元测试能在 Minecraft 环境下运行。

### 2. build.gradle 两处改动

- ① dependencies 块加入 Fabric Loader JUnit；
- ② 告知 Gradle 使用 Fabric Loader JUnit 执行测试。
- 页面以引用片段给出（`reference/build.gradle` 与 `reference/1.21.1/build.gradle`），本仓库 data 未随附 reference 代码 —— **确切依赖坐标不默写**，以官方页面/`search_fabric_docs` 为准。

### 3. 写测试

- 测试写在 `src/test/java`。
- 命名约定（页面给的两种）：镜像被测类所在包（测 `com/example/docs/codec/BeanType.java` → `com/example/docs/codec/BeanTypeTest.java`，好处是能访问包私有成员）；或用独立 `test` 包（避免 Java module 同包问题）。
- IDE 生成：⌘/Ctrl+N → Generate → Test，方法名通常 `test` 开头；任何「无参、void 返回」的实例方法都会被识别为测试方法，也可手写。
- 断言用 JUnit 5：`org.junit.jupiter.api.Assertions`。
- 测试在**每次 build 自动运行**（含 GitHub Actions 等 CI）。

### 4. 注册表初始化（最常见失败点）

- 访问注册表、或依赖注册表的类（如 `ItemStack`；个别情况还有 `SharedConstants` 等其它 MC 类）时，若 Minecraft 尚未初始化会报错（页面示例即此类日志）。
- 处理：在 `beforeAll` 方法**开头**加一小段初始化代码（片段未随附，从官方正文取，勿默写）。

### 5. GitHub Actions

- 标准 example mod / mod template 工作流下，测试随 `./gradlew build` 运行。
- 构建失败时把报告上传为 artifact（页面给出完整 YAML）：`actions/upload-artifact@v4`，路径 `**/build/reports/` 与 `**/build/test-results/`。

## GameTest（本版未覆盖 → 机制路线，禁止补签名）

**没核实到、按路线处理的条目**：

- GameTest 的具体注解（`@GameTest` 之外的注解体系）、测试结构约定（结构模板/场景类）、Fabric 侧 GameTest 的运行任务、与 `gradle test` 任务的关系：**1.21.1 文档树全部没有**，一律以 `search_fabric_docs version=1.21.1` 为准，禁止默写签名。
- 机制断点（页面可核实部分）：游戏测试运行在真实 client+server 环境；由测试框架执行游戏内场景断言。
- 查证路径（按顺序）：
  1. `search_fabric_docs query=automatic-testing version=1.21.1` → `get_doc_full` 看全文；
  2. `data/fabric_26.1.2` 的 `develop_automatic-testing` 页有完整 Game Tests 章节（Loom `configureTests`、`runClientGameTest` 等）——**只作方向参考，禁止当 1.21.1 签名**；
  3. Fabric API 的 GameTest 相关 Javadocs（26.1.2 页原文亦指向 "See the respective Javadocs in Fabric API for more info"）。
- 禁止把 1.21.4/1.21.8/1.21.10 或 26.1.2 的测试配置当 1.21.1 使用。

## 决策

```
IF 测纯逻辑/组件 → 单元测试：Fabric Loader JUnit + src/test/java + JUnit 5 断言
IF 测玩法/特性 → 本版未核到 GameTest 接法 → 先 search_fabric_docs（version=1.21.1）
IF 核不到 → 停止输出方法名/示例代码，改口官方页面引用
```

## 快速入口

- 注册与生命周期：`mc-registry`、`01-registry.mdc`
- 数据与资源：`mc-datagen`、`mc-datapack`、`generate_*` MCP 工具
- 反模式：`fabric/1.21.1/knowledge/antipatterns/`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-blockentity` | GameTest 常测方块/方块实体行为 |
| `mc-datagen` | 数据生成可配测试结构 |

## 下一步

根据任务打开官方文档全文（`get_doc_full`）或社区短文（遵守 `community_knowledge/AGENT_USAGE.md`）；GameTest 具体写法必须先完成上述「查证路径」。
