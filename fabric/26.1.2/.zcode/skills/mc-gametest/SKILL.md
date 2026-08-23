---
name: mc-gametest
description: Fabric 26.1.2 mc-gametest。核不到则 search_fabric_docs version=26.1.2，禁止输出。
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# mc-gametest（Fabric 26.1.2）

> 核实源：`data/fabric_26.1.2/fabric-docs/26.1.2/processed/develop_automatic-testing.md`（id `develop-automatic-testing`，作者 kevinthegreat1）与 `develop_loom_fabric-api.md`（id `develop-loom-fabric-api`，Tests 小节）。
> 官方 URL：https://docs.fabricmc.net/develop/automatic-testing 、https://docs.fabricmc.net/develop/loom/fabric-api#tests 。
> 本版（26.1.2，去混淆官方名）automatic-testing 页**同时覆盖单元测试与 Game Tests**——比 1.21.1 页多出完整游戏测试章节。

## 两条路的定位（页首核实）

- **单元测试**（Fabric Loader JUnit）：测方法/helper 类等代码组件。
- **Game Tests**：Minecraft 自带 GameTest 框架测**服务端**特性；Fabric 额外提供**客户端 GameTest**，类似端到端测试。
- 本版页首**没有**「仅覆盖单元测试」警告（1.21.1 页有）。

## 单元测试（与本版页面核实）

- 依赖 Mixin 等字节码修改 → 需 Fabric Loader JUnit（JUnit 插件）。
- build.gradle 两处：① dependencies 加 Fabric Loader JUnit；② 配置 Gradle 用其执行测试。
- 测试在 `src/test/java`；命名镜像被测包（`BeanTypeTest`）或独立 test 包；无参 void 实例方法即测试方法；断言 `org.junit.jupiter.api.Assertions`。
- 注册表依赖类（如 `ItemStack`）需在 `beforeAll` 开头初始化；否则 Minecraft 未初始化报错。
- 每次 build 自动运行（含 CI）；GHA 失败上传 `**/build/reports/` + `**/build/test-results/`（`actions/upload-artifact@v4`）。

## Game Tests（本版已核实）

### 用 Loom 开启（develop_loom_fabric-api 页 Tests 小节）

- 基础：`fabricApi { configureTests() }` → 生成**两个 run 配置**（服务端 GameTest + 客户端 GameTest）。
- 可选配置项（页面列出的字段、默认值与含义）：
  - `createSourceSet`（默认 false）：为测试新建 source set；true 时须设 `modId`——**注意该 modId 是测试源集所用 mod 的 id，不是主 mod id**（默认模块名 `gametest`）；
  - `enableGameTests`（默认 true）：服务端 GameTest，用 **Vanilla Game Test 框架**；
  - `enableClientGameTests`（默认 true）：客户端 GameTest，用 **Fabric API Client Test 框架**；
  - `eula`（默认 false）：同意 MC EULA 才能跑；
  - `clearRunDirectory`（默认 true，仅 enableClientGameTests 生效）；
  - `username`（默认 `Player0`）：客户端测试用户名。

### 目录与文件（开发页核实）

- 开启 `createSourceSet` 时 GameTest 在独立 source set：独立的 `fabric.mod.json` 放 `src/gametest/resources/`；测试类在 `src/gametest/java`。
- 页面示例同时期望服务端测试类与客户端测试类（例名：`ExampleModGameTest` / `ExampleModClientGameTest`——示例命名，可按需调整）。
- 具体注解/回调细节，页面原文指向 **"See the respective Javadocs in Fabric API for more info"**——注解签名以 Fabric API Javadocs 为准，**禁止默写**（本页未给）。

### 运行（开发页核实）

- 服务端 GameTest：**随 `build` Gradle 任务自动运行**（含 GitHub Actions 的 build workflow）。
- 客户端 GameTest：`runClientGameTest` Gradle 任务；CI 上需额外 snippet + job（走 Loom production run tasks）。
- **已知坑（页面警告）**：GameTest 在 GitHub Actions 上可能因 **network synchronizer 报错**失败 → 在 production run task 的 JVM args 加 `-Dfabric.client.gametest.disableNetworkSynchronizer=true`。

## 与 1.21.x 差异（本版要点）

- 26.1.2 为去混淆官方名（本包 `mappings: official`）；`search_fabric_docs` 是本版唯一文档口径（`query_api` 无本版索引）。
- 1.21.1 的 automatic-testing 页**只有单元测试**；GameTest 接线以本版页 + Loom 页为准，禁止把 1.21.1 的「未覆盖」状态当结论。

## 决策

```
IF 测纯逻辑 → 单元测试（Fabric Loader JUnit）
IF 测服务端特性 → GameTest：configureTests + 服务端类；随 build 跑
IF 测客户端特性 → 客户端 GameTest：enableClientGameTests + runClientGameTest
IF 注解/回调细节 → Fabric API Javadocs / search_fabric_docs（version=26.1.2），核不到禁止输出
```

## 下一步

- 取得全文：`get_doc_full`（id `develop-automatic-testing` / `develop-loom-fabric-api`）；`search_fabric_docs`（version=26.1.2）复核后输出示例。
