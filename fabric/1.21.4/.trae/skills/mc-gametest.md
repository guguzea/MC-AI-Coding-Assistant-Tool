---
name: mc-gametest
description: GameTest 结构测试。触发词：GameTest、@GameTest
platform: fabric
version: "1.21.4"
dependencies: []
mappings: yarn
---

# mc-gametest

> 本档正文的类名/签名只来自 `data/fabric_1.21.4` 本档语料：页面 `fabric-docs/1.21.4/processed/develop_automatic-testing.md`（Game Tests 一节），代码 `reference/1.21.4/build.gradle`、`reference/1.21.4/src/gametest/resources/fabric.mod.json`、`reference/1.21.4/src/gametest/java/com/example/docs/FabricDocsGameTest.java`、`reference/1.21.4/src/gametest/java/com/example/docs/FabricDocsClientGameTest.java`。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.21.8 / 1.21.10 / 1.21.11 / 26.1.2）补全——**本主题的 API 面在 1.21.4 与 1.21.8+ 之间确实换了**，见下节。

## 先读这条：本档与邻档不同名（禁止互抄）

本档参考代码的 import 是 `net.minecraft.block.Blocks`、`net.minecraft.test.GameTest`、`net.minecraft.test.TestContext`，服务端测试类实现 `FabricGameTest`，注解写成 `@GameTest(templateName = EMPTY_STRUCTURE)`，上下文方法叫 `expectBlock` / `complete`。

`data/fabric_1.21.8` 与 `data/fabric_1.21.10` 的同名参考文件用的是另一套：`net.minecraft.gametest.framework.GameTestHelper`、`net.minecraft.world.level.block.Blocks`、`net.fabricmc.fabric.api.gametest.v1.GameTest`、`CustomTestMethodInvoker`、`assertBlockPresent` / `succeed`。**两套不得互抄**，也不得拿其中一套去「修」另一套。

反过来也成立：本档页面与代码里**没有** `GameTestHelper`、`CustomTestMethodInvoker`、`assertBlockPresent`、`succeed` 这些名字，不要写。

## Loom 侧装配（build.gradle）

页面原话：服务端与客户端 game test 都可以手工装配或用 Fabric Loom，本指南走 Loom。本档 `reference/1.21.4/build.gradle` 里 `automatic-testing:game-test:1` 标记段的内容逐字是：

```groovy
fabricApi {
	configureTests {
		createSourceSet = true
		modId = "fabric-docs-reference-test-${project.name}"
		eula = true
	}
}
```

- 本档这段**没有** `enableGameTests` / `enableClientGameTests` 两行（那是 1.21.10 档的形态），不要替本档补上。
- 页面指向「Loom documentation on tests」（`./loom/fabric-api#tests`）看全部可选项；本 Skill 不列全量选项 ⇒ `TODO(未核实)`。
- 单元测试那一半（`test { useJUnitPlatform() }`、Fabric Loader JUnit 依赖）是同页的另一主题，本 Skill 不覆盖。

## gametest 源集的 fabric.mod.json

页面：启用 `createSourceSet` 后 game test 在独立源集、带独立 `fabric.mod.json`，模块名默认 `gametest`，文件放 `src/gametest/resources/`。本档盘上这份逐字是：

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

两个 entrypoint 键名是本档要点：服务端 `fabric-gametest`、客户端 `fabric-client-gametest`。页面正文也逐字给出对应类路径：`src/gametest/java/com/example/docs/FabricDocsGameTest` 与 `.../FabricDocsClientGameTest`（盘上两份 .java 与之一致）。

## 服务端 game test

```java
package com.example.docs;

import net.minecraft.block.Blocks;
import net.minecraft.test.GameTest;
import net.minecraft.test.TestContext;

import net.fabricmc.fabric.api.gametest.v1.FabricGameTest;

public class FabricDocsGameTest implements FabricGameTest {
	@GameTest(templateName = EMPTY_STRUCTURE)
	public void test(TestContext context) {
		context.expectBlock(Blocks.AIR, 0, 0, 0);
		context.complete();
	}
}
```

- 类实现 `net.fabricmc.fabric.api.gametest.v1.FabricGameTest`（Fabric API 侧）。
- 注解 `@GameTest` 来自 `net.minecraft.test.GameTest`，本档示例只用到一个属性 `templateName`，值 `EMPTY_STRUCTURE`——该常量在本档参考文件里**没有 import、没有定义**，只能推断它由所实现的 `FabricGameTest` 接口继承而来；其声明处未核实。
- 测试方法签名：`public void test(TestContext context)`，返回 `void`。
- `TestContext` 上本档只出现两个调用：`expectBlock(Blocks.AIR, 0, 0, 0)`（方块断言，坐标是三分量）与 `complete()`（无参、结束用例）。其余方法 ⇒ `TODO(未核实)`。
- 页面结尾原话：「See the respective Javadocs in Fabric API for more info.」——本 Skill 不是 Javadoc 替代品。

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

- 入口方法是 `@Override public void runTest(ClientGameTestContext context)`，类实现 `FabricClientGameTest`，整类带 `@SuppressWarnings("UnstableApiUsage")`。
- 本档出现的调用面：`context.worldBuilder().create()`（try-with-resources，说明 `TestSingleplayerContext` 可关闭）、`singleplayer.getClientWorld().waitForChunksRender()`、`context.takeScreenshot(String)`。
- `worldBuilder()` 的返回类型、`create()` 的重载、`getClientWorld()` 的返回类型：本档页面与参考文件都未写 ⇒ `TODO(未核实)`，不要自拟。

## 结构模板（structure）

页面未讲结构模板文件的放置，本档 `reference/1.21.4/src/gametest/` 下实测**只有** `resources/fabric.mod.json` 与两份 java，没有 `.nbt` 结构文件，也没有 `data/` 目录。⇒ `templateName` 指向的结构资源路径本档无可引证据，留 `TODO(未核实)`；示例之所以能跑是因为用了 `EMPTY_STRUCTURE`。

## 本档未覆盖（禁止默写）

- **运行方式**：本档页面**没有**「Running Game Tests」一节，`build` 任务自动跑服务端测试、`runClientGameTest` 任务名等只在 1.21.8+ 档出现 ⇒ 本档不写，需要时 `get_fabric_doc_full(version="1.21.4", id="develop_automatic-testing")` 复核。
- **GitHub Actions 跑 game test**：本档页面同样无该节（1.21.8+ 才有 `runProductionClientGameTest` / `ClientProductionRunTask` / `useXVFB` / `-Dfabric.client.gametest` 等），一律不属本档。
- `@GameTest` 的其余属性（超时、batch、required 等）、`GameTestRegistry`、`@GameTestBatch`、结构模板注解：本档语料零出现。
- `TestContext` 除 `expectBlock` / `complete` 之外的方法；`ClientGameTestContext` 除 `worldBuilder` / `takeScreenshot` 之外的方法。
- `FabricGameTest` 接口本体（含 `EMPTY_STRUCTURE` 常量声明）：需 `query_loader_api(platform=fabric, minecraftVersion=1.21.4)` 或用户自备 Fabric API jar 核实。
- 单元测试（Fabric Loader JUnit、注册表预热）：同页前半属另一主题，本 Skill 未取；页内逐字出现的只有 `org.junit.jupiter.api.Assertions`、`ItemStack`、`SharedConstants`、`beforeAll`。
- 映射口径提醒：本档 frontmatter 钉 `mappings: yarn`，而 `reference/1.21.4/build.gradle` 用的是 `mappings loom.officialMojangMappings()`，正文里的 `net.minecraft.*` 名因此是官方名。工程真用 Yarn 时须自行 `convert_mapping` 对照，禁止把上面的包名当 Yarn 名直写。

## 相关

- 注册与生命周期：`01-registry.mdc` / `mc-registry`；数据生成：`07-datagen.mdc` / `mc-datagen`；客户端/服务端分离：`08-client-server.mdc`
- Fabric API 模块面：`mc-fabric-api`
- 本档核实表：`fabric/1.21.4/knowledge/common/verified-api-1.21.4.md`
- 反模式：`09-anti-patterns.mdc`
- 全文核对：`get_fabric_doc_full(version="1.21.4", id="develop_automatic-testing")`
