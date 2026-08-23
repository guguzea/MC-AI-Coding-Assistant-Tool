---
name: mc-gametest
description: GameTest 结构测试。触发词：GameTest、@GameTest
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# mc-gametest（Fabric 1.21.11）

> 核实源：`data/fabric_1.21.11/fabric-docs/1.21.11/processed/develop_automatic-testing.md`（id `develop-automatic-testing`）与 `develop_loom_fabric-api.md`（id `develop-loom-fabric-api`，Tests 小节）。
> 官方 URL：https://docs.fabricmc.net/develop/automatic-testing 、https://docs.fabricmc.net/develop/loom/fabric-api#tests 。
> 本档（1.21.11）automatic-testing 页**同时覆盖单元测试与 Game Tests**——与 26.1.2 同构，**不同于** 1.21.1（该页只覆盖单元测试）。
> 本包 `mappings: yarn`；页面名多为 Mojang/官方风格，Yarn 换算以 `search_fabric_docs version=1.21.11` 为准，禁止默写。

## 两条路的定位（页首核实）

- **单元测试**（Fabric Loader JUnit）：测方法/helper 类等代码组件。
- **Game Tests**：Minecraft 自带 GameTest 框架测**服务端**特性；Fabric 额外提供**客户端 GameTest**，类似端到端测试。

## 单元测试（本版页面核实）

- Mixin 等字节码修改 → 需 Fabric Loader JUnit（JUnit 插件）。
- build.gradle 两处：① dependencies 加 Fabric Loader JUnit；② 配置 Gradle 用其执行测试。
- 测试在 `src/test/java`；命名镜像被测包（`BeanTypeTest`）或独立 test 包；无参 void 实例方法即测试方法；断言 `org.junit.jupiter.api.Assertions`。
- 注册表依赖类（如 `ItemStack`）需在 `beforeAll` 开头初始化；否则报 Minecraft 未初始化。
- 每次 build 自动运行（含 CI）；GHA 失败上传 `**/build/reports/` + `**/build/test-results/`（`actions/upload-artifact@v4`，页面给出 YAML）。

## Game Tests（本版已核实）

### 用 Loom 开启（loom 页 Tests 小节）

- 基础：`fabricApi { configureTests() }` → 生成**两个 run 配置**（服务端 GameTest + 客户端 GameTest）。
- 可选配置（字段与默认值见页面）：`createSourceSet`（默认 false；true 时须设 `modId`——**测试源集所用 mod 的 id，不是主 mod id**，默认模块名 `gametest`）；`enableGameTests`（默认 true，Vanilla Game Test 框架）；`enableClientGameTests`（默认 true，Fabric API Client Test 框架）；`eula`（默认 false）；`clearRunDirectory`（默认 true，仅客户端测试生效）；`username`（默认 `Player0`）。

### 目录与文件（开发页核实）

- 开启 `createSourceSet`：独立 source set + 独立 `fabric.mod.json`（`src/gametest/resources/`）；测试类在 `src/gametest/java`。
- 页面示例同时期望服务端/客户端测试类（例名 `ExampleModGameTest` / `ExampleModClientGameTest`——示例命名，可调整）。
- 具体注解/回调细节 → 页面原文指向 **"See the respective Javadocs in Fabric API for more info"**——**注解签名以 Fabric API Javadocs 为准，本页未给，禁止默写**。

### 运行（开发页核实）

- 服务端 GameTest：**随 `build` Gradle 任务自动运行**（含 GHA 的 build workflow）。
- 客户端 GameTest：`runClientGameTest` Gradle 任务；CI 需额外 snippet + job（Loom production run tasks）。
- **已知坑（页面警告）**：GHA 上可能因 network synchronizer 报错失败 → 在 production run task 的 JVM args 加 `-Dfabric.client.gametest.disableNetworkSynchronizer=true`。

## 与 1.21.1 差异（本版要点）

- 1.21.1 的 automatic-testing 页只有单元测试（「仅覆盖单元测试」警告）；本档页与 26.1.2 同构（含 Game Tests 完整章节与 GHA 坑注记）。
- `query_api` 无本档索引（`query_api` 约覆盖 1.16.5–1.20.4）；本档唯一查证口径 = `search_fabric_docs`（version=1.21.11）。

## 决策

```
IF 测纯逻辑 → 单元测试（Fabric Loader JUnit）
IF 测服务端特性 → GameTest：configureTests + 服务端类；随 build 跑
IF 测客户端特性 → 客户端 GameTest：enableClientGameTests + runClientGameTest
IF 注解/回调细节 → Fabric API Javadocs / search_fabric_docs（version=1.21.11），核不到禁止输出
```

## 下一步

- 取得全文：`get_doc_full`（id `develop-automatic-testing` / `develop-loom-fabric-api`）；复核后再输出示例代码。
