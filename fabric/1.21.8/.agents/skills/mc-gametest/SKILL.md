---
name: mc-gametest
description: GameTest 结构测试。触发词：GameTest、@GameTest
platform: fabric
version: "1.21.8"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-gametest

> 本档正文的类名/签名只来自 `data/fabric_1.21.8` 本档语料：页面 `fabric-docs/1.21.8/processed/develop_automatic-testing.md`（Game Tests / Running Game Tests / Run Game Tests on GitHub Actions 三节），代码 `reference/1.21.8/build.gradle`、`reference/1.21.8/src/gametest/resources/fabric.mod.json`、`reference/1.21.8/src/gametest/java/com/example/docs/FabricDocsGameTest.java`、`reference/1.21.8/src/gametest/java/com/example/docs/FabricDocsClientGameTest.java`。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.21.4 / 1.21.10 / 1.21.11 / 26.1.2）补全。

## 先读这条：本档与邻档不同名（禁止互抄）

本档服务端 game test 用的是 **Fabric API 自己的 `@GameTest`**（`net.fabricmc.fabric.api.gametest.v1.GameTest`）+ `CustomTestMethodInvoker` + 原版 `GameTestHelper`。

`data/fabric_1.21.4` 的同名参考文件是**另一套**：`net.minecraft.test.GameTest` / `net.minecraft.test.TestContext` / `FabricGameTest` / `@GameTest(templateName = EMPTY_STRUCTURE)` / `expectBlock` / `complete`。1.21.10 与本档同形，但那是另一档语料，同样禁止互抄。

⇒ 本档**没有** `TestContext`、`FabricGameTest`、`EMPTY_STRUCTURE`、`expectBlock`、`complete` 这些名字，不要写。

## Loom 侧装配（build.gradle）

页面原话：服务端与客户端 game test 都可手工装配或用 Fabric Loom，本指南走 Loom。本档 `reference/1.21.8/build.gradle` 内 `automatic-testing:game-test:1` 标记段逐字是：

```groovy
fabricApi {
	configureTests {
		createSourceSet = true
		modId = "fabric-docs-reference-test-${project.name}"
		eula = true
	}
}
```

- 本档这段**没有** `enableGameTests` / `enableClientGameTests` 两行（那是 1.21.10 档形态），不要替本档补。
- 全部可选项页面指向 `./loom/fabric-api#tests`；本 Skill 不列 ⇒ `TODO(未核实)`。
- 单元测试那一半（`test { useJUnitPlatform() }`、Fabric Loader JUnit 依赖）是同页另一主题，不属本 Skill。

## gametest 源集的 fabric.mod.json

页面：启用 `createSourceSet` 后 game test 在独立源集、带独立 `fabric.mod.json`，模块名默认 `gametest`，放 `src/gametest/resources/`。本档盘上这份逐字是：

```json
{
  "schemaVersion": 1,
  "id": "fabric-docs-reference-test",
  "version": "1.0.0",
  "name": "Fabric docs reference",
  "icon": "assets/fabric-docs-reference/icon.png",
  "environment": "*",
  "entrypoints": {
    "fabric-gametest": [
      "com.example.docs.FabricDocsGameTest"
    ],
    "fabric-client-gametest": [
      "com.example.docs.FabricDocsClientGameTest"
    ]
  }
}
```

entrypoint 键名是本档要点：服务端 `fabric-gametest`、客户端 `fabric-client-gametest`。页面正文也逐字给出类路径 `src/gametest/java/com/example/docs/FabricDocsGameTest` 与 `.../FabricDocsClientGameTest`。

## 服务端 game test：CustomTestMethodInvoker

```java
package com.example.docs;

import java.lang.reflect.Method;

import net.minecraft.gametest.framework.GameTestHelper;
import net.minecraft.world.level.block.Blocks;

import net.fabricmc.fabric.api.gametest.v1.CustomTestMethodInvoker;
import net.fabricmc.fabric.api.gametest.v1.GameTest;

public class FabricDocsGameTest implements CustomTestMethodInvoker {
	@GameTest
	public void test(GameTestHelper context) {
		context.assertBlockPresent(Blocks.AIR, 0, 0, 0);
		context.succeed();
	}

	@Override
	public void invokeTestMethod(GameTestHelper context, Method method) throws ReflectiveOperationException {
		context.setBlock(0, 0, 0, Blocks.AIR);
		method.invoke(this, context);
	}
}
```

- 注解 `@GameTest` 来自 **`net.fabricmc.fabric.api.gametest.v1`**，本档示例是**裸用**（不带任何属性括号），测试方法签名 `public void test(GameTestHelper context)`。
- `GameTestHelper` 上本档只出现三个调用：`assertBlockPresent(Blocks.AIR, 0, 0, 0)`、`succeed()`、`setBlock(0, 0, 0, Blocks.AIR)`。注意实参顺序差异：断言是「方块在前、坐标在后」，放置是「坐标在前、方块在后」。其余方法 ⇒ `TODO(未核实)`。
- `@Override invokeTestMethod(GameTestHelper context, Method method) throws ReflectiveOperationException` 是实现 `CustomTestMethodInvoker` 必须提供的钩子：本档示例在真正反射调用（`method.invoke(this, context)`）之前先把坐标 `(0,0,0)` 设成 `Blocks.AIR`。`Method` 是 `java.lang.reflect.Method`。
- 本档参考文件里**没有**出现 `GameTestRegistry` / `registerTestFunctions` / `@GameTestBatch` ⇒ 不写。

## 客户端 game test

```java
package com.example.docs;

import net.fabricmc.fabric.api.client.gametest.v1.FabricClientGameTest;
import net.fabricmc.fabric.api.client.gametest.v1.context.ClientGameTestContext;
import net.fabricmc.fabric.api.client.gametest.v1.context.TestSingleplayerContext;

@SuppressWarnings("UnstableApiUsage")
public class FabricDocsClientGameTest implements FabricClientGameTest {
	@Override
	public void runTest(ClientGameTestContext context) {
		try (TestSingleplayerContext singleplayer = context.worldBuilder().create()) {
			singleplayer.getClientWorld().waitForChunksRender();
			context.takeScreenshot("fabric-docs-reference-singleplayer-test");
		}
	}
}
```

- 类实现 `FabricClientGameTest`，覆写 `runTest(ClientGameTestContext context)`，整类带 `@SuppressWarnings("UnstableApiUsage")`。
- 调用面：`context.worldBuilder().create()`（try-with-resources ⇒ `TestSingleplayerContext` 可关闭）、`singleplayer.getClientWorld().waitForChunksRender()`、`context.takeScreenshot(String)`。
- `worldBuilder()` 返回类型、`create()` 重载、`getClientWorld()` 返回类型本档均未写 ⇒ `TODO(未核实)`。

## 运行

页面 Running Game Tests 一节逐字：服务端 game test 随 `build` Gradle 任务自动跑；客户端 game test 用 **`runClientGameTest`** Gradle 任务跑。

（`configureTests` 会在 Loom 侧生成该任务，页面指向 `./loom/fabric-api#tests` 看全量任务名；其余任务名本档未出现。）

## CI 上跑客户端 game test

页面：现有用 `build` 的 workflow 已自动跑服务端测试；要在 CI 跑客户端测试，需在 `build.gradle` 加一段并用 Loom 的 production run tasks（页面链接原文为 `./loom/production-run-tasks`）。本档 `reference/1.21.8/build.gradle` 里 `automatic-testing:game-test:2` 标记段（两处）逐字是：

```groovy
dependencies {
  // ...
  productionRuntimeMods "net.fabricmc.fabric-api:fabric-api:${fabricApiVersion}"
}

tasks.register("runProductionClientGameTest", net.fabricmc.loom.task.prod.ClientProductionRunTask) {
	jvmArgs.add("-Dfabric.client.gametest")
	// Whether to use XVFB to run the game, using a virtual framebuffer. This is useful for headless CI environments.
	// Defaults to true only on Linux and when the "CI" environment variable is set.
	// XVFB must be installed, on Debian-based systems you can install it with: `apt install xvfb`
	useXVFB = true
}
```

- 关键名：`productionRuntimeMods`（配置块名）、`net.fabricmc.loom.task.prod.ClientProductionRunTask`（任务类型 FQCN）、任务名 `runProductionClientGameTest`、`jvmArgs.add("-Dfabric.client.gametest")`、`useXVFB`。
- **配套 workflow YAML 未落盘**：页面转引 `@[code lang=yaml transcludeWith=:::automatic-testing:game-test:3](@/.github/workflows/build.yml)`，而 `data/fabric_1.21.8/.github/workflows/build.yml` 在盘上不存在 ⇒ 该 job 片段无法引用，留 `TODO(未核实)`，不要自拟 `uses:`/`with:` 键。
- 本档页面**没有**「game test 在 GitHub Actions 上可能因 network synchronizer 失败」的告警块（那是 1.21.10 档才有的），故 `-Dfabric.client.gametest.disableNetworkSynchronizer=true` 不属本档。

## 结构模板（structure）

本档 `reference/1.21.8/src/gametest/` 下实测只有 `resources/fabric.mod.json` 与两份 java，无 `.nbt`、无 `data/`。页面也未讲结构模板放置路径 ⇒ `TODO(未核实)`。本档示例的 `@GameTest` 不带 `templateName`，与 1.21.4 形态不同。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：`data/fabric_1.21.8/reference/1.21.8/build.gradle` 写 `mappings loom.officialMojangMappings()`。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `GameTestHelper` | `TestContext` | 1.16.5–1.21.11 | join（`net.minecraft.test.TestContext`） |

- 上表「Yarn 对应名」只由本档 `mappings/yarn-mappings.sqlite` 证实**类名存在与其包路径**，**不证实**方法名、参数与返回值。逐签名以 Yarn 源码为准：`get_minecraft_source`（需 JDK 17+）或 IDE `./gradlew genSources`。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。

## 本档未覆盖（禁止默写）

- `@GameTest` 的属性面（超时、batch、structureName/templateName 等）：本档示例为裸注解，无任何属性证据。
- `GameTestHelper` 除 `assertBlockPresent` / `succeed` / `setBlock` 之外的方法；`CustomTestMethodInvoker` 除 `invokeTestMethod` 之外的成员。
- `ClientGameTestContext` 除 `worldBuilder` / `takeScreenshot` 之外的方法；`worldBuilder()` 链上其余 API。
- `registerTestFunctions`、`FabricGameTest`（1.21.4 面）、`TestContext`（1.21.4 面）：本档语料零出现。
- CI workflow YAML 正文（文件未落盘，见上节）。
- 单元测试（Fabric Loader JUnit、`beforeAll` 注册表预热）：同页前半属另一主题，本 Skill 未取。
- 映射口径提醒：本档 frontmatter 钉 `mappings: yarn`，而 `reference/1.21.8/build.gradle` 用 `mappings loom.officialMojangMappings()`，正文里的 `net.minecraft.*` 名因此是官方名。工程真用 Yarn 时须自行 `convert_mapping` 对照，禁止把上面的包名当 Yarn 名直写。
- 需要逐签名核实 Fabric API 侧（`net.fabricmc.fabric.api.gametest.v1` / `...client.gametest.v1`）：用 `query_loader_api(platform=fabric, minecraftVersion=1.21.8)`，或用户自备 jar 走 `ingest_loader_api`。

## 相关

- 注册与生命周期：`01-registry.mdc` / `mc-registry`；数据生成：`07-datagen.mdc` / `mc-datagen`；客户端/服务端分离：`08-client-server.mdc`
- Fabric API 模块面：`mc-fabric-api`
- 本档核实表：`fabric/1.21.8/knowledge/common/verified-api-1.21.8.md`
- 反模式：`09-anti-patterns.mdc`
- 全文核对：`get_fabric_doc_full(version="1.21.8", id="develop_automatic-testing")`
